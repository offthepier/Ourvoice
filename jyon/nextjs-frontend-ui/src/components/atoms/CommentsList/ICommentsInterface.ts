import { IUserActivity } from "../../molecules/NewsFeed/IhomeFeed.interface";

export interface IComments {
  commentID?: string;
  postID: string;
  comment?: any;
  commentType?: string;
  createdAt?: string;
  userID?: string;
  userFirstName?: string;
  userImageUrl?: string;
  userLastName?: string;
  userRole?: string;
  likesCount?: number;
}

export default interface ICommentsList {
  data: IComments;
  activities?: IUserActivity;
}
