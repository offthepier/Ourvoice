import COMMENTS_TYPES from "src/constants/CommentsTypes";
import VOTES_TYPES from "src/constants/VotesType";
import { FEED_POSTS_TYPES } from "src/enums/FeedPostsTypes";

export interface ICreatePost {
  title: string;
  postType: string;
  description: string;
  challenge: string;
  challengeID: string;
  community: string;
  tags?: [];
  images?: [];
}

export interface INewsFeed {
  community: string;
  limit: number;
  offset: number;
  lastEvaluatedKey: any;
  lastEvaluatedType: FEED_POSTS_TYPES;
}

export interface ICreateChallenge {
  title: string;
  challengeID: string;
  community: string;
}

export interface IFollowUser {
  followerID: string;
}

export interface IFollowChallenge {
  challengeId: string;
  challenge: string;
  community: string;
}

export interface IFollowPost {
  postId: string;
}

export interface IUnfollowChallenge {
  challengeID: string;
}

export interface IUnfollowPost {
  postId: string;
}

export interface CreateComment {
  postID: string;
  comment: string;
  commentType: COMMENTS_TYPES;
}

export interface GetCommentsByPost {
  postID: string;
  limit: number;
  lastEvaluatedKey: any;
}

export interface VoteComment {
  postID: string;
  commentID: string;
  status: boolean;
}

export interface VotePost {
  postID: string;
  postCreatorID: string;
  postCreatorRole?: string;
  status: boolean;
  type: VOTES_TYPES;
}

export interface GetNotifications {
  limit: number;
  lastEvaluatedKey: any;
}

export interface MarkAsReadNotification {
  notificationId: string;
}
