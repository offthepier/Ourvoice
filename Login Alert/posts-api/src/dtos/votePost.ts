import VOTES_TYPES from "src/constants/VotesType";

interface VotePost {
  body: {
    postID: string;
    postCreatorID: string;
    postCreatorRole?: string;
    status: boolean;
    type: VOTES_TYPES;
  };
}

export default VotePost;
