interface Post {
  postId?: string;
  title: string;
  postType: string;
  description: string;
  challenge: string;
  challengeID: string;
  community: string;
  communityType?: string;
  createdAt?: string;
  userId: string;
  userRole?: string;
  userFirstName?: string;
  userLastName?: string;
  userImg?: string;
  tags?: [];
  images?: [];
  status?: "ACTIVE" | "CLOSED";
  positiveVotes?: number;
  negativeVotes?: number;
  likes?: number;
  followStatus?: boolean;
  searchableText?: string;
  uniqueCommunity?: string;
}

export default Post;
