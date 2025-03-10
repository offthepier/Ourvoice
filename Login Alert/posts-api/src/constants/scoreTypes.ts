const POINTS = {
  postLike: 1,
  proposalCreator: 1,
  propsalVoter: 1,
  commentsLike: 1,
};

enum SCORE_TYPES {
  liked = "LIKED_POST",
  unliked = "UNLIKED_POST",
  proposalCreator = "PROPOSAL_CREATER",
  ownPostLike = "OWNER_LIKE_POST",
  proposalVoter = "PROPOSAL_VOTER",
  ownCommentLike = "OWNER_LIKE_COMMENT",
  commentLike = "COMMENT_CREATOR_LIKED",
}

export { POINTS, SCORE_TYPES };
