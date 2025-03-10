import { Avatar, Box, Stack, Typography } from "@mui/material";

import COLORS from "@/themes/colors";
import INotificationItem from "./NotificationItem.interface";
import NOTIFICATION_TYPES from "@/constants/NotificationTypes";
import React from "react";
import moment from "moment";
import { capitalizeFirstLetter } from "@/util/setCapital";

const NotificationItem = ({
  onClick,
  visibility,
  notification,
}: INotificationItem) => {
  const getNotificationBody = () => {
    const notificationAvatar = (
      <Avatar
        variant="rounded"
        sx={{
          borderRadius: "100%",
          imageRendering: "-webkit-optimize-contrast",
          transform: { translateY: 0 },
        }}
        src={notification.fromUserProfilePic || ""}
      />
    );

    switch (notification.notificationType) {
      case NOTIFICATION_TYPES.COMMENT: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}
            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              commented on your post
            </Typography>
          </Stack>
        );
      }
      case NOTIFICATION_TYPES.POST_LIKE: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}

            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              liked your post.
            </Typography>
          </Stack>
        );
      }
      case NOTIFICATION_TYPES.POST_VOTE: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}

            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              voted your proposal.
            </Typography>
          </Stack>
        );
      }
      case NOTIFICATION_TYPES.USER_FOLLOW: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}

            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              started following you.
            </Typography>
          </Stack>
        );
      }
      case NOTIFICATION_TYPES.COMMENT_LIKE: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}

            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              liked your comment.
            </Typography>
          </Stack>
        );
      }

      case NOTIFICATION_TYPES.POST_FOLLOW: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}

            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${capitalizeFirstLetter(
                notification.fromUserFirstName
              )} ${capitalizeFirstLetter(
                notification.fromUserLastName
              )} `}</strong>
              started following your post.
            </Typography>
          </Stack>
        );
      }

      case NOTIFICATION_TYPES.COMMENT_FOLLOWED_POST: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}
            <Typography fontSize={"14px"}>
              <strong
                style={{ textTransform: "capitalize" }}
              >{`${notification.fromUserFirstName} ${notification.fromUserLastName} `}</strong>
              commented on a post you are following.
            </Typography>
          </Stack>
        );
      }

      case NOTIFICATION_TYPES.SURVEY_PENDING: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}
            <Typography fontSize={"14px"}>
              You have a new pending survey from{" "}
              <strong style={{ textTransform: "capitalize" }}>
                {`${notification.fromUserFirstName} ${notification.fromUserLastName}. `}
              </strong>
            </Typography>
          </Stack>
        );
      }

      case NOTIFICATION_TYPES.ADMIN_SURVEY_PENDING: {
        return (
          <Stack flexDirection="row" alignItems="center" gap={2}>
            {notificationAvatar}
            <Typography fontSize={"14px"}>
              You have a new pending survey from{" "}
              <strong style={{ textTransform: "capitalize" }}>Admin</strong>.
            </Typography>
          </Stack>
        );
      }
    }
  };
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width={"100%"}
      data-testid="notification-item"
    >
      <Stack flexDirection="row" alignItems="center" maxWidth={"80%"}>
        {notification?.status ? (
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "12px",
              marginRight: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "12px",
              marginRight: 1,
              backgroundColor: COLORS.notificationDotColor,
            }}
          />
        )}

        {getNotificationBody()}
      </Stack>
      <Typography sx={{ color: "grey", fontSize: "12px", ml: 2 }} noWrap>
        {moment(notification.createdAt).fromNow()}
      </Typography>
    </Stack>
  );
};

export { NotificationItem };
