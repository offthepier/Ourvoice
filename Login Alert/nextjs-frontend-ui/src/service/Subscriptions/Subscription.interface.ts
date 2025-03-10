interface IUserProfile {
  postId: string;
  userId: string;
  description: string;
  challenge: string;
  community: string;
  tags: string[];
  createdAt?: string;
  likes?: number;
  positiveVotes?: number;
  negativeVotes?: number;
  title: string;
  postType: string;
  status: string;
  images: string[];
  userFirstName: string;
  userLastName: string;
}

export default IUserProfile;
