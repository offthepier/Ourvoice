import API from "../API";
import IVote from "@/types/IVote";
import { NEWS_FEED } from "@/constants/Path";
//Get posts from the database
const getNewsFeedPosts = async (
  community: string,
  limit: number,
  lastEvaluatedKey?: Record<string, unknown>,
  lastEvaluatedType?: string
) => {
  try {
    const response = await API.post(`${NEWS_FEED.GET_NEWS_FEED_POSTS}`, {
      community: community,
      limit: limit,
      lastEvaluatedKey: lastEvaluatedKey,
      lastEvaluatedType: lastEvaluatedType,
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

//votepost
const likePost = async (data: IVote) => {
  try {
    return await (
      await API.post(`${NEWS_FEED.LIKE_POST}`, data)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getTopProposals = async () => {
  try {
    return await (
      await API.get(`${NEWS_FEED.GET_TOP_PROPOSALS}`)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

//getuseractivity

const getUseractivity = async (postId: string) => {
  try {
    return await (
      await API.get(`${NEWS_FEED.GET_USER_ACTIVITITES}`, {
        params: { postId: postId },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getPostsByChallenge = async (challengeId: string) => {
  try {
    return await (
      await API.get(`${NEWS_FEED.GET_POSTS_BY_CHALLENGE}`, {
        params: { challengeId: challengeId },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const getPostById = async (postId: string) => {
  try {
    return await (
      await API.get(`${NEWS_FEED.GET_POSTS_BY_ID}`, {
        params: { postId: postId },
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

const NewsFeedService = {
  getNewsFeedPosts,
  likePost,
  getTopProposals,
  getUseractivity,
  getPostsByChallenge,
  getPostById,
};

export default NewsFeedService;
