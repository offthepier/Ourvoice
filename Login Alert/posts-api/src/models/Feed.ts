interface FeedItem {
  postID?: string;
  createdAt?: string;
  postedBy?: string;
  userID: string;
  pk: string;
  status?: "ACTIVE" | "CLOSED";
}

export default FeedItem;
