import COMMENTS_TYPES from "src/constants/CommentsTypes";
import * as yup from "yup";

export const CreateCommentReqSchema = yup.object().shape({
  comment: yup.string().required("Comment is required!"),
  commentType: yup
    .string()
    .required("Comment Type is required!")
    .oneOf(
      [
        COMMENTS_TYPES.GENERAL,
        COMMENTS_TYPES.NEGATIVE,
        COMMENTS_TYPES.POSITIVE,
      ],
      "Comment Type Not Allowed!"
    ),
  postID: yup.string().required("Post Id is Required!"),
});