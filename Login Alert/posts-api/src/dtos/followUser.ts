import ICognitoPoolClaims from "./ICognitoClaims";

interface IFollowUser extends ICognitoPoolClaims {
  body: {
    followerId: string;
    followerFirstName: string;
    followerLastName: string;
  };
}

export default IFollowUser;
