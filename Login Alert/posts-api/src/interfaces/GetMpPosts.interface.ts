import Post from "src/models/Post";
import IGetMpPostKey from "./GetMpPostsKey.interface";

interface IGetMpPosts {
  posts: Post[];
  lastEvaluatedKey: IGetMpPostKey;
  count: number;
}

export default IGetMpPosts;
