import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import IAuthPageWrapper from "./LoadingDialog.interface";
import { Close } from "@mui/icons-material";
import { BasicModalDialog } from "../../atoms";

const LoadingDialog = ({
  title,
  description,
  open = false,
}: IAuthPageWrapper) => {
  return (
    <BasicModalDialog aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 1, p: 2 }}>{title}</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <CircularProgress sx={{ alignSelf: "center" }} />

          <Typography>{description}</Typography>
        </Stack>
      </DialogContent>
    </BasicModalDialog>
  );
};

export { LoadingDialog };
