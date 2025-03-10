import { QueryClient } from "react-query";
interface ILikeComment {
  postID: string;
  commentID?: string;
  status?: boolean;
}

const onLikeComments = async (
  newItem: ILikeComment,
  queryClient: QueryClient
) => {
  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries([`comments ${newItem.postID}`]);

  // Snapshot the previous value
  const previousData = queryClient.getQueryData([`comments ${newItem.postID}`]);

  if (previousData) {
    // Optimistically update to the new value

    queryClient.setQueryData<ILikeComment>(
      [`userActivity ${newItem.postID}`],
      (old: any) => {
        if (old?.postID === newItem.postID) {
          return { ...old, status: true };
        }
        return old;
      }
    );
  }

  // Return a context object with the snapshotted value
  return { previousData };
};

export { onLikeComments };
