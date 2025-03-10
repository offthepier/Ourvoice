import INotification from "@/types/INotification";

interface INotificationItem {
  onClick?: () => void;
  visibility?: boolean;
  notification: INotification;
}

export default INotificationItem;
