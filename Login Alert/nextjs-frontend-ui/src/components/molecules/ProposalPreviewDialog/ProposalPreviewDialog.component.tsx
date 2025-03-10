import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close,
  HighlightOff,
  PostAddOutlined,
  PreviewOutlined,
} from "@mui/icons-material";

import { BasicModalDialog } from "../../atoms";
import COLORS from "@/themes/colors";
import IAuthPageWrapper from "./ProposalPreviewDialog.interface";
import { NewsFeedPreviewItem } from "@/components/atoms/NewsFeedPreviewItem/NewsFeedPreviewItem";
import React from "react";
import { Stack } from "@mui/system";

const ProposalPreviewDialog = ({
  onClose,
  open = false,
  post,
  onClickPost,
  editMode,
}: IAuthPageWrapper) => {
  return (
    <BasicModalDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { backgroundColor: COLORS.bgColor } }}
    >
      <DialogTitle sx={{ m: 1, p: 2 }}>
        <Stack flexDirection="row" alignItems="center" marginTop={2}>
          <PreviewOutlined sx={{ fontSize: 28 }} />
          <Typography marginLeft={1} variant="h6">
            {editMode ? "Edit Post (Preview)" : "Create Post (Preview)"}
          </Typography>
        </Stack>
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
        <Stack sx={{ paddingX: 1 }}>
          <NewsFeedPreviewItem post={post} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ alignSelf: "center", marginBottom: 4 }}>
        <Stack sx={{ flexDirection: { sm: "column", md: "row" } }} gap={4}>
          <Button
            autoFocus
            variant="outlined"
            size="medium"
            onClick={onClose}
            startIcon={<HighlightOff />}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            size="medium"
            onClick={onClose}
            startIcon={<PreviewOutlined />}
            disabled
          >
            Preview
          </Button>
          <Button
            autoFocus
            variant="contained"
            size="medium"
            onClick={onClickPost}
            startIcon={<PostAddOutlined />}
            sx={{ padding: 1, paddingX: 4 }}
          >
            {editMode ? "Update" : "Post"}
          </Button>
        </Stack>
      </DialogActions>
    </BasicModalDialog>
  );
};

export { ProposalPreviewDialog };
