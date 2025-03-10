import { Menu, Skeleton, Typography } from "@mui/material";
import React from "react";
import IAuthPageWrapper from "./SearchMenu";
import { SearchPostItem, SearchUserItem } from "../../atoms";
import { Stack } from "@mui/system";
import { useMutation, useQueryClient } from "react-query";
import NotificationsService from "@/service/Notifications/Notifications.service";
import { USER_ROLES } from "@/constants/UserRoles";

const SearchMenu = ({
  anchorEl,
  onClose,
  open = false,
  searchResults,
  loadingResults,
}: IAuthPageWrapper) => {
  const queryClient = useQueryClient();

  useMutation(NotificationsService.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries("notifications");
    },
  });

  return (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      elevation={2}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          // maxHeight: ITEM_HEIGHT * 4.5,
          width: "500px",
          borderRadius: "8px",
          padding: 4,
          marginTop: 8,
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Stack>
        <Typography sx={{ fontWeight: "600", marginLeft: 1 }}>
          User Results
        </Typography>

        {loadingResults && (
          <Stack margin={1}>
            <Stack flexDirection="row" gap={1} alignItems="center">
              <Skeleton variant="circular" height={30} width={30} />
              <Stack width={"50%"}>
                <Skeleton />
                <Skeleton sx={{ marginTop: -0.4 }} height={15} />
              </Stack>
            </Stack>
            <Stack flexDirection="row" gap={1} alignItems="center">
              <Skeleton variant="circular" height={30} width={30} />
              <Stack width={"50%"}>
                <Skeleton />
                <Skeleton sx={{ marginTop: -0.4 }} height={15} />
              </Stack>
            </Stack>
          </Stack>
        )}

        {searchResults?.userResults &&
        searchResults?.userResults?.length > 0 ? (
          <Stack marginTop={1}>
            {searchResults?.userResults?.map((e, i) => {
              return (
                <SearchUserItem
                  key={e.id}
                  user={{
                    id: e.id,
                    firstName: e.firstName,
                    lastName: e.lastName,
                    role:
                      e.role == USER_ROLES.MP
                        ? "Member of Parliament"
                        : "Citizen",
                    imageUrl: e.imageUrl,
                  }}
                />
              );
            })}
          </Stack>
        ) : (
          <Stack margin={1}>
            <Typography color="grey" fontSize={"14px"}>
              {loadingResults ? "Searching..." : "No Search Results"}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Stack>
        <Typography sx={{ fontWeight: "600", marginLeft: 1, marginTop: 2 }}>
          Top Matching Post Results
        </Typography>

        {loadingResults && (
          <Stack margin={1}>
            <Stack width={"50%"}>
              <Skeleton />
              <Skeleton sx={{ marginTop: -0.4 }} height={15} />
            </Stack>
            <Stack width={"70%"}>
              <Skeleton />
              <Skeleton sx={{ marginTop: -0.4 }} height={15} />
            </Stack>
          </Stack>
        )}
        {searchResults?.postResults &&
        searchResults?.postResults?.length > 0 ? (
          <Stack marginTop={1}>
            {searchResults?.postResults?.map((e, i) => {
              return <SearchPostItem post={e} key={e.postId} />;
            })}
          </Stack>
        ) : (
          <Stack margin={1}>
            <Typography color="grey" fontSize={"14px"}>
              {loadingResults ? "Searching..." : "No Search Results"}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* <Divider sx={{ marginX: 1, marginBottom: 1 }} /> */}

      {/* <Typography textAlign="center" color="GrayText" marginY={2}>
        No Search Results
      </Typography> */}
    </Menu>
  );
};

export { SearchMenu };
