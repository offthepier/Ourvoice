import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import IUser from "src/models/User";
import IFollow from "src/models/Follow";
import notificationService from "../NotificationService";
import userInfoService from "../GetUserInfoService";
import postsService from "../PetitionService";
import { ValidationError } from "yup";
import { ERROR_MESSAGES } from "src/constants/ErrorMessages";

class FollowersService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapFollowAttributes = (item: GetItemOutput): IFollow => {
    return {
      challengeID: item["challengeID"],
      challenge: item["challenge"],
      userID: item["userId"],
      followerFirstName: item["followerFirstName"],
      followerLastName: item["followerLastName"],
      community: item["community"],
    };
  };
  //Map DynamoDB table column names
  mapUserAttributesFollowing = (item: GetItemOutput): IUser => {
    return {
      id: item["followerID"],
      firstName: item["followerFirstName"],
      lastName: item["followerLastName"],
    };
  };

  mapUserAttributesFollowers = (item: GetItemOutput): IUser => {
    return {
      id: item["userID"],
      firstName: item["followerFirstName"],
      lastName: item["followerLastName"],
    };
  };
  mapUserAttributesChallengeFollowers = (item: GetItemOutput): IUser => {
    return {
      id: item["userID"],
      firstName: item["userFirstName"],
      lastName: item["userLastName"],
    };
  };
  mapPostFollowersAttributes = (item: GetItemOutput): IUser => {
    return {
      id: item["userID"],
      firstName: item["userFirstName"],
      lastName: item["userLastName"],
    };
  };

  async followUser(follow: IFollow): Promise<string> {
    const userToFollow = await userInfoService.getUserProfile(
      follow.followerID
    );

    if (userToFollow) {
      await this.docClient
        .put({
          TableName: this.tableName,
          Item: {
            userID: follow.userID,
            sk: `USER#${follow.followerID}`,
            userFirstName: follow.userFirstName,
            userLastName: follow.userLastName,
            followerID: follow.followerID,
            followerFirstName: follow.followerFirstName,
            followerLastName: follow.followerLastName,
            createdAt: follow.createdAt,
          },
        })
        .promise();

      //Generate a notification
      await notificationService.generateUserFollowedNotification(follow);

      return "User Followed";
    } else {
      throw new Error("Can't find User!");
    }
  }

  // Unfollow User
  async unfollowUser(follow: IFollow): Promise<string> {
    const res = await this.docClient
      .delete({
        TableName: this.tableName,
        Key: { userID: follow.userID, sk: `USER#${follow.followerID}` },
      })
      .promise();

    if (res) {
      return "un-followed User";
    } else {
      throw new ValidationError("Can't un-follow");
    }
  }

  async followChallenge(follow: IFollow): Promise<string> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          userID: follow.userID,
          sk: `CHALLENGE#${follow.challengeID}`,
          challengeId: follow.challengeID,
          challenge: follow.challenge,
          community: follow.community,
          createdAt: follow.createdAt,
        },
      })
      .promise();

    return "Challenge Followed";
  }

  //unfollow challenges
  async unfollowChallenge(follow: IFollow): Promise<string> {
    const res = await this.docClient
      .delete({
        TableName: this.tableName,
        Key: { userID: follow.userID, sk: `CHALLENGE#${follow.challengeID}` },
      })
      .promise();

    if (res) {
      return "un-followed Challenge";
    } else {
      throw new ValidationError("Can't un-follow");
    }
  }

  async followPost(userId: string, postId: string): Promise<string> {
    const post = await postsService.getPostById(postId);
    if (post.userId == userId) {
      throw new ValidationError(ERROR_MESSAGES.CANT_FOLLOW_OWN);
    }
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          userID: userId,
          sk: `POST#${postId}`,
          postId: postId,
          createdAt: new Date().toISOString(),
        },
      })
      .promise();

    //Send notification
    await notificationService.generatePostFollowedNotification(userId, postId);

    return "Post Followed";
  }

  //unfollow posts
  async unFollowPost(userId: string, postId: string): Promise<string> {
    const res = await this.docClient
      .delete({
        TableName: this.tableName,
        Key: { userID: userId, sk: `POST#${postId}` },
      })
      .promise();

    if (res) {
      return "un-followed Post";
    } else {
      throw new ValidationError("Can't un-follow");
    }
  }

  async getPostFollowStatus(userId: string, postId: string): Promise<boolean> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :userId AND sk = :sk",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":sk": `POST#${postId}`,
        },
      })
      .promise();

    if (posts?.Items?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getChallengeFollowStatus(
    userId: string,
    postId: string
  ): Promise<boolean> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :userId AND sk = :sk",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":sk": `CHALLENGE#${postId}`,
        },
      })
      .promise();

    if (posts?.Items?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getPostFollowingList(postId: string): Promise<IUser[]> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "postId = :postId",
        IndexName: "PostIndex",
        ExpressionAttributeValues: {
          ":postId": postId,
        },
      })
      .promise();

    return posts.Items.map((e) => {
      return this.mapPostFollowersAttributes(e);
    });
  }

  async getUserFollowingList(userId: string): Promise<IUser[]> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :userID AND begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":userID": userId,
          ":sk": "USER#",
        },
      })
      .promise();

    return posts.Items.map((e) => {
      return this.mapUserAttributesFollowing(e);
    });
  }

  async getUserFollowingStatus(
    userId: string,
    followerId: string
  ): Promise<boolean> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :userID AND sk = :sk",
        ExpressionAttributeValues: {
          ":userID": userId,
          ":sk": `USER#${followerId}`,
        },
      })
      .promise();

    return posts.Items?.length > 0 ? true : false;
  }

  async getUserFollowersList(userId: string): Promise<IUser[]> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "InvertedIndex",
        KeyConditionExpression: "followerID = :followerID",
        ExpressionAttributeValues: {
          ":followerID": userId,
        },
      })
      .promise();

    return posts.Items.map((e) => {
      return this.mapUserAttributesFollowers(e);
    });
  }

  async getUserFollowersCount(userId: string): Promise<number> {
    const count = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "InvertedIndex",
        KeyConditionExpression: "followerID = :followerID",
        ExpressionAttributeValues: {
          ":followerID": userId,
        },
        Select: "COUNT",
      })
      .promise();

    return count.Count;
  }

  async getFollowingUsersOfChallenge(challengeID: string): Promise<IUser[]> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "ChallengesIndex",
        KeyConditionExpression: "challengeId = :challengeId",
        ExpressionAttributeValues: {
          ":challengeId": challengeID,
        },
      })
      .promise();

    return posts.Items.map((e) => {
      return this.mapUserAttributesChallengeFollowers(e);
    });
  }
}

export default FollowersService;
