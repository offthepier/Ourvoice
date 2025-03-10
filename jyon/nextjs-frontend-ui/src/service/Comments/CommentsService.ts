import API from "../API";
import IPostComment from "./IComments.interface";
import ILikeComment from "./IComments.interface";
import { COMMENTS_ENDPOINTS } from "@/constants/Path";

//GET ALL COMMENTS
const getPostsComments = async (postId: string) => {
  try {
    return await (
      await API.post(`${COMMENTS_ENDPOINTS.GET_COMMENTS}`, {
        postID: postId,
        limit: 50,
      })
    ).data;
  } catch (e) {
    console.log(e);
  }
};

//CREATE NEW COMMENTS

const createNewComment = async (data: IPostComment) => {
  console.log(data);
  try {
    return await (
      await API.post(`${COMMENTS_ENDPOINTS.CREATE_NEW_COMMENTS}`, data)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

//LIKE COMMENT
const likeComment = async (data: ILikeComment) => {
  console.log(data);
  try {
    return await (
      await API.post(`${COMMENTS_ENDPOINTS.LIKE_COMMENT}`, data)
    ).data;
  } catch (e) {
    console.log(e);
  }
};

//LIKE COMMENT COUNT

const PostCommentService = {
  getPostsComments,
  createNewComment,
  likeComment,
};

export default PostCommentService;
