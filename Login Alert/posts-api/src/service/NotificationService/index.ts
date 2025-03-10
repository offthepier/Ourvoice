import createDynamoDBClient from "../../config/db";
import NotificationService from "./notification.service";

const NOTIFICATION_TABLE = process.env.NOTIFICATIONS_TABLE || "Notifications";

const notificationService = new NotificationService(
  createDynamoDBClient(),
  NOTIFICATION_TABLE
);

export default notificationService;
