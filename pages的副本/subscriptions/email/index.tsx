/* eslint-disable @next/next/no-css-tags */
"use client";

import React from "react";
import { ModelDialog, SideBar } from "@/components/molecules";
import { Button, Stack, Typography } from "@mui/material";
import withAuth from "src/hoc/withAuth";
import { MainWrapper } from "@/components/organism";
import { useMutation, useQuery } from "react-query";
import SubscriptionService from "@/service/Subscriptions/Subscription.service";
import { SUBSCRIPTION_STATUS } from "@/constants/emailSubscription";
import router from "next/router";
import { successImage } from "@/assets/index";
import withAuthRedirect from "src/hoc/withAuthRedirect";

const EmailUnsubscribe = () => {
  const [openSuccess, setOpenSuccess] = React.useState(false);

  const { mutateAsync, isLoading } = useMutation(
    SubscriptionService.unsubscribeEmailNotification,
    {
      onSuccess: (res) => {
        setOpenSuccess(true);
      },
      onError: (err: any) => {},
    }
  );

  const { isLoading: statusLoading, data: subscriptionStatus } = useQuery<
    { status: string },
    Error
  >(
    `emailSubscriptionStatus`,
    async () => {
      return await SubscriptionService.getSubscriptionStatus();
    },
    {
      onSuccess: (res) => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  return (
    <MainWrapper>
      {subscriptionStatus &&
      subscriptionStatus.status == SUBSCRIPTION_STATUS.INACTIVE ? (
        <Stack>
          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Your Email Notifications are currently inactive.
          </Typography>
          <Typography marginTop={2}>
            You are not receiving any email notifications from OurVoice.
          </Typography>
        </Stack>
      ) : (
        <Stack>
          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Unsubscribe Email Notifications
          </Typography>
          <Typography marginTop={2}>
            After Unsubscribing you will not receive any email notifications
            from OurVoice.
          </Typography>
          <Button
            sx={{ width: "200px", marginTop: 2 }}
            variant="contained"
            color="primary"
            onClick={() => mutateAsync()}
          >
            Confirm
          </Button>
        </Stack>
      )}

      <ModelDialog
        open={openSuccess}
        title="Email Notifications Unsubscribed Successfully!"
        onClickAction={() => {
          router.replace("/");
        }}
        buttonText="Done"
        imageUrl={successImage}
      />
    </MainWrapper>
  );
};

export default withAuthRedirect(EmailUnsubscribe, "/subscriptions/email");
