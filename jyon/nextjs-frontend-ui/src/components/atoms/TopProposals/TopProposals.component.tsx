import { Box, Typography, Stack, Button, Skeleton } from "@mui/material";
import React, { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";
import IPost from "./Proposals.interface";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import FollowersService from "@/service/Followers/Followers.service";
import COLORS from "@/themes/colors";
import IchallengeView from "@/components/molecules/ChallengesView/Challenges.interface";
import { handleOnMutateFollowPost } from "./logic/onMutateFollowPost";
import { handleOnMutateUnFollowPost } from "./logic/onMutateUnFollowPost";
import Link from "next/link";
import { CommunityContext } from "@/context/CommunityContext";

const useStyles = makeStyles({
  top: {
    width: "100%",
  },

  folowText: {
    color: "#6666FF",
    borderRadius: "32px",
    backgroundColor: "white",
    borderColor: "#6666FF",
    fontSize: 12,
    width: 80,
    textTransform: "none",
  },

  unFollowText: {
    color: "white",
    backgroundColor: "#6666FF",
    borderRadius: "32px",
    width: 80,
    fontSize: 12,
    textTransform: "none",
  },

  disabled: {
    opacity: 0.5,
    pointerEvents: "none",
    width: "100%",
  },
});

const TopProposals = ({ disabled, selectedId }: IchallengeView) => {
  const queryClient = useQueryClient();
  const [displayCount, setDisplayCount] = useState(4);
  const [showSeeMore, setShowSeeMore] = useState(true);
  const { setIsChallengeOrProposalSelected, setActiveCommunity } =
    useContext(CommunityContext);

  const classes = useStyles();
  const { isLoading, data } = useQuery<IPost[], Error>(
    "topProposals",
    async () => {
      return await NewsFeedService.getTopProposals();
    },
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const { mutateAsync: followPost } = useMutation(FollowersService.followPost, {
    onMutate: (newData) => {
      handleOnMutateFollowPost(newData, queryClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("topProposals");
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  const { mutateAsync: unfollowPost } = useMutation(
    FollowersService.unfollowPost,
    {
      onMutate: (newData) => {
        handleOnMutateUnFollowPost(newData, queryClient);
      },
      onSuccess: () => {
        queryClient.invalidateQueries("topProposals");
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  //Method to follow challenge
  const handleFollow = async (postId: string) => {
    await followPost(postId);
  };

  //Method to un-follow challenge
  const handleUnFollow = async (challengeID: string) => {
    await unfollowPost(challengeID);
  };

  const handleSeeMore = () => {
    setDisplayCount(data?.length || 0);
    setShowSeeMore(false);
  };

  const handleSeeLess = () => {
    setDisplayCount(4);
    setShowSeeMore(true);
  };

  const handleProposalClick = () => {
    setActiveCommunity("");
    setIsChallengeOrProposalSelected(true);

    // Save to local storage
    localStorage.setItem("selectedCommunity", "");
    localStorage.setItem("isChallengeOrProposalSelected", "true");
  };
  return (
    <Box className={disabled ? classes.disabled : classes.top}>
      <Box
        sx={{
          borderRadius: 2,
          marginTop: 2,
          padding: 2,
          backgroundColor: "white",
        }}
        border={COLORS.border}
      >
        <Typography fontWeight="bold">Trending Proposals</Typography>
        <Box mt={2} />

        {!isLoading ? (
          <Stack>
            {!data || data.length == 0 ? (
              <Typography color="grey" fontSize={12} textAlign="center">
                No proposals to display
              </Typography>
            ) : (
              data &&
              data?.slice(0, displayCount).map((post) => (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 4 }}
                  justifyContent="space-between"
                  key={post.postId}
                  style={{ marginTop: 3 }}
                  alignItems="center"
                  sx={
                    selectedId == post.postId
                      ? {
                          backgroundColor: COLORS.primarySelectedShade,
                          marginX: -2,
                          paddingX: 2,
                        }
                      : {}
                  }
                >
                  <Link
                    href={`/post/${encodeURIComponent(post.postId)}`}
                    onClick={handleProposalClick}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{ fontSize: 12, color: "#999999", marginTop: 1 }}
                    >
                      {post.title}
                    </Typography>
                  </Link>

                  {post?.followStatus ? (
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
                        handleUnFollow(post.postId);
                      }}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        fontSize: "12px",
                        borderRadius: "32px",
                        height: "28px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        minWidth: "80px",
                        ":hover": {
                          backgroundColor: COLORS.primary,
                          color: "white",
                        },
                      }}
                      variant="outlined"
                      onClick={() => {
                        handleFollow(post.postId);
                      }}
                    >
                      Follow
                    </Button>
                  )}
                </Stack>
              ))
            )}
            {showSeeMore && data && data.length > 4 && (
              <Typography
                onClick={handleSeeMore}
                sx={{
                  color: COLORS.greyIcon,
                  textAlign: "right",
                  marginTop: "10px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Show more..
              </Typography>
            )}

            {displayCount > 4 && (
              <Typography
                onClick={handleSeeLess}
                sx={{
                  color: COLORS.greyIcon,
                  textAlign: "right",
                  fontSize: "13px",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
              >
                Show less..
              </Typography>
            )}
          </Stack>
        ) : (
          <Stack>
            <Skeleton width={255} height={40} />
            <Skeleton width={255} height={40} />
            <Skeleton width={255} height={40} />
            <Skeleton width={255} height={40} />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export { TopProposals };
