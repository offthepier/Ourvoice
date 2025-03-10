"use client";
import {
  BulkMpInvite, SideBar, SingleMpInvite
} from "@/components/molecules";
import { MainWrapper } from "@/components/organism";
import {
  Box
} from "@mui/material";
import Head from "next/head";
import withAuthAdmin from "src/hoc/withAuthAdmin";
const Home = () => {
  return (
    <>
      <Head>
        <title>Admin Tasks</title>
      </Head>
      <MainWrapper childrenLeft={<SideBar />}>
        <SingleMpInvite />
        <Box mt={2} />
        <BulkMpInvite />
      </MainWrapper>
    </>
  );
};

export default withAuthAdmin(Home);
