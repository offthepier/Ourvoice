import { Logo } from "@/assets/index";
import COLORS from "@/themes/colors";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Image from "next/image";
import React from "react";

const OurVoiceLoadingAnimation = () => {
  return (
    <Stack
      alignContent="center"
      alignItems="center"
      bgcolor={COLORS.bgColor}
      height={"98vh"}
    >
      <Box marginTop={8}>
        <Image src={Logo} alt="Our Voice Logo" width={350} />
      </Box>

      <CircularProgress sx={{ marginY: 4, color: COLORS.primary }} />
      <Typography>Loading..</Typography>
    </Stack>
  );
};

export { OurVoiceLoadingAnimation };
