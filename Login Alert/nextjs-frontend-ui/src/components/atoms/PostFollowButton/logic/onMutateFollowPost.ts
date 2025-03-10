import { QueryClient } from "react-query";
import IPosts from "@/service/NewsFeed/INewsFeed.interface";

const HandleOnMutateFollowPost = async (
  postId: string,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries([`userActivity ${postId}`]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData([`userActivity ${postId}`]);

  if (previousData) {
    // Optimistically update to the new value

    queryClient.setQueryData<IPosts>([`userActivity ${postId}`], (old: any) => {
      if (old?.postId === postId) {
        return { ...old, followStatus: true };
      }
      return old;
    });
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { HandleOnMutateFollowPost };
