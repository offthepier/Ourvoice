import { Add, InsertEmoticon, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import COLORS from "@/themes/colors";
import COMMENTS_TYPES from "@/constants/CommentsTypes";
import { FormInputWrapper } from "../StyledComponents";
import IComment from "./IComments";
import PostCommentService from "@/service/Comments/CommentsService";
import EmojiPicker from "emoji-picker-react";

function AddComments({ mobileView, postId }: IComment) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(PostCommentService.createNewComment, {
    onSuccess: (res) => {
      queryClient.invalidateQueries([`comments ${postId}`]);
    },
    onError: (err: any) => {},
  });
  const [newComment, setNewComment] = useState("");
  const [commentType, setNewCommentType] = useState("GENERAL");
  const [flag, setFlag] = useState(false);
  const [addPostive, setPositve] = useState(false);
  const [addNegative, setNegative] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmit = async () => {
    try {
      await mutateAsync({
        postID: postId,
        comment: newComment,
        commentType: commentType,
      });
      clearData();
    } catch (error) {}
  };

  const commentGeneral = () => {
    setNewCommentType(COMMENTS_TYPES.GENERAL);
    setFlag(true);
    setPositve(false);
    setNegative(false);
  };

  const addPostiveComment = () => {
    setNewCommentType(COMMENTS_TYPES.POSITIVE);
    setPositve(true);
    setFlag(false);
    setNegative(false);
  };

  const addRemoveComment = () => {
    setNewCommentType(COMMENTS_TYPES.NEGATIVE);
    setNegative(true);
    setFlag(false);
    setPositve(false);
  };

  const clearData = () => {
    setNewComment("");
    setNewCommentType("GENERAL");
    setFlag(false);
    setPositve(false);
    setNegative(false);
  };
  return (
    <>
      <Box mb={1}>
        <Paper
          variant="outlined"
          sx={{
            maxHeight: `${mobileView} ? "170px" : "130px"`,
            borderRadius: "10px",
            border: "1px solid #F2F2F2",
          }}
        >
          <FormInputWrapper>
            <Stack
              direction={mobileView ? "row" : "column"}
              sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
              spacing={1}
              marginTop={1}
              alignItems="center"
            >
              <Button
                data-testid="general-comment-button"
                disableElevation
                onClick={commentGeneral}
              >
                <Chip
                  label="General"
                  sx={{
                    background: !flag ? "#CDCDFF" : COLORS.primary,
                    color: !flag ? "black" : "white",
                    fontWeight: "400",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  size="small"
                />
              </Button>

              <Stack
                sx={{
                  backgroundColor: "#F6AFEE",
                  color: "black",
                  textTransform: "none",
                  fontWeight: 400,
                  height: 22,
                  // paddingX
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {" "}
                <Remove
                  sx={{
                    height: 17,
                    background: !addNegative ? "white" : "#EF6ADF",
                    borderRadius: 12,
                    marginLeft: 0.3,
                    marginRight: 1,
                    cursor: "pointer",
                    color: !addNegative
                      ? COLORS.argumentCommentIconColor
                      : "white",
                  }}
                  onClick={addRemoveComment}
                />{" "}
                <Typography fontSize={"12px"}>Argument</Typography>{" "}
                <Add
                  sx={{
                    height: 17,
                    background: !addPostive ? "white" : "#EF6ADF",
                    borderRadius: 12,
                    marginRight: 0.3,
                    marginLeft: 1,
                    cursor: "pointer",
                    color: !addPostive
                      ? COLORS.argumentCommentIconColor
                      : "white",
                  }}
                  onClick={addPostiveComment}
                />
              </Stack>
            </Stack>
          </FormInputWrapper>

          {/* <Divider /> */}
          <FormInputWrapper margin={1}>
            <TextField
              spellCheck={true}
              multiline={true}
              maxRows={4}
              sx={{
                width: { sm: "100%", md: "100%", lg: "100%" },
                // height: "44px",
                "& fieldset": { border: "none" },
                fontSize: "12px",
              }}
              inputProps={{ style: { fontSize: "12px" } }}
              placeholder="Add a comment with comment type"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" component="div" style={{}}>
                    <IconButton
                      onClick={handleClick}
                      id="basic-button"
                      sx={{ width: 40 }}
                    >
                      <InsertEmoticon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{ backgroundColor: "transparent" }}
              PaperProps={{ sx: { padding: "0px", boxShadow: "none" } }}
            >
              <EmojiPicker
                searchDisabled={true}
                previewConfig={{ showPreview: false }}
                onEmojiClick={(e) => setNewComment(newComment + e.emoji)}
                height={350}
                width="100%"
              />
            </Menu>
          </FormInputWrapper>
          {/* <Divider /> */}
        </Paper>
        <FormInputWrapper margin={2}>
          {newComment.length > 0 ? (
            <Button
              sx={{
                fontSize: "12px",
                borderRadius: "32px",
                height: "28px",
                fontWeight: 400,
                lineHeight: "18px",
                minWidth: "80px",
                marginBottom: "15px",
                ":hover": {
                  backgroundColor: COLORS.primary,
                  color: "white",
                },
              }}
              variant="outlined"
              onClick={handleSubmit}
            >
              Post
            </Button>
          ) : (
            <Button
              sx={{
                fontSize: "12px",
                borderRadius: "32px",
                height: "28px",
                fontWeight: 400,
                lineHeight: "18px",
                minWidth: "80px",
                marginBottom: "15px",
                // gap: "10px",
                ":hover": {
                  backgroundColor: COLORS.primary,
                  color: "white",
                },
              }}
              variant="outlined"
              disabled
            >
              Post
            </Button>
          )}
        </FormInputWrapper>
      </Box>
    </>
  );
}

export { AddComments };
