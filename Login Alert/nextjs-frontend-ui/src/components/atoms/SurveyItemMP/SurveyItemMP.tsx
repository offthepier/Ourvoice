import { DescriptionOutlined } from "@mui/icons-material";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import INotificationItem from "./SurveyItemMP.interface";
import COLORS from "@/themes/colors";

const SurveyItemMP = ({
  onClickView,
  onClickResults,
  surveyItem,
}: INotificationItem) => {
  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  return (
    <Stack
      direction={mobileView ? "row" : "column"}
      justifyContent="space-between"
      padding={3}
      border={"1px solid " + COLORS.greyBorder}
      borderRadius={"8px"}
      alignItems={mobileView ? "center" : "start"}
      marginBottom={1}
      gap={mobileView ? 0 : 2}
    >
      <Stack direction="row" gap={1}>
        <DescriptionOutlined />
        <Typography paddingRight={2}>{surveyItem?.surveyTitle}</Typography>
      </Stack>
      <Stack direction="row" gap={2}>
        <Button
          variant="outlined"
          sx={{
            paddingX: 2,
          }}
          onClick={onClickView}
        >
          View
        </Button>
        <Button
          variant="outlined"
          sx={{
            // paddingX: 2,
            color: "gray",
            borderColor: "gray",
            minWidth: 140,
            // height:20
          }}
          // sx={{
          //   // paddingX: 2,
          // }}
          onClick={onClickResults}
        >
          Survey Results
        </Button>
      </Stack>
    </Stack>
  );
};

export { SurveyItemMP };
