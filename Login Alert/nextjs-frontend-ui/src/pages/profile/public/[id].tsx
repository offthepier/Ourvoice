/* eslint-disable @next/next/no-css-tags */
"use client";
import React from "react";
import { ProfileWrapper } from "@/components/organism";
import { UserPost, UserProfilePublic } from "@/components/molecules";
import IProfile from "@/types/IProfile";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { useQuery } from "react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import withAuth from "src/hoc/withAuth";

const UserProfilePublicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  //All the details
  const { data } = useQuery<IProfile, Error>(
    "public-profile",
    async () => {
      return await UserProfileService.getUserPublicProfile(id as string);
    },
    {
      enabled: id != undefined,
    }
  );

  return (
    <>
      <Head>
        <title>Profile | Public</title>
      </Head>
      {id && (
        <ProfileWrapper
          childrenLeft={
            <UserProfilePublic profile={data} userId={id as string} />
          }
          childrenRight={<UserPost details={data} id={id as string} />}
        />
      )}
    </>
  );
};

export default withAuth(UserProfilePublicPage);
