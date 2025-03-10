import ProfileAPI from "../ProfileAPI";
import { USER_ENDPOINTS } from "@/constants/Path";
import { SUBSCRIPTION_STATUS } from "@/constants/emailSubscription";

const unsubscribeEmailNotification = async () => {
  try {
    return await (
      await ProfileAPI.put(`${USER_ENDPOINTS.UNSUBSCRIBE_EMAILS}`, {
        emailSubscription: SUBSCRIPTION_STATUS.INACTIVE,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getSubscriptionStatus = async () => {
  try {
    return await (
      await ProfileAPI.get(`${USER_ENDPOINTS.UNSUBSCRIBE_EMAILS}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const SubscriptionService = {
  unsubscribeEmailNotification,
  getSubscriptionStatus,
};

export default SubscriptionService;
