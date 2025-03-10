import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import Notification from "src/models/Notification";
import userInfoService from "../UserProfile";
import { encrypt } from "src/utils/encrypt";

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

  async createNotification(notification: Notification): Promise<Notification> {
    console.log(notification);
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
}

export default NotificationService;
