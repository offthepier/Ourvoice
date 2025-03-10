import COMMENTS_TYPES from "src/constants/CommentsTypes";

interface Comment {
  postID: string;
  comment: string;
  createdAt?: string;
  userID: string;
  userFirstName?: string;
  userLastName?: string;
  userImageUrl?: string;
  commentID?: string;
  commentType: COMMENTS_TYPES;
  likesCount: number;
  userRole?: string
}

export default Comment;
