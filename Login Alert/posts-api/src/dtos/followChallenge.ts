import ICognitoPoolClaims from "./ICognitoClaims";

interface IFollowChallenge extends ICognitoPoolClaims {
  body: {
    challengeId: string;
    challenge: string;
    community: string;
  };
}

export default IFollowChallenge;
