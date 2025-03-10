interface IPetitionData {
  title: string;
  postType: string;
  description: string;
  challenge: string;
  challengeID: string;
  community: string;
  tags: string[];
  images: string[];
  postId?: string;
}

export default IPetitionData;
