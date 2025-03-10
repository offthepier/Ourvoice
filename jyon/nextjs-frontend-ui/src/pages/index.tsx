/* eslint-disable @next/next/no-css-tags */
"use client";

import { ChallengesView, MainWrapper } from "../components";

import HomeMiddlePage from "@/components/molecules/HomeMiddlePage/HomeMiddlePage";
import React from "react";
import { SideBar } from "@/components/molecules";
import { Stack } from "@mui/material";
import { TopProposals } from "@/components/atoms";
import withAuth from "src/hoc/withAuth";

const Home = () => {
  return (
    <MainWrapper
      data-testid="home-main-wrapper"
      childrenRight={
        <Stack>
          <ChallengesView /> <TopProposals />
        </Stack>
      }
      childrenLeft={<SideBar />}
    >
      <HomeMiddlePage />
    </MainWrapper>
  );
};

export default withAuth(Home);
