import * as yup from "yup";

export const FollowPostReqValidation = yup.object().shape({
  postId: yup.string().required("Post ID is required!"),
});
