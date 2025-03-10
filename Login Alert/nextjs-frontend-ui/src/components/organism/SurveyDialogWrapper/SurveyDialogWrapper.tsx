import { BasicModalDialog } from "@/components/atoms";
import { Close } from "@mui/icons-material";
import { Chip, DialogTitle, IconButton, Typography } from "@mui/material";
import Linkify from "linkify-react";
import moment from "moment";
import React from "react";
import ISurveyDialogWrapper from "./SurveyDialogWrapper.interface";

const getExpirationStatus = (expiration: string | undefined) => {
  if (expiration) {
    const isExpired = moment(expiration).isBefore(new Date());
    const status = isExpired ? "Expired" : "Expires";
    const expirationTime = moment(expiration).fromNow();
    return `${status} ${expirationTime}`;
  } else {
    return "No Expiration Provided";
  }
};

const SurveyDialogWrapper = ({
  open,
  onClose,
  title,
  description,
  expiration,
  children,
}: ISurveyDialogWrapper) => {
  return (
    <BasicModalDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        )}

        <Chip
          label={
            expiration
              ? getExpirationStatus(expiration)
              : "No Expiration Provided"
          }
          sx={{
            position: "absolute",
            left: 20,
            top: 35,
            color: "grey",
            fontSize: "12px",
          }}
        />

        <Typography
          variant="h6"
          marginTop={8}
          textAlign="justify"
          sx={{ ":first-letter": { textTransform: "capitalize" } }}
          fontSize={"16px"}
        >
          {title.length == 0 ? "Your Survey Title Goes Here" : title}
        </Typography>

        <Linkify options={{ target: "_blank" }}>
          <Typography marginTop={1} fontSize={"14px"} textAlign="justify">
            {description.length == 0
              ? "Your Survey Description Goes Here"
              : description.toString()}
          </Typography>
        </Linkify>
      </DialogTitle>
      {children}
    </BasicModalDialog>
  );
};

export default SurveyDialogWrapper;
