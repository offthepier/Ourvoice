import { QueryClient } from "react-query";
import { IUserActivity } from "../IhomeFeed.interface";
import IVote from "@/types/IVote";
import IPostFull from "@/types/IPostFull";
import { POST_TYPES } from "@/constants/PostTypes";
import VOTES_TYPES from "@/constants/VotesType";

const onLikePostChallengeFeed = async (
  newItem: IVote,
  queryClient: QueryClient,
  challengeId: string
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries([`userActivity ${newItem.postID}`]);
  await queryClient.cancelQueries([`post${newItem.postID}`]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData<IUserActivity>([
    `userActivity ${newItem.postID}`,
  ]);

  //News feed cache
  const previousChallengeData = queryClient.getQueryData<any>([
    "challengePosts",
    challengeId,
  ]);

  if (previousChallengeData) {
    console.log("prevGFeed", previousChallengeData);
    queryClient.setQueryData<any>(
      ["challengePosts", challengeId],
      (old: any) => {
        let postsOriginal = old;
        let indexItem = 0;

        //Find Index of the post item
        postsOriginal?.posts?.forEach((u: any, itemIndex: number) => {
          if (u.postId === newItem.postID) {
            indexItem = itemIndex;
          }
        });

        //Assign Post Item
        let post = postsOriginal?.posts[indexItem];

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
          postsOriginal.posts[indexItem] = post;
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

export { onLikePostChallengeFeed };
