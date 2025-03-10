import * as yup from "yup";

export const VoteCommentReqSchema = yup.object().shape({
  postID: yup.string().required("PostID is required!"),
  commentID: yup.string().required("CommentID is required!"),
  status: yup.boolean().required("Status is Required!"),
});
