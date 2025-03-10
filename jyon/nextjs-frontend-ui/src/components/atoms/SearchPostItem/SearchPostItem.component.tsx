import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import ISideBarItem from "./SearchPostItem.interface";

const SearchPostItem = ({ post }: ISideBarItem) => {
  return (
    <Link
      href={`/post/${encodeURIComponent(post?.postId)}`}
      style={{ textDecoration: "none" }}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        gap={1}
        marginLeft={1}
        marginBottom={1}
      >
        <Stack>
          <Typography
            fontSize="14px"
            textTransform="capitalize"
            lineHeight={1}
            color="black"
          >
            {post?.title}
          </Typography>
          <Typography fontSize="12px" marginTop={-0.2} color="grey">
            {post?.challenge}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
};

export { SearchPostItem };
