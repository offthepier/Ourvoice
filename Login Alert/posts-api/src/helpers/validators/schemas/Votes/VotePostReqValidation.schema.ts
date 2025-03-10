import VOTES_TYPES from "src/constants/VotesType";
import * as yup from "yup";

export const VotePostReqSchema = yup.object().shape({
  postID: yup.string().required("PostID is required!"),
  postCreatorID: yup.string().required("PostCreatorID is required!"),
  type: yup
    .string()
    .required("Vote Type is required!")
    .oneOf(
      [VOTES_TYPES.LIKE, VOTES_TYPES.NEGATIVE, VOTES_TYPES.POSITIVE],
      "Vote Type Not Allowed!"
    ),
  status: yup.boolean().required("Status is Required!"),
});
