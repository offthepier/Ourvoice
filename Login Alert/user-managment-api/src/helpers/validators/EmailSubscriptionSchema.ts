// import yup
import * as yup from "yup";

let EmailSubscriptionRequestValidator = yup.object().shape({
  emailSubscription: yup.string().required("File ID is required"),
});

export { EmailSubscriptionRequestValidator };
