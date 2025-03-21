import IChallenge from "@/types/IChallenge";
import { QueryClient } from "react-query";

const handleOnMutateUnFollowChallenge = async (
  cid: string,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries(["topchallenges"]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData(["topchallenges"]);

  if (previousData) {
    // Optimistically update to the new value
    queryClient.setQueryData<IChallenge[]>(["topchallenges"], (old) =>
      old!.map((p) =>
        p.challengeID === cid
          ? { ...p, followStatus: false }
          : p
      )
    );
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { handleOnMutateUnFollowChallenge };
