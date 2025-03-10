import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import Notification from "src/models/Notification";
import IFollow from "src/models/Follow";
import NOTIFICATION_TYPES from "src/constants/NotificationTypes";
import userInfoService from "../GetUserInfoService";
import Comment from "src/models/Comment";
import postsService from "../PetitionService";
import Vote from "src/models/Vote";
import { POST_TYPES } from "src/constants/PostTypes copy";
import commentsService from "../CommentsService";
// import { runEmailJob } from "../EmailService/Email.service";
// import {
//   // COMMENT_EMAIL,
//   COMMENT_LIKED_EMAIL,
//   // FOLLOWER_POST_COMMENTED_EMAIL,
//   // FOLLOW_EMAIL,
//   // LIKED_EMAIL,
//   // POST_FOLLOWED_EMAIL,
//   // VOTE_EMAIL,
// } from "src/constants/emailTemplates";
import followersService from "../FollowersService";
import { encrypt } from "src/utils/encrypt";

interface IGetNotificationsReturn {
  notifications: Notification[];
  lastEvaluatedKey: any;
  limit: number;
}
class NotificationService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = async (item: GetItemOutput): Promise<Notification> => {
    let user = null;
    if (item?.["fromUserId"]) {
      user = await userInfoService.getUserProfile(item?.["fromUserId"]);
    }

