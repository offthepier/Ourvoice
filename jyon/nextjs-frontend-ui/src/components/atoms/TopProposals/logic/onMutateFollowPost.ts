import { QueryClient } from "react-query";
import IPost from "../Proposals.interface";

const handleOnMutateFollowPost = async (
  postId: string,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries(["topProposals"]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData(["topProposals"]);

  if (previousData) {
    // Optimistically update to the new value
    queryClient.setQueryData<IPost[]>(["topProposals"], (old) =>
      old!.map((p) => (p.postId === postId ? { ...p, followStatus: true } : p))
    );
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { handleOnMutateFollowPost };
