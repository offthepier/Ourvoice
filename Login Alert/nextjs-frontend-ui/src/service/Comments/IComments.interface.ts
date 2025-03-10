export default interface IComments {
  postId?: string;
}

export default interface ICommentsList {
  commentID?: string;
  postID: string;
  comment?: string;
  commentType?: string;
  createdAt?: string;
  userID?: string;
  userFirstName?: string;
  userLastName?: string;
  likesCount?: number;
}

export default interface IPostComment {
  postID: string;
  comment?: string;
  commentType?: string;
}

export default interface ILikeComment {
  postID: string;
  commentID?: string;
  status?: boolean;
}
