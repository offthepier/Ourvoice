import { DescriptionOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import INotificationItem from "./SurveyItem.interface";
import COLORS from "@/themes/colors";

const SurveyItem = ({
  onClick,
  visibility,
  actionType,
  surveyItem,
}: INotificationItem) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding={3}
      border={"1px solid " + COLORS.greyBorder}
      borderRadius={"8px"}
      alignItems="center"
      mb={1}
    >
      <Stack direction="row" gap={1} paddingRight={2}>
        <DescriptionOutlined />
        <Typography>{surveyItem.surveyTitle}</Typography>
      </Stack>
      <Button
        variant="outlined"
        sx={{
          minWidth: 120,
        }}
        onClick={onClick}
      >
        {actionType == "getStarted" ? "Get Started" : "View"}
      </Button>
    </Stack>
  );
};

export { SurveyItem };
