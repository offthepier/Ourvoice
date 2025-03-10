import { QueryClient } from "react-query";
import IPosts from "@/service/NewsFeed/INewsFeed.interface";

const HandleOnMutateUnFollowPost = async (
  pid: string,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

  await queryClient.cancelQueries([`userActivity ${pid}`]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData([`userActivity ${pid}`]);

  if (previousData) {
    console.log(previousData, "camehere");

    // Optimistically update to the new value
    queryClient.setQueryData<IPosts>([`userActivity ${pid}`], (old: any) => {
      if (old?.postId === pid) {
        return { ...old, followStatus: false };
      }
      return old;
    });
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { HandleOnMutateUnFollowPost };
