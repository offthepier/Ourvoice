"use client";
import { Box, Divider, MenuItem, Skeleton, Typography } from "@mui/material";
import React from "react";
import { SideBar } from "@/components/molecules";
import withAuth from "src/hoc/withAuth";
import { MainWrapper } from "@/components/organism";
import { NotificationItem } from "@/components/atoms";
import INotification from "@/types/INotification";
import { useMutation, useQuery, useQueryClient } from "react-query";
import NotificationsService from "@/service/Notifications/Notifications.service";
import Head from "next/head";
const Home = () => {
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery<
    { notifications: INotification[] },
    Error
  >(
    "notificationsAll",
    async () => {
      return await NotificationsService.getNotificationsAll();
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

  const { mutateAsync } = useMutation(NotificationsService.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries("notificationsAll");
      queryClient.invalidateQueries("notifications");
    },
  });

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <MainWrapper
        childrenLeft={<SideBar disabled={true} />}
        // childrenRight={
        //   <Stack>
        //     {/* <ChallengesView disabled={true} />
        //     <TopProposals disabled={true} /> */}
        //   </Stack>
        // }
      >
        <Box
          sx={{ backgroundColor: "white", padding: 2, borderRadius: "12px" }}
        >
          <Typography variant="h6" marginX={4}>
            Notifications
          </Typography>

          <Divider sx={{ marginX: 1, marginY: 2 }} />

          {isLoading ? (
            <>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={30}
                sx={{ marginY: 1, borderRadius: 4 }}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={30}
                sx={{ marginY: 1, borderRadius: 4 }}
              />
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={30}
                sx={{ marginY: 1, borderRadius: 4 }}
              />
            </>
          ) : (
            data?.notifications?.map((e, i) => {
              return (
                <MenuItem
                  onClick={() => mutateAsync(e.notificationId)}
                  sx={{ whiteSpace: "normal" }}
                  key={e.notificationId}
                >
                  <NotificationItem notification={e} key={e.notificationId} />
                </MenuItem>
              );
            })
          )}
        </Box>
      </MainWrapper>
    </>
  );
};

export default withAuth(Home);
