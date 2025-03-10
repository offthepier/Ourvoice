import COMMENTS_TYPES from "src/constants/CommentsTypes";

interface CreateComment {
  body: {
    postID: string;
    comment: string;
    commentType: COMMENTS_TYPES;
  };
}

export default CreateComment;
