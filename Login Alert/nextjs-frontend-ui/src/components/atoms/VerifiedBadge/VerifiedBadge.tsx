import { verifyTick } from "@/assets/index";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Image from "next/image";
import React from "react";

const VerifiedBadge = () => {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={1}
      marginY={1}
    >
      <Image src={verifyTick} width={15} height={15} alt="verified logo" />
      <Typography fontSize="12px" fontWeight="bold">
        Verified
      </Typography>
    </Stack>
  );
};

export { VerifiedBadge };