    return {
      notificationId: item?.["notificationId"],
      message: item?.["message"],
      createdAt: item?.["createdAt"],
      userID: item?.["userID"],
      notificationType: item?.["notificationType"],
      status: item?.["status"],
      fromUserId: encrypt(item?.["fromUserId"] ?? "N/A"),
      fromUserFirstName: user?.firstName,
      fromUserLastName: user?.lastName,
      fromUserProfilePic: user?.imageUrl,
    };
  };

  private async createNotification(
    notification: Notification
  ): Promise<Notification> {
    //Avoid Notifications on activities by same user
    if (notification.fromUserId == notification.userID) {
      console.log(
        new Error("Cant Make Notifications on activities by same user")
      );
      return;
    }
    const id = uuid();
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          ...notification,
          notificationId: id,
          status: false,
          createdAt: new Date().toISOString(),
        },
      })
      .promise();

    return notification;
  }

  async generateUserFollowedNotification(
    follow: IFollow
  ): Promise<Notification> {
    const notification: Notification = {
      fromUserId: follow.userID,
      userID: follow.followerID,
      notificationType: NOTIFICATION_TYPES.USER_FOLLOW,
      createdAt: new Date().toISOString(),
    };

    //Create notification data
    const notificationData = await this.createNotification(notification);

    //Get User Details
    const user = await userInfoService.getUserProfile(follow.userID);

    console.log(user);

    if (user) {
      //Send Emails
      // await runEmailJob({
      //   toAddresses: [follow.followerID],
      //   message: {
      //     subject: FOLLOW_EMAIL.subject,
      //     body: `${user.firstName} ${user.lastName} started following you`,
      //   },
      // });
    }

    return notificationData;
  }

  async generateUserCommentedNotification(
    comment: Comment
  ): Promise<Notification> {
    //Get Post Followers

    //Get Post Creator
    const post = await postsService.getPostById(comment.postID);

    //CHECK if the post creator commenting
    if (post.userId != comment.userID) {
      const notification: Notification = {
        fromUserId: comment.userID,
        userID: post.userId,
        notificationType: NOTIFICATION_TYPES.COMMENT,
        createdAt: new Date().toISOString(),
      };

      //Create notification data
      const notificationData = await this.createNotification(notification);

      //Get User Details
      // const user = await userInfoService.getUserProfile(comment.userID);

      //Send Emails
      // runEmailJob({
      //   toAddresses: [post.userId],
      //   message: {
      //     subject: COMMENT_EMAIL.subject,
      //     body: `${user.firstName} ${user.lastName} has commented on your post"`,
      //   },
      // });

      return notificationData;
    }
  }

  async generatePostFollowedNotification(
    userId: string,
    postId: string
  ): Promise<Notification> {
    const post = await postsService.getPostById(postId);

    //CHECK if the post creator following
    if (post.userId != userId) {
      const notification: Notification = {
        fromUserId: userId,
        userID: post.userId,
        notificationType: NOTIFICATION_TYPES.POST_FOLLOW,
        createdAt: new Date().toISOString(),
      };

      //Create notification data
      const notificationData = await this.createNotification(notification);

      //Get User Details
      // const user = await userInfoService.getUserProfile(userId);

      //Send Emails
      // runEmailJob({
      //   toAddresses: [post.userId],
      //   message: {
      //     subject: POST_FOLLOWED_EMAIL.subject,
      //     body: `${user.firstName} ${user.lastName} started following your post"`,
      //   },
      // });

      return notificationData;
    }
  }

  async generateUserCommentedFollowingPostNotification(
    userId: string,
    postId: string
  ) {
    const post = await postsService.getPostById(postId);

    //GET followers
    const followers = await followersService.getPostFollowingList(postId);

    //Get User Details
    // const user = await userInfoService.getUserProfile(userId);

    for (const follower of followers) {
      console.log(follower);
      //CHECK if the post creator following
      if (post.userId != follower.id) {
        const notification: Notification = {
          fromUserId: userId,
          userID: follower.id,
          notificationType: NOTIFICATION_TYPES.COMMENT_FOLLOWED_POST,
          createdAt: new Date().toISOString(),
        };

        //Create notification data
        await this.createNotification(notification);

        // Send Emails
        // runEmailJob({
        //   toAddresses: [follower.id],
        //   message: {
        //     subject: FOLLOWER_POST_COMMENTED_EMAIL.subject,
        //     body: `${user.firstName} ${user.lastName} has commented on a post you are following"`,
        //   },
        // });
      }
    }
  }

  async generateUserVoteNotification(vote: Vote): Promise<Notification> {
    //Get Post Followers

    //Get Post Creator
    const post = await postsService.getPostById(vote.postID);

    const notification: Notification = {
      fromUserId: vote.userID,
      userID: post.userId,
      notificationType:
        post.postType == POST_TYPES.GENERAL
          ? NOTIFICATION_TYPES.POST_LIKE
          : NOTIFICATION_TYPES.POST_VOTE,
      createdAt: new Date().toISOString(),
    };

    const notificationData = await this.createNotification(notification);

    // const user = await userInfoService.getUserProfile(vote.userID);

    // if (notification.notificationType == NOTIFICATION_TYPES.POST_LIKE) {
    //   runEmailJob({
    //     toAddresses: [vote.postCreatorId],
    //     message: {
    //       subject: LIKED_EMAIL.subject,
    //       body: `${user.firstName} ${user.lastName} has liked your post"`,
    //     },
    //   });
    // } else {
    //   runEmailJob({
    //     toAddresses: [vote.postCreatorId],
    //     message: {
    //       subject: VOTE_EMAIL.subject,
    //       body: `${user.firstName} ${user.lastName} has voted your post"`,
    //     },
    //   });
    // }

    return notificationData;
  }

  async generateCommentLikeNotification(vote: Vote): Promise<Notification> {
    //Get Post Creator
    const comment = await commentsService.getPostById(
      vote.postID,
      vote.commentID
    );
    const notification: Notification = {
      fromUserId: vote.userID,
      userID: comment.userID,
      notificationType: NOTIFICATION_TYPES.COMMENT_LIKE,
      createdAt: new Date().toISOString(),
    };

    //Create notification data
    const notificationData = await this.createNotification(notification);

    //Get User Details
    // const user = await userInfoService.getUserProfile(vote.userID);

    //Send Emails
    // runEmailJob({
    //   toAddresses: [comment.userID],
    //   message: {
    //     subject: COMMENT_LIKED_EMAIL.subject,
    //     body: `${user.firstName} ${user.lastName} has liked your comment"`,
    //   },
    // });

    return notificationData;
  }

  async markRead(notificationId: string, userID: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        userID,
        notificationId,
      },
      UpdateExpression: "set #MyVariable = :y",
      ExpressionAttributeNames: {
        "#MyVariable": "status",
      },
      ExpressionAttributeValues: {
        ":y": true,
      },
    };

    const data = await this.docClient.update(params).promise();
    if (data) return "Notification Marked as Read";
    else return "Error Marking as Read";
  }

  async getUserNotifications(
    userId: string,
    limit: number,
    lastKey: any
  ): Promise<IGetNotificationsReturn> {
    const data = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "userID = :pk",
        IndexName: "SortedIndex",
        ExpressionAttributeValues: {
          ":pk": `${userId}`,
        },
        Limit: limit,
        ExclusiveStartKey: lastKey,
        ScanIndexForward: false,
      })
      .promise();

    const notifications = data.Items.map(async (e) => {
      return await this.mapAttributes(e);
    });

    const result = await Promise.all(notifications);

    return {
      notifications: result,
      lastEvaluatedKey: data.LastEvaluatedKey,
      limit,
    };
  }

  async getUserDailyNotifications(
    userId: string,
    limit: number,
    date: Date
  ): Promise<Notification[]> {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const data = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression:
          "userID = :pk AND createdAt BETWEEN :start AND :end",
        IndexName: "SortedIndex",
        ExpressionAttributeValues: {
          ":pk": `${userId}`,
          ":start": startOfDay.toISOString(),
          ":end": endOfDay.toISOString(),
        },
        Limit: limit,
        ScanIndexForward: false,
      })
      .promise();

    const notifications = data.Items.map(async (e) => {
      return await this.mapAttributes(e);
    });

    return await Promise.all(notifications);
  }
}

export default NotificationService;
