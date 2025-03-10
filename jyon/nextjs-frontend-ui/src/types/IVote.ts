export default interface IVote {
  postID: string;
  postCreatorID: string;
  postCreatorRole?: string;
  status?: boolean;
  type?: string;
  likes?: number;
}
