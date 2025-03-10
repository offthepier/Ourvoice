import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

import COLORS from "src/themes/colors";
import { FormInputWrapper } from "../StyledComponents/FormInputWrapper";
import INewsFeedPreviewItem from "./INewsFeedPreviewItem.interface";
import Image from "next/image";
import Linkify from "linkify-react";
import { MpTag } from "@/assets/index";
import { POST_DESCRIPTION_LENGTH } from "@/constants/PostLegnths";
import { POST_TYPES } from "@/constants/PostTypes";
import Post from "@/types/Post";
import { ReactPictureGrid } from "react-picture-grid";
import moment from "moment";

function NewsFeedPreviewItem({ post }: INewsFeedPreviewItem) {
  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  const [showMore, setShowMore] = useState(false);
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: function (number, withoutSuffix) {
        return withoutSuffix ? "now" : "a few seconds";
      },
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1mth",
      MM: "%dmth",
      y: "1y",
      yy: "%dy",
    },
  });
  console.log(post);

  const getElectorate = (post: Post) => {
    if (post.community === "STATE") {
      return "State Electorate";
    } else if (post.community === "LOCAL") {
      return "Local Electorate";
    } else {
      return "Federal Electorate";
    }
  };

  const renderDescription = () => {
    if (post.description.length < POST_DESCRIPTION_LENGTH) {
      return "";
    } else {
      if (showMore) {
        return (
          <span style={{ cursor: "pointer", color: "black" }}>...See less</span>
        );
      } else {
        return (
          <span style={{ cursor: "pointer", color: "black" }}>...See more</span>
        );
      }
    }
  };

  return (
    <Paper
      key={post.postId}
      elevation={1}
      sx={{
        marginBottom: 1,
        borderRadius: 4,
        maxWidth: "500px",
        width: "100%",
        margin: "auto",
      }}
    >
      {/* <Box mt={2} /> */}

      {post.postType === POST_TYPES.GENERAL ? (
        <Divider
          color="rgb(102, 102, 255)"
          sx={{
            height: "3px",
            backgroundColor: "rgb(102, 102, 255)",
            marginX: 1.7,
          }}
        />
      ) : (
        <Divider
          color="#EA3CD5"
          sx={{
            height: "3px",
            backgroundColor: "rgba(234, 60, 213, 1)",
            marginX: 1.7,
          }}
        />
      )}

      <Box margin={2} sx={{ borderRadius: "15px" }}>
        <Box mt={2} />
        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            spacing={1}
            alignItems="center"
            // marginTop={1}
          >
            <Stack direction="row" alignItems="center">
              {post?.userRole === "MP" ? (
                <Box
                  sx={{
                    background:
                      "linear-gradient(to right top, #EA3CD5, #E5FE57)",
                    borderRadius: 30,
                  }}
                  padding={0.2}
                >
                  <Avatar src={post.userImg} sx={{ width: 35, height: 35 }} />
                </Box>
              ) : (
                <Avatar src={post.userImg} sx={{ width: 30, height: 30 }} />
              )}
              {post?.userRole === "MP" ? (
                <Stack direction="column">
                  <Stack mt={2} direction="row" alignItems="center" gap={2}>
                    <Typography
                      marginLeft="8px"
                      fontWeight="600"
                      fontSize={"12px"}
                      lineHeight={1}
                      textTransform="capitalize"
                      component="span"
                      maxWidth={"200px"}
                      // bgcolor="blue"
                    >
                      {post.userFirstName + " " + post.userLastName}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "9px" }}
                      lineHeight={1}
                      marginTop={0}
                    >
                      {moment(new Date()).startOf("minute").fromNow()}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={mobileView ? "row" : "column"}
                    sx={{ marginLeft: mobileView ? "7px" : "" }}
                    mt={0.7}
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
                      {post.userFirstName + " " + post.userLastName}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "9px" }}
                      lineHeight={1}
                      marginTop={0}
                    >
                      {moment(new Date()).startOf("minute").fromNow()}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>

            {/* <Box marginTop={}> */}

            {/* </Box> */}
          </Stack>

          <Stack mt={1}>
            <Button
              sx={{
                fontSize: 12,
                borderRadius: "18px",
                textTransform: "none",
                "&:hover": {
                  background: "none",
                },
                // width: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              variant="outlined"
            >
              Follow
            </Button>
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            spacing={2}
          >
            {post.postType === POST_TYPES.GENERAL ? (
              <Chip
                label="General"
                sx={{ background: "#CDCDFF" }}
                size="small"
              />
            ) : (
              <Chip
                label="Proposal"
                sx={{ background: "#F6AFEE" }}
                size="small"
              />
            )}

            <Chip
              label={getElectorate(post)}
              sx={{ background: "#F2F2F2" }}
              size="small"
            />
            <Chip
              label={post.challenge || "No Topic"}
              sx={{ background: "#DDFEDD" }}
              size="small"
            />
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        {post.postType === POST_TYPES.PROPOSAL && (
          <FormInputWrapper>
            <Typography sx={{ fontSize: "14px", fontWeight: 600, ml: 1 }}>
              {post.title || "Your Post Title Will Appear Here"}
            </Typography>
          </FormInputWrapper>
        )}
        <Box mt={2} />
        <Divider />
        <Box mt={2} />
        <FormInputWrapper>
          <Linkify options={{ target: "_blank" }}>
            <Typography
              sx={{
                fontSize: "14px",
                ml: 1,
                whiteSpace: "pre-line",
                wordBreak: "break-all",
              }}
              color={{ color: `${COLORS.neutralTextBlack}` }}
              align="justify"
              component="div"
            >
              {showMore
                ? post.description.toString()
                : `${post.description
                    ?.substring(0, POST_DESCRIPTION_LENGTH)
                    .toString()}`}
              <Typography
                onClick={() => setShowMore(!showMore)}
                sx={{ fontSize: "14px" }}
                component="span"
              >
                {renderDescription()}

                {!post.description && "Your Post Description Will Appear Here"}
              </Typography>
            </Typography>
          </Linkify>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            spacing={1}
          >
            {post.tags &&
              post.tags.map((tag: any, i) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: "12px",
                    width: tag.length < 3 ? "35px" : "auto",
                  }}
                />
              ))}
          </Stack>
        </FormInputWrapper>
        <Box mt={1} />
      </Box>
      {post.images && post.images.length > 0 && (
        <ReactPictureGrid
          data={post.images.map((e, i) => {
            return {
              image: e,
              title: "Image " + i,
              description: post.title + " image " + i,
            };
          })}
          gap={2}
          showPreview={true}
          pattern={[post.images.length < 2 ? "wide" : "small"]}
        />
      )}
    </Paper>
  );
}

export { NewsFeedPreviewItem };
