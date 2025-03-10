import NOTIFICATION_TYPES from "src/constants/NotificationTypes";
import Notification from "src/models/Notification";
import { titleCase } from "./stringTitleCse";

const generateNotificationText = (notification: Notification): string => {
  switch (notification.notificationType) {
    case NOTIFICATION_TYPES.COMMENT: {
      return `<strong> ${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )}</strong> commented on your post`;
    }
    case NOTIFICATION_TYPES.POST_LIKE: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )} </strong> liked your post`;
    }
    case NOTIFICATION_TYPES.POST_VOTE: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )} </strong> voted your proposal`;
    }
    case NOTIFICATION_TYPES.USER_FOLLOW: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )} </strong> started following you`;
    }
    case NOTIFICATION_TYPES.COMMENT_LIKE: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )} </strong> liked your comment`;
    }

    case NOTIFICATION_TYPES.POST_FOLLOW: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )} </strong> started following your post`;
    }

    case NOTIFICATION_TYPES.COMMENT_FOLLOWED_POST: {
      return `<strong>${titleCase(notification.fromUserFirstName)} ${titleCase(
        notification.fromUserLastName
      )}</strong> commented on a post you are following`;
    }

    case NOTIFICATION_TYPES.ADMIN_SURVEY_PENDING: {
      return `You have a new pending survey from <strong>Admin</strong>`;
    }

    case NOTIFICATION_TYPES.SURVEY_PENDING: {
      return `You have a new pending survey from <strong>${titleCase(
        notification.fromUserFirstName
      )} ${notification.fromUserLastName}</strong>`;
    }
  }
};

export { generateNotificationText };
