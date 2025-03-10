/* eslint-disable @next/next/no-css-tags */
"use client";
import React from "react";
import { ProfileWrapper } from "@/components/organism";
import { UserProfile, UserPost } from "@/components/molecules";
import IProfile from "@/types/IProfile";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { useQuery } from "react-query";
import Head from "next/head";
import { encrypt } from "src/util/encrypt";
import { useAuth } from "@/context/AuthContext";
import withAuth from "src/hoc/withAuth";

const UserProfilePublicPage = () => {
  const { getUser } = useAuth();
  const loggedEmail = getUser()?.email;

  //All the details
  const { data } = useQuery<IProfile, Error>(
    "public-profile",
    async () => {
      return await UserProfileService.getUserDetails();
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Profile | Public</title>
      </Head>
      <ProfileWrapper
        childrenLeft={<UserProfile type="Public" list={data} />}
        childrenRight={
          <UserPost
            details={data}
            id={encodeURIComponent(encrypt(loggedEmail ?? ""))}
          />
        }
      />
    </>
  );
};

export default withAuth(UserProfilePublicPage);
