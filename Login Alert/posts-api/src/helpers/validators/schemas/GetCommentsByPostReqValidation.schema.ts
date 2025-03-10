import * as yup from "yup";

export const GetCommentsByPostReqSchema = yup.object().shape({
  postID: yup.string().required("Post Id is Required!"),
  limit: yup.number().required("Limit is Required!"),
});
