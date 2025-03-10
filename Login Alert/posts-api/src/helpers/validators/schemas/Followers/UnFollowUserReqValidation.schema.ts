import * as yup from "yup";

export const UnFollowUserReqValidation = yup.object().shape({
  followerId: yup.string().required("FollowerId is required!"),
});
