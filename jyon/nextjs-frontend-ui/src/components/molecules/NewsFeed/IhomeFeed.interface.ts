export interface IPosts {
  postId: string;
  userId: string;
  description: string;
  challenge: string;
  community: string;
  communityType: string;
  tags: string[];
  createdAt?: string;
  likes?: number;
  positiveVotes: number;
  negativeVotes: number;
  title: string;
  postType: string;
  status: string;
  images: string[];
  userFirstName: string;
  followStatus?: boolean;
  votedPost?: boolean;
  userLastName: string;
}

interface IData {
  votedPost: boolean;
  voteType?: string | null;
  votedComments: string[];
}

interface IPostCreator {
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: string;
}

export interface IUserActivity {
  data: IData;
  postFollowStatus: boolean;
  postCreatorInfo: IPostCreator;
}

export default interface IPostList {
  post: IPosts;
}
