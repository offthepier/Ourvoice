import { Add, Remove } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { MpTag, commentsLikes } from "@/assets/index";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import COLORS from "@/themes/colors";
import { CustomSvgIcon } from "../SvgIcon/CustomSvgIcon";
import { FormInputWrapper } from "../StyledComponents/FormInputWrapper";
import ICommentsList from "./ICommentsInterface";
import Image from "next/image";
import Linkify from "linkify-react";
import PostCommentService from "@/service/Comments/CommentsService";
import moment from "moment";
import { onDislikeComments } from "./Logic/onDislikeComments";
import { onLikeComments } from "./Logic/onLikeComments";
import { capitalizeFirstLetter } from "src/util/setCapital";

function Comments({ data, activities }: ICommentsList) {
  const queryClient = useQueryClient();
  console.log(data, "___comments__");
  const [likeComment] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const {
    commentID,
    comment,
    postID,
    userFirstName,
    userLastName,
    commentType,
    likesCount,
    createdAt,
    userImageUrl,
    userRole,
  } = data;

  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const { mutateAsync: likeComments } = useMutation(
    PostCommentService.likeComment,
    {
      onMutate: (newData) => {
        console.log(newData);
        onLikeComments(newData, queryClient);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`comments ${postID}`]);
        queryClient.invalidateQueries([`userActivity ${postID}`]);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  //dislike
  const { mutateAsync: disLikeComments } = useMutation(
    PostCommentService.likeComment,
    {
      onMutate: (newData) => {
        console.log(newData);
        onDislikeComments(newData, queryClient);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`comments ${postID}`]);
        queryClient.invalidateQueries([`userActivity ${postID}`]);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  const likeUserComment = async () => {
    try {
      await likeComments({
        postID: postID,
        commentID: commentID,
        status: !likeComment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const disLikUserComments = async () => {
    try {
      await disLikeComments({
        postID: postID,
        commentID: commentID,
        status: likeComment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderCommentChip = (commentType: string | undefined) => {
    if (commentType === "GENERAL") {
      return (
        <Chip
          label="General"
          sx={{
            background: "#CDCDFF",
            fontSize: 10,
            height: 20,
          }}
          size="small"
        />
      );
    } else if (commentType === "POSITIVE") {
      return (
        <Chip
          label="Argument"
          sx={{
            background: "#F6AFEE !important",
            fontSize: 10,
            height: 20,
          }}
          size="small"
          avatar={
            <Stack width={10} alignItems="center" alignContent="center">
              <Add
                sx={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  width: 12,
                  height: 12,
                  color: COLORS.argumentCommentIconColor,
                  alignSelf: "center",
                  marginY: "auto",
                }}
              />
            </Stack>
          }
        />
      );
    } else {
      return (
        <Chip
          label="Argument"
          avatar={
            <Stack width={10} alignItems="center" alignContent="center">
              <Remove
                sx={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  width: 12,
                  height: 12,
                  color: COLORS.argumentCommentIconColor,
                  alignSelf: "center",
                  marginY: "auto",
                }}
              />
            </Stack>
          }
          sx={{ background: "#F6AFEE", fontSize: 10, height: 20 }}
          size="small"
        />
      );
    }
  };

  const renderSeeMoreLess = () => {
    if (comment?.length < 50) {
      return "";
    }

    if (showMore) {
      return (
        <Typography sx={{ cursor: "pointer", fontSize: "14px" }}>
          ...See less
        </Typography>
      );
    }

    return (
      <Typography sx={{ cursor: "pointer", fontSize: "14px" }}>
        ...See more
      </Typography>
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <FormInputWrapper>
        <Stack
          direction={mobileView ? "column" : "row"}
          sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
          spacing={1}
          alignItems={mobileView ? "center" : "start"}
        >
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
            spacing={1}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center">
              <Stack>
                <Stack>
                  {userRole === "MP" ? (
                    <Box
                      sx={{
                        background:
                          "linear-gradient(90deg, #EA3CD5 -2.12%, #E5FE57 100%),linear-gradient(0deg, #D9D9D9, #D9D9D9)",
                        borderRadius: 199,
                        padding: 0.4,
                      }}
                    >
                      <Avatar
                        src={userImageUrl}
                        sx={{ width: 30, height: 30 }}
                      />
                    </Box>
                  ) : (
                    <Avatar src={userImageUrl} sx={{ width: 30, height: 30 }} />
                  )}
                </Stack>
              </Stack>
              {userRole === "MP" ? (
                <Stack direction="column" mt={2}>
                  <Stack direction="column">
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Typography
                        marginLeft="8px"
                        fontWeight="600"
                        fontSize={"12px"}
                        lineHeight={1}
                        textTransform="capitalize"
                        component="span"
                        maxWidth={"200px"}
                      >
                        {`${capitalizeFirstLetter(
                          userFirstName
                        )} ${capitalizeFirstLetter(userLastName)}`}
                      </Typography>

                      <Typography
                        sx={{ fontSize: "9px" }}
                        lineHeight={1}
                        marginTop={0}
                      >
                        {moment(createdAt).startOf("minute").fromNow()}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction={mobileView ? "row" : "column"}
                    sx={{ marginLeft: mobileView ? "6px" : "" }}
                    mt={0.5}
                    mb={0.5}
                  >
                    <Stack direction="row" justifyContent="center">
                      <Box>
                        <Image src={MpTag} alt={"MpTag"} />
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="column">
                  <Stack direction="column">
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Typography
                        marginLeft="12px"
                        fontWeight="600"
                        fontSize={"12px"}
                        lineHeight={1}
                        textTransform="capitalize"
                        component="span"
                        maxWidth={"200px"}
                      >
                        {userFirstName + " " + userLastName}
                      </Typography>

                      <Typography
                        sx={{ fontSize: "9px" }}
                        lineHeight={1}
                        marginTop={0}
                      >
                        {moment(createdAt).startOf("minute").fromNow()}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </Stack>
            <Stack paddingBottom={userRole === "MP" ? 2 : 0}>
              {renderCommentChip(commentType)}
            </Stack>
          </Stack>
        </Stack>
      </FormInputWrapper>
      {/* <Box mt={1} /> */}

      <Stack>
        <Container sx={{ fontSize: "14px" }}>
          <FormInputWrapper>
            <Grid
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              // mb={0.5}
              ml={mobileView ? 2.2 : 0}
              mt={mobileView ? -0.5 : 1}
            >
              <Linkify options={{ target: "_blank" }}>
                <Typography
                  onClick={() => setShowMore(!showMore)}
                  sx={{
                    textAlign: "justify",
                    whiteSpace: "pre-line",
                    fontSize: "14px",
                  }}
                >
                  {showMore ? comment : `${comment?.substring(0, 100)}`}
                  {renderSeeMoreLess()}
                </Typography>
              </Linkify>
            </Grid>
          </FormInputWrapper>
        </Container>
        <FormInputWrapper>
          <Grid
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1.5}
          >
            <Stack
              spacing={1}
              alignItems="center"
              marginLeft={mobileView ? 4.5 : 0}
              direction="row"
              marginTop={0.3}
            >
              {activities?.data.votedComments.includes(
                data?.commentID as string
              ) ? (
                <Button
                  sx={{
                    fontSize: "12px",
                    borderRadius: "32px",
                    height: "28px",
                    fontWeight: 400,
                    lineHeight: "18px",
                    minWidth: "80px",
                    color: COLORS.primary,
                    ":hover": {
                      backgroundColor: "white",
                      color: COLORS.primary,
                    },
                    width: 35,
                    // background: "red",
                    marginLeft: -0.7,
                  }}
                  // variant="outlined"
                  onClick={disLikUserComments}
                  startIcon={
                    <CustomSvgIcon
                      width={30}
                      height={30}
                      xmlns="http://www.w3.org/2000/svg"
                      d="M14.4988 19H3.93571V6.84L10.2238 0L10.9702 0.6175C11.1361 0.744167 11.2454 0.886667 11.2982 1.045C11.351 1.20333 11.3774 1.38542 11.3774 1.59125V1.82875L10.3595 6.84H17.6429C17.9897 6.84 18.3026 6.98646 18.5815 7.27938C18.8605 7.57229 19 7.90083 19 8.265V10.2125C19 10.3867 18.9811 10.5885 18.9435 10.8181C18.9058 11.0477 18.8492 11.2496 18.7738 11.4237L16.15 17.7887C16.0143 18.1213 15.7919 18.4062 15.4827 18.6437C15.1736 18.8812 14.8456 19 14.4988 19ZM2.57857 6.84V19H0V6.84H2.57857Z"
                      sx={{
                        ":hover": {
                          fill: COLORS.greyIcon,
                        },
                      }}
                      style={{ width: "20px", height: "20px" }}
                    />
                  }
                >
                  <Typography sx={{ fontSize: "12px", marginRight: -1 }}>
                    Liked
                  </Typography>
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
                    color: COLORS.greyIcon,
                    backgroundColor: "white",
                    // gap: "10px",
                    ":hover": {
                      backgroundColor: "transparent",
                      color: COLORS.primary,
                    },
                    marginLeft: -0.7,
                  }}
                  startIcon={
                    <CustomSvgIcon
                      width={30}
                      height={30}
                      xmlns="http://www.w3.org/2000/svg"
                      d="M15.2029 20H4.60621V7.2L11.241 0L12.1718 0.775C12.2673 0.858333 12.3389 0.975 12.3866 1.125C12.4344 1.275 12.4582 1.45833 12.4582 1.675V1.925L11.3842 7.2H18.5203C18.9021 7.2 19.2363 7.35 19.5227 7.65C19.8091 7.95 19.9523 8.3 19.9523 8.7V10.75C19.9523 10.8667 19.9642 10.9875 19.9881 11.1125C20.0119 11.2375 20 11.3583 19.9523 11.475L16.9451 18.725C16.8019 19.075 16.5672 19.375 16.241 19.625C15.9149 19.875 15.5688 20 15.2029 20ZM6.03819 18.5H15.5131L18.5203 11.025V8.7H9.61814L10.8831 2.475L6.03819 7.825V18.5ZM4.60621 7.2V8.7H1.43198V18.5H4.60621V20H0V7.2H4.60621Z"
                      style={{ width: "19px", height: "19px" }}
                    />
                  }
                  // variant="outlined"
                  onClick={likeUserComment}
                >
                  <Typography sx={{ fontSize: "14px" }}>Like</Typography>
                </Button>
              )}

              <Image src={commentsLikes} alt="blank" />

              <Box ml={1}>
                <Typography sx={{ fontSize: "14px" }}>{likesCount}</Typography>
              </Box>
            </Stack>
          </Grid>
        </FormInputWrapper>
      </Stack>
    </div>
  );
}

export { Comments };
