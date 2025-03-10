import { useAuth } from "@/context/AuthContext";
import FollowersService from "@/service/Followers/Followers.service";
import COLORS from "@/themes/colors";
import { Button, Stack } from "@mui/material";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { HandleOnMutateFollowPost } from "./logic/onMutateFollowPost";
import { HandleOnMutateUnFollowPost } from "./logic/onMutateUnFollowPost";
import IPostFollowButton from "./PostFollowButton.interface";

const PostFollowButton = ({
  postId,
  relevantUser,
  postFollowStatus = false,
}: IPostFollowButton) => {
  const queryClient = useQueryClient();

  const { getUser } = useAuth();

  const loggedEmail = getUser()?.email;

  const { mutateAsync: unfollowPost } = useMutation(
    FollowersService.unfollowPost,
    {
      onMutate: (newData) => {
        HandleOnMutateUnFollowPost(newData, queryClient);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`userActivity ${postId}`]);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  //follow post
  const { mutateAsync: followPost } = useMutation(FollowersService.followPost, {
    onMutate: (newData) => {
      console.log();
      HandleOnMutateFollowPost(newData, queryClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`userActivity ${postId}`]);
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  //unfollow
  const handleFollow = async (postId: string) => {
    await followPost(postId);
  };

  //Method to un-follow challenge
  const handleUnFollow = async (postId: string) => {
    await unfollowPost(postId);
  };

  return (
    <>
      {loggedEmail != relevantUser &&
        (postFollowStatus ? (
          <Stack mt={1}>
            <Button
              sx={{
                fontSize: "12px",
                borderRadius: "32px",
                height: "28px",
                fontWeight: 400,
                lineHeight: "18px",
                minWidth: "80px",
                backgroundColor: COLORS.primary,
                color: "white",
                ":hover": {
                  backgroundColor: "white",
                  color: COLORS.primary,
                },
                width: 35,
              }}
              variant="outlined"
              onClick={() => {
                handleUnFollow(postId);
              }}
            >
              Following
            </Button>
          </Stack>
        ) : (
          <Stack mt={1}>
            <Button
              sx={{
                fontSize: "12px",
                borderRadius: "32px",
                height: "28px",
                fontWeight: 400,
                lineHeight: "18px",
                minWidth: "80px",
                // gap: "10px",
                ":hover": {
                  backgroundColor: COLORS.primary,
                  color: "white",
                },
              }}
              variant="outlined"
              onClick={() => {
                handleFollow(postId);
              }}
            >
              Follow
            </Button>
          </Stack>
        ))}
    </>
  );
};

export { PostFollowButton };
