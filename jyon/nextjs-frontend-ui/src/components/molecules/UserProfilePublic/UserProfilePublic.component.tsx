import { Avatar, Box, Button, Skeleton, Typography } from "@mui/material";
import { MpTag } from "@/assets/index";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import COLORS from "@/themes/colors";
import FollowersService from "@/service/Followers/Followers.service";
import IUser from "./UserProfilePublic.interface";
import Image from "next/image";
import { Stack } from "@mui/system";
import { ProfileSideBar } from "../../atoms";
import { useAuth } from "@/context/AuthContext";
import { decrypt } from "@/util/encrypt";

//profile
const UserProfilePublic = ({ profile, userId }: IUser) => {
  const [imageUrl] = useState("");

  const { getUser } = useAuth();
  const loggedEmail = getUser()?.email;

  const queryClient = useQueryClient();

  const { data: isFollowing } = useQuery<{ following: boolean }, Error>(
    `following-status ${userId}`,
    async () => {
      return await FollowersService.getFollowingStatus(userId);
    }
  );

  const { mutateAsync: followUser } = useMutation(FollowersService.followUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(`following-status ${userId}`);
      queryClient.invalidateQueries(`follow-count ${userId}`);
    },
  });

  const { mutateAsync: unfollowUser } = useMutation(
    FollowersService.unfollowUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`following-status ${userId}`);
        queryClient.invalidateQueries(`follow-count ${userId}`);
      },
    }
  );

  const relavantUser = decrypt(userId);

  return (
    <Box
      bgcolor="white"
      width="100%"
      height="100%"
      marginTop={4}
      borderRadius="10px"
      border={COLORS.border}
    >
      {profile?.role === "MP" ? (
        <Box>
          <Stack direction="row" justifyContent="center" marginTop={4}>
            <Box
              sx={{
                background:
                  "linear-gradient(90deg, #EA3CD5 -2.12%, #E5FE57 100.77%),linear-gradient(0deg, #D9D9D9, #D9D9D9)",
                borderRadius: 199,
                padding: 1,
              }}
            >
              <Avatar
                src={profile?.imageFullUrl || profile?.imageUrl || imageUrl}
                style={{
                  borderWidth: "4px",
                }}
                sx={{
                  height: 199,
                  width: 199,
                }}
              />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Stack direction="row" justifyContent="center" marginTop={4}>
          <Avatar
            src={profile?.imageFullUrl || profile?.imageUrl || imageUrl}
            sx={{
              height: 199,
              width: 199,
            }}
          />
        </Stack>
      )}

      <Stack direction="column" justifyContent="center">
        <Stack mt={2}>
          <Typography
            align="center"
            sx={{ fontWeight: 600, fontSize: "21px", lineHeight: "26px" }}
            textTransform="capitalize"
          >
            {profile ? (
              profile?.firstName + " " + profile?.lastName
            ) : (
              <Skeleton width={160} height={40} sx={{ marginX: "auto" }} />
            )}
          </Typography>
          {profile?.role === "MP" ? (
            <Stack direction="row" justifyContent="center">
              <Box mt={3}>
                <Image src={MpTag} alt={"MpTag"} />
              </Box>
            </Stack>
          ) : (
            ""
          )}

          {loggedEmail === profile?.email || relavantUser === loggedEmail ? (
            ""
          ) : (
            <Stack
              sx={{
                borderRadius: 3,
                height: 44,
                justifyContent: "center",
                width: 170,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              {isFollowing?.following ? (
                <Button
                  sx={{
                    fontSize: 12,
                    borderRadius: "15px",
                    textTransform: "none",
                    width: 100,
                  }}
                  variant="contained"
                  onClick={() => {
                    unfollowUser(userId);
                  }}
                >
                  Following
                </Button>
              ) : (
                <Button
                  sx={{
                    fontSize: 12,
                    borderRadius: "15px",
                    textTransform: "none",
                    width: 100,
                  }}
                  variant="outlined"
                  onClick={() => {
                    followUser(userId);
                  }}
                >
                  Follow
                </Button>
              )}
            </Stack>
          )}
        </Stack>

        <ProfileSideBar profile={profile} userId={userId} />
      </Stack>
    </Box>
  );
};

export { UserProfilePublic };
