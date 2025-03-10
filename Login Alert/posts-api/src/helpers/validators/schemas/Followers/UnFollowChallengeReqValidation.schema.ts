import * as yup from "yup";

export const UnFollowChallengeReqValidation = yup.object().shape({
  challengeId: yup.string().required("ChallengeId is required!"),
});
