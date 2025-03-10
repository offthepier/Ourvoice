/* eslint-disable @next/next/no-css-tags */
"use client";

import { Box, Stack } from "@mui/material";
import { ChallengesView, HomeFeedPost, MainWrapper } from "../../components";
import {
  PostSkelton,
  StartProposalField,
  SurveyToolbar,
  SurveyToolbarMP,
  TopProposals,
} from "@/components/atoms";

import Head from "next/head";
import IPost from "@/types/IPost";
import IPosts from "@/service/NewsFeed/INewsFeed.interface";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import React from "react";
import { SideBar } from "@/components/molecules";
import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import withAuth from "src/hoc/withAuth";

const Challenge = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const { isLoading, data } = useQuery<IPost, Error>(
    ["challengePosts", id],
    async () => {
      return await NewsFeedService.getPostsByChallenge(id as string);
    },
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err: any) => {
        console.log(err);
      },
      enabled: id !== undefined,
    }
  );

  const { getUser } = useAuth();

  return (
    <MainWrapper
      childrenRight={
        <Stack>
          <ChallengesView selectedId={id as string} /> <TopProposals />
        </Stack>
      }
      childrenLeft={<SideBar />}
    >
      <Box width="100%" borderRadius={"16px"} component="form">
        <Head>
          <title>View Posts</title>
        </Head>

        <StartProposalField />

        <Stack direction="row" justifyContent="space-between" marginTop={1}>
          {getUser()?.role == USER_ROLES.MP ||
          getUser()?.role == USER_ROLES.ADMIN ? (
            <SurveyToolbarMP selected="none" />
          ) : (
            <SurveyToolbar selected="none" />
          )}
        </Stack>

        {isLoading ? (
          <>
            <PostSkelton />
            <PostSkelton />
          </>
        ) : (
          data &&
          data?.posts?.map((post: IPosts) => (
            <HomeFeedPost
              key={post.postId}
              post={post}
              challengeId={id as string}
            />
          ))
        )}
      </Box>
    </MainWrapper>
  );
};

export default withAuth(Challenge);
