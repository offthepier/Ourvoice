import IPosts from "@/service/NewsFeed/INewsFeed.interface";

interface IPostFull {
  post: IPosts;
  postFollowStatus: boolean;
  postCreatorInfo: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    role: string;
  };
  likeStatus: {
    votedPost: boolean;
    voteType: string;
    votedComments: [];
  };
}

export default IPostFull;
