/* eslint-disable @next/next/no-css-tags */
"use client";
import React from "react";
import { ProfileWrapper } from "@/components/organism";
import { UserProfile, UserDetails } from "@/components/molecules";
import IProfile from "@/types/IProfile";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { useQuery } from "react-query";
import Head from "next/head";
import { encrypt } from "src/util/encrypt";
import { useAuth } from "@/context/AuthContext";
import withAuth from "src/hoc/withAuth";

const UserProfilePage = () => {
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

  const { getUser } = useAuth();
  const loggedEmail = getUser()?.email;

  return (
    <>
      <Head>
        <title>Profile | Private</title>
        {/* <link rel="stylesheet" href="/fonts/Inter.css" /> */}
      </Head>
      <ProfileWrapper
        data-testid="private-profile"
        childrenLeft={<UserProfile type="Private" list={data} />}
        childrenRight={
          <UserDetails
            details={data}
            id={encodeURIComponent(encrypt(loggedEmail ?? ""))}
          />
        }
      />
    </>
  );
};

export default withAuth(UserProfilePage);
