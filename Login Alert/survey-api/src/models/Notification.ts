import NOTIFICATION_TYPES from "src/constants/NotificationTypes";

interface Notification {
  notificationId?: string;
  message?: string;
  createdAt?: string;
  userID: string;
  notificationType: NOTIFICATION_TYPES;
  status?: string;
  fromUserId: string;
  fromUserFirstName?: string;
  fromUserLastName?: string;
  fromUserProfilePic?: string;
}

export default Notification;
