import NOTIFICATION_TYPES from "@/constants/NotificationTypes";

interface INotification {
  notificationId: string;
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

export default INotification;
