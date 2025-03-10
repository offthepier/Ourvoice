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
import IPostFull from "@/types/IPostFull";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import React from "react";
import { SideBar } from "@/components/molecules";
import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import withAuth from "src/hoc/withAuth";

const PostView = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(decodeURIComponent(id as string));

  const { isLoading, data } = useQuery<IPostFull, Error>(
    ["post" + decodeURIComponent(id as string), id],
    async () => {
      return await NewsFeedService.getPostById(
        decodeURIComponent(id as string)
      );
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
          <ChallengesView />{" "}
          <TopProposals selectedId={decodeURIComponent(id as string)} />
        </Stack>
      }
      childrenLeft={<SideBar />}
    >
      <Box width="100%" borderRadius={"16px"} component="form">
        <Head>
          <title>View Post</title>
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
          data && <HomeFeedPost key={data.post.postId} post={data.post} />
        )}
      </Box>
    </MainWrapper>
  );
};

export default withAuth(PostView);
