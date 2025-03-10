import COMMUNITY_TYPES from "src/constants/CommunityTypes";
import * as yup from "yup";

export const CreateChallengeReqSchema = yup.object().shape({
  community: yup
    .string()
    .required("Community Type is required")
    .oneOf(
      [COMMUNITY_TYPES.STATE, COMMUNITY_TYPES.LOCAL, COMMUNITY_TYPES.FEDERAL],
      "Not Allowed Community Type"
    ),
  title: yup.string().required("Challenge Title is required"),
});
