import { Paper, Skeleton, Stack } from "@mui/material";

import React from "react";

const PostSkelton = () => {
  return (
    <Paper data-testid="post-skeleton" elevation={1} sx={{ marginTop: 1 }}>
      <Stack height={500} padding={3}>
        <Stack flexDirection="row" gap={1} justifyContent="space-between">
          <Stack flexDirection="row" gap={1}>
            <Skeleton variant="circular" width={35} height={35} />
            <Skeleton variant="text" width={200} />
          </Stack>
          <Skeleton variant="rounded" width={70} height={30} />
        </Stack>
        <Stack marginTop={1.5} flexDirection="row" gap={2}>
          <Skeleton
            variant="rounded"
            width={60}
            height={25}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rounded"
            width={80}
            height={25}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rounded"
            width={90}
            height={25}
            sx={{ borderRadius: 8 }}
          />
        </Stack>
        <Stack justifySelf="flex-start">
          <Skeleton variant="text" width={"100%"} height={100} />
          <Skeleton
            variant="text"
            width={"100%"}
            height={200}
            sx={{ marginTop: -6 }}
          />
        </Stack>

        <Stack
          // marginTop={1}
          flexDirection="row"
          gap={2}
          marginLeft={1}
          // justifyContent="space-between"
        >
          <Skeleton
            variant="rounded"
            width={90}
            height={25}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rounded"
            width={120}
            height={25}
            sx={{ borderRadius: 8 }}
          />
        </Stack>

        <Skeleton
          variant="text"
          width={"100%"}
          height={90}
          sx={{ marginTop: 2 }}
        />
        <Skeleton
          variant="text"
          width={"100%"}
          height={20}
          // sx={{ marginTop: -6 }}
        />
       
      </Stack>
    </Paper>
  );
};

export { PostSkelton };
