import IChallenge from "@/types/IChallenge";
import API from "../API";
import { FOLLOWERS_ENDPOINTS } from "@/constants/Path";
const getFollowersCount = async (userId: string) => {
  try {
    return await (
      await API.get(`${FOLLOWERS_ENDPOINTS.GET_FOLLOWERS_COUNT}`, {
        params: { userId },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getFollowingStatus = async (userId: string) => {
  try {
    return await (
      await API.get(`${FOLLOWERS_ENDPOINTS.GET_FOLLOWING_STATUS}`, {
        params: { userId },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const followChallenge = async ({
  challengeID,
  community,
  title,
}: IChallenge) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.FOLLOW_CHALLENGE}`, {
    challengeId: challengeID,
    challenge: title,
    community,
  });
};

const unfollowChallenge = async (challengeId: string) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.UNFOLLOW_CHALLENGE}`, {
    challengeId,
  });
};

const followPost = async (postId: string) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.FOLLOW_POST}`, {
    postId,
  });
};

const unfollowPost = async (postId: string) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.UNFOLLOW_POST}`, { postId });
};

const followUser = async (followerId: string) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.FOLLOW_USER}`, { followerId });
};

const unfollowUser = async (followerId: string) => {
  return await API.post(`${FOLLOWERS_ENDPOINTS.UNFOLLOW_USER}`, { followerId });
};

const FollowersService = {
  getFollowersCount,
  followChallenge,
  followPost,
  unfollowChallenge,
  unfollowPost,
  getFollowingStatus,
  followUser,
  unfollowUser,
};

export default FollowersService;
