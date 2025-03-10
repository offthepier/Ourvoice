import { Avatar, Link, Stack, Typography } from "@mui/material";
import React from "react";
import ISideBarItem from "./SearchUserItem.interface";

const SearchUserItem = ({ user }: ISideBarItem) => {
  return (
    <Link
      href={"/profile/public/" + user?.id}
      style={{ textDecoration: "none", color: "black" }}
    >
      <Stack flexDirection="row" alignItems="center" gap={1} marginLeft={1}>
        <Avatar sx={{ width: 30, height: 30 }} src={user?.imageUrl} />
        <Stack>
          <Typography
            fontSize="14px"
            textTransform="capitalize"
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
          <Typography fontSize="12px" marginTop={-0.6} color="grey">
            {user?.role}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
};

export { SearchUserItem };
