import * as yup from "yup";

export const FollowChallengeReqValidation = yup.object().shape({
  challengeId: yup.string().required("ChallengeId is required!"),
  challenge: yup.string().required("Challenge is required!"),
  community: yup.string().required("Community is required!"),
});
