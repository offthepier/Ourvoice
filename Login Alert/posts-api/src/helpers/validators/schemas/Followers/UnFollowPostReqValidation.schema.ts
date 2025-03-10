import * as yup from "yup";

export const UnFollowPostReqValidation = yup.object().shape({
  postId: yup.string().required("Post ID is required!"),
});
