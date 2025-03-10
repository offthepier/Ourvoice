import { QueryClient } from "react-query";
import { IUserActivity } from "../IhomeFeed.interface";
import IVote from "@/types/IVote";
import IPostFull from "@/types/IPostFull";
import { POST_TYPES } from "@/constants/PostTypes";
import VOTES_TYPES from "@/constants/VotesType";

const onLikePost = async (
  newItem: IVote,
  queryClient: QueryClient,
  activeCommunity: string
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries([`userActivity ${newItem.postID}`]);
  await queryClient.cancelQueries([`post${newItem.postID}`]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData<IUserActivity>([
    `userActivity ${newItem.postID}`,
  ]);

  //Post single page cache
  const previousPostData = queryClient.getQueryData<IPostFull>([
    `post${newItem.postID}`,
    newItem.postID,
  ]);

  //News feed cache
  const previousFeedData = queryClient.getQueryData<any>([
    `newsFeed ${activeCommunity}`,
  ]);

  if (previousPostData) {
    // Optimistically update to the new value
    queryClient.setQueryData<IPostFull>(
      [`post${newItem.postID}`, newItem.postID],
      (old: any) => {
        let post = old as IPostFull;

        if (old?.post.postId === newItem.postID) {
          if (previousPostData.post.postType == POST_TYPES.GENERAL) {
            if (newItem.status) {
              post.post.likes = (post?.post?.likes || 0) + 1;
            } else {
              post.post.likes = (post?.post?.likes || 0) - 1;
            }
          } else if (previousPostData.post.postType == POST_TYPES.PROPOSAL) {
            if (newItem.type == VOTES_TYPES.NEGATIVE) {
              if (newItem.status) {
                post.post.negativeVotes = post.post.negativeVotes + 1;

                if (previousData?.data.voteType == VOTES_TYPES.POSITIVE) {
                  post.post.positiveVotes = post.post.positiveVotes - 1;
                }
              } else {
                post.post.negativeVotes = post.post.negativeVotes - 1;
              }
            } else if (newItem.type == VOTES_TYPES.POSITIVE) {
              if (newItem.status) {
                post.post.positiveVotes = post.post.positiveVotes + 1;
                if (previousData?.data.voteType == VOTES_TYPES.NEGATIVE) {
                  post.post.negativeVotes = post.post.negativeVotes - 1;
                }
              } else {
                post.post.positiveVotes = post.post.positiveVotes - 1;
              }
            }
          }
        }
        return post;
      }
    );
  }

  if (previousFeedData) {
    console.log("prevGFeed", previousFeedData);
    queryClient.setQueryData<any>(
      [`newsFeed ${activeCommunity}`],
      (old: any) => {
        let postsOriginal = old;

        let indexPage = 0;
        let indexItem = 0;

        //Find Index of the post item
        postsOriginal?.pages?.forEach((e: any, pageIndex: number) => {
          for (let [itemIndex, post] of e?.posts?.entries()) {
            if (post.postId === newItem.postID) {
              indexItem = itemIndex;
              indexPage = pageIndex;
              break;
            }
          }
        });

        //Assign Post Item
        let post = postsOriginal?.pages?.[indexPage]?.posts[indexItem];

        //Handle optimistic update logic
        if (post) {
          if (post.postType == POST_TYPES.GENERAL) {
            if (newItem.status) {
              post.likes = post.likes + 1;
            } else {
              post.likes = post.likes - 1;
            }
          } else if (post.postType == POST_TYPES.PROPOSAL) {
            if (newItem.type == VOTES_TYPES.NEGATIVE) {
              if (newItem.status) {
                post.negativeVotes = post.negativeVotes + 1;
                if (previousData?.data.voteType == VOTES_TYPES.POSITIVE)
                  post.positiveVotes = post.positiveVotes - 1;
              } else {
                post.negativeVotes = post.negativeVotes - 1;
              }
            } else if (newItem.type == VOTES_TYPES.POSITIVE) {
              if (newItem.status) {
                post.positiveVotes = post.positiveVotes + 1;
                if (previousData?.data.voteType == VOTES_TYPES.NEGATIVE)
                  post.negativeVotes = post.negativeVotes - 1;
              } else {
                post.positiveVotes = post.positiveVotes - 1;
              }
            }
          }

          // replace with updated object
          postsOriginal.pages[indexPage].posts[indexItem] = post;
        }

        return postsOriginal;
      }
    );
  }

  if (previousData) {
    // Optimistically update to the new value

    queryClient.setQueryData<IVote>(
      [`userActivity ${newItem.postID}`],
      (old: any) => {
        let newVote = old;
        newVote.data.votedPost = newItem.status;
        newVote.data.voteType = newItem.status ? newItem.type : null;

        return newVote;
      }
    );
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { onLikePost };
