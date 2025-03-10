import * as yup from "yup";

export const NotificationMarkReadValidation = yup.object().shape({
  notificationId: yup.string().required("NotificationId is required!"),
});
