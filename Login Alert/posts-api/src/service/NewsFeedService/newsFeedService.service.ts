import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import COMMUNITY_TYPES from "src/constants/CommunityTypes";
import { ERROR_MESSAGES } from "src/constants/ErrorMessages";
import { NEWS_FEED_MP_POST_COUNT } from "src/constants/NewsFeed.const";
import { FEED_POSTS_TYPES } from "src/enums/FeedPostsTypes";
import { NotFoundError } from "src/helpers/httpErrors/NotFoundError";
import IGetMpPostKey from "src/interfaces/GetMpPostsKey.interface";
import Post from "src/models/Post";
import IUser from "src/models/User";

import followersService from "../FollowersService";
import userInfoService from "../GetUserInfoService";
import postsService from "../PetitionService";

interface IGetPersonalizedFeedReturn {
  posts: Post[];
  lastEvaluatedKey: IGetMpPostKey;
  lastEvaluatedType: FEED_POSTS_TYPES;
  offset: number;
  limit: number;
}
/* The NewsFeedService class is responsible for updating and generating personalized feeds for users
based on their community and the type of posts they follow. */
class NewsFeedService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): Post => {
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
      userId: item["pk"],
      userFirstName: item["userFirstName"],
      userLastName: item["userLastName"],
      status: item["status"],
    };
  };

  /**
   * This function updates the feeds of users who follow a specific user with a new post.
   * @param {Post} post - Post object containing information about the post being updated.
   * @param {string} electorate - The `electorate` parameter is a string representing the target
   * audience or group of users that the `post` should be shared with. It is used in the
   * `processBatches` function to filter and distribute the post to the appropriate followers of the
   * user who created the post.
   * @returns a string "updated feeds".
   */
  async updateFeeds(post: Post, electorate: string): Promise<string> {
    const followingUsers = await followersService.getUserFollowersList(
      post.userId
    );
    await this.processBatches(followingUsers, electorate, post);

    return "updated feeds";
  }

  /**
   * This function updates the feeds of users who are following a specific challenge with a new post.
   * @param {Post} post - The post object that needs to be processed and updated in the feeds of the
   * followers of a challenge.
   * @param {string} electorate - The `electorate` parameter is a string representing the group of users
   * who will receive the updated feeds. It is used in the `processBatches` function to filter the list
   * of following users and only update the feeds of those who belong to the specified electorate.
   * @returns a string "updated feeds".
   */
  async updateFeedsChallenge(post: Post, electorate: string): Promise<string> {
    const followingUsers = await followersService.getFollowingUsersOfChallenge(
      post.challengeID
    );
    await this.processBatches(followingUsers, electorate, post);

    return "updated feeds";
  }

  /**
   * This function processes batches of user data and writes them to a database table.
   * @param {any[]} users - an array of user objects
   * @param {string} electorate - The name of the electorate to which the post belongs.
   * @param {Post} post - The `post` parameter is an object that contains information about a post,
   * including its `postId`, `userId`, `community`, `createdAt`, etc.
   */
  private async processBatches(users: any[], electorate: string, post: Post) {
    // Build the batches
    let batches = [];
    let current_batch = [];
    let item_count = 0;

    for (const user of users) {
      // Add the item to the current batch
      item_count++;
      current_batch.push({
        PutRequest: {
          Item: {
            pk: `${user.id}#${electorate.toLowerCase()}#${post.community}`,
            userID: user.id,
            postID: post.postId,
            postedBy: post.userId,
            communityType: post.community,
            community: electorate,
            createdAt: post.createdAt,
            status: "UNREAD",
          },
        },
      });
      // If we've added 25 items, add the current batch to the batches array
      // and reset it
      if (item_count % 25 == 0) {
        batches.push(current_batch);
        current_batch = [];
      }
    }

    // Add the last batch if it has records and is not equal to 25
    if (current_batch.length > 0 && current_batch.length != 25)
      batches.push(current_batch);

    // Handler for the database operations
    let completed_requests = 0;
    let errors = false;
    function handler(request) {
      return function (err, data) {
        // Increment the completed requests
        completed_requests++;

        // Set the errors flag
        errors = errors ? true : err;

        // Log the error if we got one
        if (err) {
          console.error(JSON.stringify(err, null, 2));
          console.error("Request that caused database error:");
          console.error(JSON.stringify(request, null, 2));
        }

        // Make the callback if we've completed all the requests
        if (completed_requests == batches.length) {
          console.log("Write Complete!");
        }
      };
    }

    //Write batches to db
    let params;
    for (const batch of batches) {
      // Items go in params.RequestItems.id array
      // Format for the items is {PutRequest: {Item: ITEM_OBJECT}}
      params = '{"RequestItems": {"' + this.tableName + '": []}}';
      params = JSON.parse(params);
      params.RequestItems[this.tableName] = batch;

      // Perform the batchWrite operation
      this.docClient.batchWrite(params, handler(params));
    }
  }

  /**
   * This function returns the actual community of a user based on the
   * input community type and user object.
   */
  private getUserActualCommunity(community: string, user: IUser): string {
    if (community == COMMUNITY_TYPES.LOCAL) {
      return user.electorate.localElectorate ?? "";
    } else if (community == COMMUNITY_TYPES.STATE) {
      return user.electorate.stateElectorate ?? "";
    } else {
      return user.electorate.federalElectorate ?? "";
    }
  }

  /**
   * This function generates MP posts based on certain parameters and returns them.
   */
  private async generateMPPosts(
    lastEvaluatedType,
    lastEvaluatedKey,
    community,
    communityActual,
    user
  ) {
    if (
      lastEvaluatedType == null ||
      lastEvaluatedType == FEED_POSTS_TYPES.MP_POSTS
    ) {
      //get MP POSTS
      if (community != COMMUNITY_TYPES.ALL) {
        return await postsService.getMPPostsByElectorate(
          `${communityActual.toLowerCase()}#${community}`,
          NEWS_FEED_MP_POST_COUNT,
          lastEvaluatedKey
        );
      } else {
        return await postsService.getMPPostsByAllElectorates(
          user.electorate.localElectorate ?? "",
          user.electorate.stateElectorate ?? "",
          user.electorate.federalElectorate ?? "",
          NEWS_FEED_MP_POST_COUNT
        );
      }
    }
  }

  /**
   * This function generates a user feed by querying and filtering posts from followers and a specific
   * community.
   */
  private async generateUserFeedPosts(
    lastEvaluatedKey,
    community,
    communityActual,
    userId,
    limit,
    mpPosts,
    userPostsFull
  ) {
    console.log("___ Loading from following users ___");
    //get followers posts
    let posts = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName:
          community == COMMUNITY_TYPES.ALL
            ? "SortedIndex"
            : "SortedElectorateIndex",
        KeyConditionExpression:
          community == COMMUNITY_TYPES.ALL ? "userID = :userID" : "pk = :pk",
        ExpressionAttributeValues:
          community == COMMUNITY_TYPES.ALL
            ? { ":userID": userId }
            : {
                ":pk": `${userId}#${communityActual.toLowerCase()}#${community}`,
              }, //Load data from actual electorate if community filter
        Limit: limit - (mpPosts?.count ?? 0),
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      })
      .promise();

    console.log("___ Following  user Posts ___");
    console.log(posts);

    console.log("___ Filtering user Posts ___");

    console.log("Only got ", posts.Count, " Follower Posts");

    if (posts.Count > 0) {
      userPostsFull = await postsService.batchGetFromKeys(posts.Items);
    }

    console.log("___Done Returning___");
    let allPosts = [];

    if (mpPosts?.posts) {
      allPosts = [...mpPosts.posts];
    }
    if (userPostsFull) {
      allPosts = [...allPosts, ...userPostsFull];
    }

    return { allPosts, posts };
  }

  /**
   * This function generates a personalized feed for a user based on their community and the type of
   * posts they follow, including posts from MPs and followers.
   * @param  - - `userId`: the ID of the user for whom the personalized feed is being generated
   * @returns a Promise that resolves to an object of type IGetPersonalizedFeedReturn, which contains an
   * array of posts, the last evaluated type and key, and the offset and limit used for pagination.
   */
  async generatePersonalizedFeed({
    userId,
    limit,
    offset,
    community,
    lastEvaluatedType,
    lastEvaluatedKey,
  }: {
    userId: string;
    limit: number;
    offset: number;
    community: string;
    lastEvaluatedType: FEED_POSTS_TYPES;
    lastEvaluatedKey: any;
  }): Promise<IGetPersonalizedFeedReturn> {
    try {
      //Get User Info of the post creator
      const user = await userInfoService.getUserProfile(userId);

      //check if user valid
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
      }
      //set actual community of the post
      let communityActual = this.getUserActualCommunity(community, user);

      //total posts count
      let totalPosts = 0;

      //Keep Posts posted by MPs
      let mpPosts = await this.generateMPPosts(
        lastEvaluatedType,
        lastEvaluatedKey,
        community,
        communityActual,
        user
      );

      //Keep Posts posted by followers
      let userPostsFull;

      //If no more MP posts then move to followers posts
      let moveToUserPosts = false;

      if (
        lastEvaluatedType == null ||
        lastEvaluatedType == FEED_POSTS_TYPES.FOLLOWER_POSTS ||
        moveToUserPosts
      ) {
        let userFeed = await this.generateUserFeedPosts(
          lastEvaluatedKey,
          community,
          communityActual,
          userId,
          limit,
          mpPosts,
          userPostsFull
        );

        //check if posts count met
        totalPosts = totalPosts + userFeed.posts.Count;

        console.log("Total Posts so far ", totalPosts);

        return {
          posts: userFeed.allPosts,
          lastEvaluatedType: FEED_POSTS_TYPES.FOLLOWER_POSTS,
          lastEvaluatedKey: userFeed.posts.LastEvaluatedKey as IGetMpPostKey,
          offset: offset + totalPosts,
          limit: limit,
        };
      }

      //set posts count
      totalPosts = mpPosts.count ?? 0;

      console.log(mpPosts);

      //check if needed posts count found
      if (totalPosts == limit) {
        return {
          posts: mpPosts.posts,
          lastEvaluatedType: FEED_POSTS_TYPES.MP_POSTS,
          lastEvaluatedKey: null,
          offset: offset + mpPosts.count,
          limit: limit,
        };
      } else {
        console.log("___ MP posts __");
        console.log("Only got ", mpPosts.count);
        console.log("---need ", limit - mpPosts.count);
        //Found All Posts Move to next type
        // moveToUserPosts = true;
      }

      return {
        posts: [],
        lastEvaluatedKey: null,
        lastEvaluatedType: null,
        limit: limit,
        offset: offset,
      };
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
}

export default NewsFeedService;
