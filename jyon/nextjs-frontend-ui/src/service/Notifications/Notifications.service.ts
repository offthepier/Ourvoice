import API from "../API";
import { NOTIFICATION_ENDPOINT } from "@/constants/Path";
const getNotifications = async () => {
  try {
    return await (
      await API.get(`${NOTIFICATION_ENDPOINT.GET_NOTIFICATION}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getNotificationsAll = async () => {
  try {
    return await (
      await API.post(`${NOTIFICATION_ENDPOINT.GET_NOTIFICATION_ALL}`, {
        limit: 50,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const markAsRead = async (notificationId: string) => {
  try {
    return await (
      await API.post(`${NOTIFICATION_ENDPOINT.NOTIFICATIONS_READ}`, {
        notificationId,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const NotificationsService = {
  getNotifications,
  getNotificationsAll,
  markAsRead,
};

export default NotificationsService;
