import { QueryClient } from "react-query";
import IPost from "../Proposals.interface";

const handleOnMutateUnFollowPost = async (
  cid: string,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries(["topProposals"]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData(["topProposals"]);

  if (previousData) {
    // Optimistically update to the new value
    queryClient.setQueryData<IPost[]>(["topProposals"], (old) =>
      old!.map((p) => (p.postId === cid ? { ...p, followStatus: false } : p))
    );
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { handleOnMutateUnFollowPost };
