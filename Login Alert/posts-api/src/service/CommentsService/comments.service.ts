import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";

import Comment from "src/models/Comment";
import notificationService from "../NotificationService";
import userInfoService from "../GetUserInfoService";
import { encrypt } from "src/utils/encrypt";

class CommentsService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = async (item: GetItemOutput): Promise<Comment> => {
    let user = null;
    if (item?.["userID"]) {
      user = await userInfoService.getUserProfile(item?.["userID"]);
    }

    return {
      commentID: item?.["commentID"],
      postID: item?.["postID"],
      comment: item?.["comment"],
      createdAt: item?.["createdAt"],
      userID: item?.["userID"],
      commentType: item?.["commentType"],
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userImageUrl: user.imageUrl,
      userRole: user.role,
      likesCount: item?.["likesCount"],
    };
  };

  //Map DynamoDB table column names that are only visible to frontend
  mapAttributesForPublic = async (item: GetItemOutput): Promise<Comment> => {
    let user = null;
    if (item?.["userID"]) {
      user = await userInfoService.getUserProfile(item?.["userID"]);
    }

    return {
      commentID: item?.["commentID"],
      postID: item?.["postID"],
      comment: item?.["comment"],
      createdAt: item?.["createdAt"],
      userID: encrypt(item?.["userID"] ?? "N/A"),
      commentType: item?.["commentType"],
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userImageUrl: user.imageUrl,
      userRole: user.role,
      likesCount: item?.["likesCount"],
    };
  };

  async createComment(comment: Comment): Promise<Comment> {
    const commentID = uuid();

    let dynamoObject = {
      Item: {
        commentID: commentID,
        postID: comment.postID,
        comment: comment.comment,
        createdAt: comment.createdAt,
        userID: comment.userID,
        userFirstName: comment.userFirstName,
        userLastName: comment.userLastName,
        commentType: comment.commentType,
        likesCount: 0,
      },
      TableName: this.tableName,
    };

    await this.docClient.put(dynamoObject).promise();

    //Generate Notifications
    await notificationService.generateUserCommentedNotification(comment);

    //Send notifications for post followers
    await notificationService.generateUserCommentedFollowingPostNotification(
      comment.userID,
      comment.postID
    );

    return comment;
  }

  async likeComment(postID: string, commentID: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        postID: postID,
        commentID: commentID,
      },
      UpdateExpression: "ADD #countAttribute :inc",
      ExpressionAttributeNames: {
        "#countAttribute": "likesCount",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      const data = await this.docClient.update(params).promise();
      console.log(data.Attributes);

      if (data) return "Successfully Liked Post";
    } catch (err) {
      console.error("Error updating count in DynamoDB: ", err);
      return "Error Liking Comment";
    }
  }

  async unlikeComment(postID: string, commentID: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        postID: postID,
        commentID: commentID,
      },
      UpdateExpression: "ADD #countAttribute :inc",
      ExpressionAttributeNames: {
        "#countAttribute": "likesCount",
      },
      ExpressionAttributeValues: {
        ":inc": -1,
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      const data = await this.docClient.update(params).promise();
      console.log(data.Attributes);
      if (data) return "Successfully Unlike Post";
    } catch (err) {
      console.error("Error updating count in DynamoDB: ", err);
      return "Error Unlike Comment";
    }
  }

  async getCommentsByPost(
    postId: string,
    limit: number,
    lastEvaluatedKey: any
  ): Promise<Comment[]> {
    const comments = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "SortedIndex",
        KeyConditionExpression: "postID = :pk",
        ExpressionAttributeValues: {
          ":pk": postId,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      })
      .promise();

    const commentObjects = comments.Items.map(async (e) => {
      return await this.mapAttributesForPublic(e);
    });

    return await Promise.all(commentObjects);
  }

  async getPostById(postId: string, commentID: string): Promise<Comment> {
    const posts = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "postID = :pk AND commentID = :sk",
        ExpressionAttributeValues: {
          ":pk": postId,
          ":sk": commentID,
        },
        Limit: 1,
      })
      .promise();

    return this.mapAttributes(posts.Items?.[0]);
  }
}

export default CommentsService;
