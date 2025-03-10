import VOTES_TYPES from "src/constants/VotesType";

interface Vote {
  userID: string;
  postID: string;
  postCreatorId?: string;
  postCreatorRole?: string;
  commentID?: string;
  createdAt?: string;
  status?: boolean;
  voteType?: VOTES_TYPES;
}

export default Vote;
