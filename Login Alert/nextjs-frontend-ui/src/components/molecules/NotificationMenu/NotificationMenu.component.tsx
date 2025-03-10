import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import IAuthPageWrapper from "./NotificationMenu.interface";
import { NotificationItem } from "../../atoms";
import { Stack } from "@mui/system";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import INotification from "@/types/INotification";
import NotificationsService from "@/service/Notifications/Notifications.service";

const NotificationMenu = ({
  anchorEl,
  onClose,
  open = false,
  onNotificationCountUpdate,
}: IAuthPageWrapper) => {
  const queryClient = useQueryClient();

  const {  data } = useQuery<
    { notifications: INotification[] },
    Error
  >({
    queryKey: ["notifications"],
    queryFn: async () => {
      return await NotificationsService.getNotifications();
    },
    refetchOnWindowFocus: true,
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  const { mutateAsync } = useMutation(NotificationsService.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries("notifications");
    },
  });

  //Update Notifications Count
  useEffect(() => {
    if (data?.notifications) {
      const unread = data.notifications.filter(function (item) {
        return !item.status;
      }).length;
      onNotificationCountUpdate?.(unread);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          // maxHeight: ITEM_HEIGHT * 4.5,
          width: "40vw",
          right: 10,
          borderRadius: "15px",
          padding: 4,
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginY={1}
      >
        <Typography variant="h6" marginX={4}>
          Notifications
        </Typography>

        <Link href={"/notifications"} style={{ textDecoration: "none" }}>
          <Typography color="gray" marginRight={2}>
            See All
          </Typography>
        </Link>
      </Stack>

      <Divider sx={{ marginX: 1, marginBottom: 1 }} />
      {data && data.notifications.length > 0 ? (
        data.notifications.map((e, i) => {
          return (
            <MenuItem
              key={e.notificationId}
              // selected={option === "Pyxis"}
              onClick={() => {
                mutateAsync(e.notificationId);
                onClose?.();
              }}
              sx={{ whiteSpace: "normal" }}
            >
              <NotificationItem notification={e} />
            </MenuItem>
          );
        })
      ) : (
        <Typography textAlign="center" color="GrayText" marginY={2}>
          No Notifications
        </Typography>
      )}
    </Menu>
  );
};

export { NotificationMenu };
