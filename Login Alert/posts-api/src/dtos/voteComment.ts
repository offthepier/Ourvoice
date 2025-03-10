interface VoteComment {
  body: {
    postID: string;
    commentID: string;
    status: boolean;
  };
}

export default VoteComment;
