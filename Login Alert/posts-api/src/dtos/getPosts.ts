import { FEED_POSTS_TYPES } from "src/enums/FeedPostsTypes";

interface GetPosts {
  body: {
    community: string;
    limit: number;
    offset: number;
    lastEvaluatedKey: any;
    lastEvaluatedType: FEED_POSTS_TYPES;
  };
}

export default GetPosts;
