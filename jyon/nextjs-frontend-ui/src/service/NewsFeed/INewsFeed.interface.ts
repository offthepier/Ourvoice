export default interface IPosts {
  postId: string;
  userId: string;
  description: string;
  challenge: string;
  community: string;
  communityType: string;
  tags: string[];
  createdAt?: string;
  likes?: number;
  positiveVotes: number;
  negativeVotes: number;
  title: string;
  postType: string;
  status: string;
  images: string[];
  userFirstName: string;
  userLastName: string;
  challengeID: string;
}

export default interface INewsFeed {
  community: string;
  limit: number;
}

enum FEED_POSTS_TYPES {
  MP_POSTS = "MP_POSTS",
  FOLLOWER_POSTS = "FOLLOWERS_POSTS",
  CHALLENGES_POSTS = "CHALLENGES_POSTS",
  ALL = "ALL",
}

enum POST_TYPES {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

export { FEED_POSTS_TYPES, POST_TYPES };
