import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import IAuthPageWrapper from "./ModelDialog.interface";
import { Close } from "@mui/icons-material";
import { BasicModalDialog } from "../../atoms";
import { Stack } from "@mui/system";
import Image from "next/image";

const ModelDialog = ({
  title,
  description,
  onClickAction,
  onClose,
  buttonText,
  imageUrl,
  open = false,
}: IAuthPageWrapper) => {
  return (
    <BasicModalDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 1, p: 2 }}>
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
      </DialogTitle>
      <DialogContent>
        {imageUrl && (
          <Stack alignItems="center" mb={2}>
            <Box>
              <Image src={imageUrl || "Text"} alt={"Avatar"} />
            </Box>
            {/* <Box component="img" src={imageUrl} /> */}
          </Stack>
        )}
        <Typography textAlign="center" gutterBottom variant="h6" paddingX={2}>
          {title}
        </Typography>
        <Typography textAlign="center" gutterBottom paddingX={6}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ alignSelf: "center", marginBottom: 4, marginX: 4 }}>
        {buttonText && (
          <Button
            autoFocus
            variant="contained"
            size="large"
            onClick={onClickAction}
          >
            {buttonText}
          </Button>
        )}
      </DialogActions>
    </BasicModalDialog>
  );
};

export { ModelDialog };
