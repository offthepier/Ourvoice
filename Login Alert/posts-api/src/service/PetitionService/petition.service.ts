import {
  ExecuteStatementCommand,
  GetItemOutput,
} from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import Post from "src/models/Post";
import { POST_STATUS } from "src/constants/PostStatusTypes";
import { USER_ROLES } from "src/constants/UserRoles";
import newsFeedService from "../NewsFeedService";
import IGetMpPosts from "src/interfaces/GetMpPosts.interface";
import IGetMpPostKey from "src/interfaces/GetMpPostsKey.interface";
import Vote from "src/models/Vote";
import VOTES_TYPES from "src/constants/VotesType";
import challengesService from "../ChallengeService";
import { POST_TYPES } from "src/constants/PostTypes copy";
import userInfoService from "../GetUserInfoService";
import { ERROR_MESSAGES } from "src/constants/ErrorMessages";
import COMMUNITY_TYPES from "src/constants/CommunityTypes";
import { NotFoundError } from "src/helpers/httpErrors/NotFoundError";
import followersService from "../FollowersService";
import PostSearchResult from "src/models/PostSearch";
import { ddbDocClient } from "src/config/dynamodbClient";
import * as AWS from "aws-sdk";
import { encrypt } from "src/utils/encrypt";

class PostService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string,
    private readonly mpTableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): Post => {
    return {
      postId: item?.["postId"],
      challengeID: item["challengeId"],
      challenge: item["challenge"],
      community: item["community"],
      title: item?.["postData"].title,
      description: item?.["postData"]?.description,
      images: item?.["postData"].images,
      postType: item["postData"].postType,
      tags: item["tags"],
      createdAt: item["createdAt"],
      userId: item["userId"] ?? item["userID"],
      userFirstName: item["userFirstName"],
      userLastName: item["userLastName"],
      status: item["status"],
      negativeVotes: item["negativeVotes"],
      positiveVotes: item["positiveVotes"],
      likes: item["likes"],
      communityType: item?.["communityType"],
    };
  };

  //Map DynamoDB table column names
  mapAttributesForPublic = (item: GetItemOutput): Post => {
    return {
      postId: item?.["postId"],
      challengeID: item["challengeID"],
      challenge: item["challenge"],
      community: item["community"],
      title: item?.["postData"].title,
      description: item?.["postData"]?.description,
      images: item?.["postData"].images,
      postType: item["postData"].postType,
      tags: item["tags"],
      createdAt: item["createdAt"],
      userId: encrypt(item["userId"] ?? item["userID"]),
      userFirstName: item["userFirstName"],
      userLastName: item["userLastName"],
      status: item["status"],
      negativeVotes: item["negativeVotes"],
      positiveVotes: item["positiveVotes"],
      likes: item["likes"],
      communityType: item?.["communityType"],
    };
  };

  mapTopAttributes = async (
    item: GetItemOutput,
    userId: string
  ): Promise<Post> => {
    return {
      postId: item?.["postId"],
      challengeID: item["challengeID"],
      challenge: item["challenge"],
      community: item["community"],
      title: item?.["postData"].title,
      description: item?.["postData"]?.description,
      postType: item["postData"].postType,
      createdAt: item["createdAt"],
      userId: encrypt(item["userId"] ?? item["userID"]),
      userFirstName: item["userFirstName"],
      userLastName: item["userLastName"],
      negativeVotes: item["negativeVotes"],
      positiveVotes: item["positiveVotes"],
      likes: item["likes"],
      followStatus: await followersService.getPostFollowStatus(
        userId,
        item?.["postId"]
      ),
    };
  };

  async createPost(post: Post): Promise<Post> {
    //Get User Info of the post creator
    const user = await userInfoService.getUserProfile(post.userId);

    //check if user valid
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
    }

    //Generate a Unique ID for the post
    const postId = uuid();
    post.postId = postId;

    //set community of the post
    let community;
    if (post.community == COMMUNITY_TYPES.LOCAL) {
      community = user.electorate.localElectorate;
    } else if (post.community == COMMUNITY_TYPES.STATE) {
      community = user.electorate.stateElectorate;
    } else {
      community = user.electorate.federalElectorate;
    }

    // Initialize Object and set common parameters
    let dynamoObject: any = {
      Item: {
        challengeId: post.challengeID,
        challenge: post.challenge,
        community: community.toLowerCase(),
        communityType: post.community,
        postData: {
          title: post.title,
          description: post.description,
          images: post.images,
          postType: post.postType,
        },
        tags: post.tags,
        userFirstName: post.userFirstName,
        userLastName: post.userLastName,
        userRole: post.userRole,
        createdAt: post.createdAt,
        status: POST_STATUS.ACTIVE,
        uniqueCommunity: `${community.toLowerCase()}#${post.community}`,
      },
    };

    console.log(post.title.trim().length);
    if (post.title.trim().length > 0) {
      dynamoObject.Item.searchableText = `${post.title.toLowerCase()}`;
    }

    //Set Specific attributes related to different posts types
    if (post.postType == POST_TYPES.PROPOSAL) {
      //set attributes for Proposal Type Posts
      dynamoObject.Item.negativeVotes = 0;
      dynamoObject.Item.positiveVotes = 0;
    } else {
      dynamoObject.Item.likes = 0;
    }

    //Set Specific attributes related to different User types
    if (post.userRole == USER_ROLES.MP) {
      //set MP attributes
      dynamoObject.TableName = this.mpTableName;
      dynamoObject.Item.postId = `MP#${postId}`;
      dynamoObject.Item.sk = `POST#${postId}`;
      dynamoObject.Item.itemType = `POST`;
      dynamoObject.Item.userID = post.userId;

      post.postId = `MP#${postId}`;

      //Save Posts to MP POSTS Table
      await this.docClient.put(dynamoObject).promise();

      await newsFeedService.updateFeeds(post, community);
      await newsFeedService.updateFeedsChallenge(post, community);
    } else {
      //set Citizen attributes
      dynamoObject.TableName = this.tableName;
      dynamoObject.Item.postId = postId;
      dynamoObject.Item.sk = `POST#${postId}`;
      dynamoObject.Item.pk = `USER#${post.userId}`;
      dynamoObject.Item.itemType = `POST`;
      dynamoObject.Item.userId = post.userId;

      //Save Post to User POSTS Table
      await this.docClient.put(dynamoObject).promise();

      //Update Followers News Feeds
      await newsFeedService.updateFeeds(post, community);
      await newsFeedService.updateFeedsChallenge(post, community);
    }

    console.log(dynamoObject);

    //Update posts count belongs to a particular challenge
    await challengesService.updatePostsCount(post.challengeID);
    return post;
  }

  /**
   * This function updates a post in either the MP POSTS Table or User POSTS Table in DynamoDB based on
   * the user's role.
   * @param {Post} post - The `post` parameter is an object of type `Post` which contains information
   * about a post, such as its ID, user ID, description, images, post type, and tags.
   * @returns a Promise that resolves to a Post object.
   */
  async updatePost(post: Post): Promise<Post> {
    // Define the update expression and attribute values
    const updateExpression = `SET #postData = :postData,  #tags = :tags`;
    const expressionAttributeNames = {
      "#tags": "tags",
      "#postData": "postData",
    };
    const expressionAttributeValues = {
      ":tags": post.tags,
      ":postData": {
        description: post.description,
        images: post.images,
        postType: post.postType,
        title: post.title,
      },
    };

    // Set specific attributes related to different User types
    let dynamoObject: any;
    if (post.userRole == USER_ROLES.MP) {
      // Set MP attributes
      dynamoObject = {
        TableName: this.mpTableName,
        Key: {
          userID: post.userId,
          sk: `POST#${post.postId.substring(3)}`, //remove 'MP#' from postId
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      };

      // Update the post in MP POSTS Table
      await this.docClient.update(dynamoObject).promise();
    } else {
      // Set Citizen attributes
      dynamoObject = {
        TableName: this.tableName,
        Key: {
          pk: `USER#${post.userId}`,
          sk: `POST#${post.postId}`,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      };

      // Update the post in User POSTS Table
      const result = await this.docClient.update(dynamoObject).promise();
      console.log(result.$response);
    }

    console.log(dynamoObject);

    return post;
  }

  async getPostsByUser(
    userId: string,
    userRole: string,
    limit,
    lastEvaluatedKey: any
  ): Promise<{ lastEvaluatedKey: any; posts: Post[] }> {
    const posts = await this.docClient
      .query({
        TableName:
          userRole == USER_ROLES.MP ? this.mpTableName : this.tableName,
        IndexName:
          userRole == USER_ROLES.MP ? "SortedIndex" : "DateSortedIndex",
        KeyConditionExpression:
          userRole == USER_ROLES.MP ? "userID = :pk" : "pk = :pk",
        ExpressionAttributeValues:
          userRole == USER_ROLES.MP
            ? {
                ":pk": userId,
              }
            : {
                ":pk": `USER#${userId}`,
              },
        ScanIndexForward: false,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: limit,
      })
      .promise();

    return {
      lastEvaluatedKey: posts.LastEvaluatedKey,
      posts: posts.Items.map((e) => {
        return this.mapAttributesForPublic(e);
      }),
    };
  }

  async getPostById(postId: string): Promise<Post> {
    const posts = await this.docClient
      .query({
        TableName: postId.startsWith("MP") ? this.mpTableName : this.tableName,
        IndexName: "IdSortedIndex",
        KeyConditionExpression: "postId = :pk",
        ExpressionAttributeValues: {
          ":pk": postId,
        },
        Limit: 1,
      })
      .promise();

    return this.mapAttributes(posts.Items?.[0]);
  }

  async getMPPostsByElectorate(
    electorate: string,
    limit: number,
    lastKey?: IGetMpPostKey
  ): Promise<IGetMpPosts> {
    console.log("Load from ", electorate);

    const posts = await this.docClient
      .query({
        TableName: this.mpTableName,
        IndexName: "SortedCommunityIndex",
        KeyConditionExpression: "uniqueCommunity = :pk",
        ExpressionAttributeValues: {
          ":pk": `${electorate}`,
        },
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: lastKey,
      })
      .promise();

    console.log("____ MP Posts ____");
    console.log(posts);

    return {
      posts: posts.Items.map((e) => {
        return this.mapAttributesForPublic(e);
      }),
      lastEvaluatedKey: posts.LastEvaluatedKey as IGetMpPostKey,
      count: posts.Count,
    };
  }

  //Returns latest posts belongs to all three electorates of a user
  async getMPPostsByAllElectorates(
    localElectorate: string,
    stateElectorate: string,
    federalElectorate: string,
    limit
  ): Promise<IGetMpPosts> {
    let localPosts = await this.getMPPostsByElectorate(
      `${localElectorate.toLowerCase()}#${COMMUNITY_TYPES.LOCAL}`,
      limit
    );
    let statePosts = await this.getMPPostsByElectorate(
      `${stateElectorate.toLowerCase()}#${COMMUNITY_TYPES.STATE}`,
      limit
    );

    let federalPosts = await this.getMPPostsByElectorate(
      `${federalElectorate.toLowerCase()}#${COMMUNITY_TYPES.FEDERAL}`,
      limit
    );

    // Combine the three arrays into one
    const combinedArray = []
      .concat(localPosts.posts, statePosts.posts, federalPosts.posts)
      .filter((item, i, arr) => item && arr.indexOf(item) === i);

    // Sort the combined array by the "createdAt" attribute in descending order
    combinedArray.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (a.createdAt < b.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });

    return {
      posts: combinedArray.slice(0, limit),
      lastEvaluatedKey: null,
      count: combinedArray.slice(0, limit).length,
    };
  }

  async getMPPosts(
    limit: number,
    lastKey?: IGetMpPostKey
  ): Promise<IGetMpPosts> {
    const posts = await this.docClient
      .scan({
        TableName: this.mpTableName,
        IndexName: "SortedIndex",
        Limit: limit,
        ExclusiveStartKey: lastKey,
      })
      .promise();

    return {
      posts: posts.Items.map((e) => {
        return this.mapAttributesForPublic(e);
      }),
      lastEvaluatedKey: posts.LastEvaluatedKey as IGetMpPostKey,
      count: posts.Count,
    };
  }

  async getPostsByElectorate(
    electorate: string,
    limit: number,
    lastKey?: IGetMpPostKey
  ): Promise<IGetMpPosts> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "SortedCommunityIndex",
        KeyConditionExpression: "uniqueCommunity = :pk",
        ExpressionAttributeValues: {
          ":pk": `${electorate}`,
        },
        Limit: limit,
        ExclusiveStartKey: lastKey,
      })
      .promise();

    console.log("____ Posts Last Evaluated Key ____");
    console.log(posts.LastEvaluatedKey);
    console.log("____ Scanned Count ", posts.ScannedCount);

    return {
      posts: posts.Items.map((e) => {
        return this.mapAttributesForPublic(e);
      }),
      lastEvaluatedKey: posts.LastEvaluatedKey as IGetMpPostKey,
      count: posts.Count,
    };
  }

  async getPosts(limit: number, lastKey?: IGetMpPostKey): Promise<IGetMpPosts> {
    const posts = await this.docClient
      .scan({
        TableName: this.tableName,
        IndexName: "DateSortedIndex",
        Limit: limit,
        ExclusiveStartKey: lastKey,
      })
      .promise();

    return {
      posts: posts.Items.map((e) => {
        return this.mapAttributesForPublic(e);
      }),
      lastEvaluatedKey: posts.LastEvaluatedKey as IGetMpPostKey,
      count: posts.Count,
    };
  }

  /*Batch Get from both tables - max count 100*/
  async batchGetFromKeys(keys: any[]): Promise<Post[]> {
    //mp table keys list
    let mpKeysList = [];
    //user table keys list
    let userKeyList = [];

    //map keys based on post type
    for (const key of keys) {
      if (key?.postID?.startsWith("MP#")) {
        mpKeysList.push({
          userID: key.postedBy,
          sk: `POST#${key?.postID.replace("MP#", "")}`,
        });
      } else {
        userKeyList.push({
          pk: `USER#${key?.postedBy}`,
          sk: `POST#${key?.postID}`,
        });
      }
    }

    try {
      //Batch get parameters
      let params = {
        RequestItems: {} as any,
      };

      //Set User Posts Keys List
      if (userKeyList.length > 0) {
        params.RequestItems = {
          ...params.RequestItems,
          [this.tableName]: {
            Keys: userKeyList,
          },
        };
      }

      //Set Mp Post Keys List
      if (mpKeysList.length > 0) {
        params.RequestItems = {
          ...params.RequestItems,
          [this.mpTableName]: {
            Keys: mpKeysList,
          },
        };
      }

      //Batch get from both tables
      const posts = await this.docClient.batchGet(params).promise();

      // console.log("___POSTS__")
      // console.log(posts)

      //Combine results from both tables
      const combinedArray = []
        .concat(
          posts.Responses[this.tableName],
          posts.Responses[this.mpTableName]
        )
        .filter((item, i, arr) => item && arr.indexOf(item) === i);

      //map posts objects
      const postObjects = combinedArray.map((e) => {
        return this.mapAttributesForPublic(e);
      });

      //Sort and return According to time
      return postObjects.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else if (a.createdAt < b.createdAt) {
          return 1;
        } else {
          return 0;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async votePost(vote: Vote): Promise<string> {
    console.log("___Petition Vote Count Updating___");

    // Extracted countAttributeName
    let countAttributeName;
    if (vote.voteType == VOTES_TYPES.LIKE) {
      countAttributeName = "likes";
    } else if (vote.voteType == VOTES_TYPES.POSITIVE) {
      countAttributeName = "positiveVotes";
    } else {
      countAttributeName = "negativeVotes";
    }

    const params = {
      TableName: vote.postID.startsWith("MP#")
        ? this.mpTableName
        : this.tableName,
      Key: vote.postID.startsWith("MP#")
        ? {
            userID: vote.postCreatorId,
            sk: `POST#${vote.postID.slice(3)}`,
          }
        : { pk: `USER#${vote.postCreatorId}`, sk: `POST#${vote.postID}` },

      UpdateExpression: "ADD #countAttribute :inc",

      ExpressionAttributeNames: {
        "#countAttribute": countAttributeName,
      },
      ExpressionAttributeValues: {
        ":inc": vote.status ? 1 : -1,
      },
      ConditionExpression: vote.postID.startsWith("MP#")
        ? "attribute_exists(userID) AND attribute_exists(sk)"
        : "attribute_exists(pk) AND attribute_exists(sk)",
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await this.docClient.update(params).promise();
      console.log(data.Attributes);
      if (data)
        return vote.status
          ? "Successfully Liked Post"
          : "Successfully Unliked Post";
    } catch (err) {
      console.error("Error updating count in DynamoDB: ", err);
      return "Error Liking Comment";
    }
  }

  async changeVote(vote: Vote): Promise<string> {
    console.log("___Petition Vote Count Updating___");
    const params = {
      TableName: vote.postID.startsWith("MP#")
        ? this.mpTableName
        : this.tableName,
      Key: vote.postID.startsWith("MP#")
        ? {
            userID: vote.postCreatorId,
            sk: `POST#${vote.postID.slice(3)}`,
          }
        : { pk: `USER#${vote.postCreatorId}`, sk: `POST#${vote.postID}` },
      UpdateExpression: "ADD #vote1 :inc, #vote2 :dec",
      ExpressionAttributeNames: {
        "#vote1":
          vote.voteType == VOTES_TYPES.POSITIVE
            ? "positiveVotes"
            : "negativeVotes",
        "#vote2":
          vote.voteType == VOTES_TYPES.POSITIVE
            ? "negativeVotes"
            : "positiveVotes",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
        ":dec": -1,
      },
      ConditionExpression: vote.postID.startsWith("MP#")
        ? "attribute_exists(userID) AND attribute_exists(sk)"
        : "attribute_exists(pk) AND attribute_exists(sk)",
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await this.docClient.update(params).promise();
      console.log(data.Attributes);
      if (data)
        return vote.status
          ? "Successfully Liked Post"
          : "Successfully Unliked Post";
    } catch (err) {
      console.error("Error updating count in DynamoDB: ", err);
      return "Error Liking Comment";
    }
  }

  async getTopSolutions(limit: number, userId: string): Promise<Post[]> {
    //Get top list from MP Table
    const topSolutionsFromMps = await this.docClient
      .query({
        TableName: this.mpTableName,
        IndexName: "TopProposalsIndex",
        KeyConditionExpression: "itemType = :pk",
        ExpressionAttributeValues: {
          ":pk": "POST",
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();

    //Get top list from Users Table
    const topSolutionsFromUsers = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "TopProposalsIndex",
        KeyConditionExpression: "itemType = :pk",
        ExpressionAttributeValues: {
          ":pk": "POST",
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();

    // Merge the two arrays
    const combinedArray = []
      .concat(topSolutionsFromMps.Items, topSolutionsFromUsers.Items)
      .filter((item, i, arr) => item && arr.indexOf(item) === i);

    // Sort the combined array in descending order by the positiveVotesCount property
    combinedArray.sort((a: Post, b: Post) => b.positiveVotes - a.positiveVotes);

    // Get the top 10 items
    const top10 = combinedArray.slice(0, 10);

    const notifications = top10.map(async (e) => {
      return await this.mapTopAttributes(e, userId);
    });

    return await Promise.all(notifications);
  }

  async getPostsByChallenge(
    challengeId: string,
    limit: number
  ): Promise<Post[]> {
    //Get top list from MP Table
    const mpPosts = await this.docClient
      .query({
        TableName: this.mpTableName,
        IndexName: "ChallengeIndex",
        KeyConditionExpression: "challengeId = :pk",
        ExpressionAttributeValues: {
          ":pk": challengeId,
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();

    //Get top list from Users Table
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "ChallengeIndex",
        KeyConditionExpression: "challengeId = :pk",
        ExpressionAttributeValues: {
          ":pk": challengeId,
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();

    // Merge the two arrays
    const combinedArray = mpPosts.Items.concat(posts.Items);

    // Sort the combined array in ascending order by the createdAt property
    const sortedArray = [...combinedArray].sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (a.createdAt < b.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedArray.map((e) => {
      return this.mapAttributesForPublic(e);
    });
  }

  /* 
    This function will search all posts using a keyword in both mpPosts and posts tables
  */
  async searchPost(searchParams: string): Promise<PostSearchResult[]> {
    const params = {
      Statement: `SELECT * FROM "${
        this.tableName
      }".SearchIndex WHERE itemType = 'POST' AND contains(searchableText, '${searchParams.toLowerCase()}') `,
      // Limit: 3,
    };

    const paramsMp = {
      Statement: `SELECT * FROM "${
        this.mpTableName
      }".SearchIndex WHERE itemType = 'POST' AND contains(searchableText, '${searchParams.toLowerCase()}') `,
      // Limit:
      // Limit: 3,
    };

    try {
      const data = await ddbDocClient.send(new ExecuteStatementCommand(params));
      const dataMp = await ddbDocClient.send(
        new ExecuteStatementCommand(paramsMp)
      );

      let allPosts = data?.Items.concat(dataMp.Items).slice(0, 10);

      return allPosts?.map((e) => {
        if (e) {
          let post = AWS.DynamoDB.Converter.unmarshall(e);
          return {
            postId: post?.postId,
            challenge: post?.challenge,
            title: post?.searchableText,
          };
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export default PostService;
