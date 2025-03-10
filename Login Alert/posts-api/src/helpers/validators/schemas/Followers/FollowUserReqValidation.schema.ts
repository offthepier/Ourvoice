import * as yup from "yup";

export const FollowUserReqValidation = yup.object().shape({
  followerId: yup.string().required("FollowerId is required!"),
});
