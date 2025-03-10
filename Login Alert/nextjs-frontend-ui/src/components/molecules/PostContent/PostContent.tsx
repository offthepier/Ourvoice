import COLORS from "src/themes/colors";
import {
  Divider,
  Box,
  Stack,
  Chip,
  Typography,
  useMediaQuery,
  Paper,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { FormInputWrapper } from "../../atoms/StyledComponents/FormInputWrapper";
import { useQuery } from "react-query";
import { IUserActivity } from "../NewsFeed/IhomeFeed.interface";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import { decrypt } from "../../../util/encrypt";
import { PostFollowButton } from "../..";
import { Edit } from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

//user profile posts
function PostContent({ post }: any) {
  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  const [showMore, setShowMore] = useState(false);
  const {
    postId,
    challenge,
    title,
    userId,
    tags,
    description,
    communityType,
    postType,
  } = post;

  const relevantUser = decrypt(userId);

  /* This function can be used to get the currently logged in user's information. */
  const { getUser } = useAuth();

  const getElectorateType = (communityType: any) => {
    let electorateType = "";

    if (communityType === "STATE") {
      electorateType = "State Electorate";
    } else if (communityType === "LOCAL") {
      electorateType = "Local Electorate";
    } else {
      electorateType = "Federal Electorate";
    }

    return electorateType;
  };

  const getDescription = (description: any, showMore: boolean) => {
    if (description.length > 20) {
      if (showMore) {
        return description;
      } else {
        return `${description?.substring(0, 200)}`;
      }
    } else {
      return description;
    }
  };

  const getSeeMoreLess = (description: any, showMore: boolean) => {
    if (description.length > 40) {
      if (showMore) {
        return (
          <Typography sx={{ cursor: "pointer", fontSize: "14px" }}>
            ...See less
          </Typography>
        );
      } else {
        return (
          <Typography sx={{ cursor: "pointer", fontSize: "14px" }}>
            ...See more
          </Typography>
        );
      }
    } else {
      return "";
    }
  };

  const { data: activityData } = useQuery<IUserActivity, Error>(
    [`userActivity ${postId}`],
    async () => {
      return await NewsFeedService.getUseractivity(postId);
    },
    {
      onSuccess: () => {},
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  return (
    <Paper key={postId} elevation={1}>
      <Box margin={2}>
        {relevantUser == getUser()?.email && (
          <Stack>
            <Link
              href={{
                pathname: "/proposals/newProposal",
                query: { postId: postId },
              }}
              style={{ alignSelf: "flex-end" }}
            >
              <Button
                variant="text"
                sx={{
                  color: "black",

                  ":hover": {
                    color: COLORS.primary,
                    background: "transparent",
                  },
                  height: 20,
                  marginTop: 1,
                }}
                size="small"
                startIcon={<Edit />}
              >
                Edit Post
              </Button>
            </Link>
          </Stack>
        )}

        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            spacing={2}
          >
            {postType === "GENERAL" ? (
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
              label={getElectorateType(communityType)}
              sx={{ background: "#F2F2F2" }}
              size="small"
            />

            <Chip
              label={challenge}
              sx={{ background: "#DDFEDD" }}
              size="small"
            />
          </Stack>
          <PostFollowButton
            postId={postId}
            relevantUser={relevantUser}
            postFollowStatus={activityData?.postFollowStatus}
          />
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            {title}
          </Typography>
        </FormInputWrapper>
        <Box mt={2} />
        <Divider />
        <Box mt={2} />
        <FormInputWrapper>
          <Typography
            onClick={() => setShowMore(!showMore)}
            sx={{ fontSize: "14px", textAlign: "justify" }}
            color={{ color: `${COLORS.greyIcon}` }}
          >
            {getDescription(description, showMore)}

            {getSeeMoreLess(description, showMore)}
          </Typography>
        </FormInputWrapper>
        <Box mt={2} mb={2} />
        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{
              width: { sm: "100%", md: "100%", lg: "80%" },
              marginBottom: "10px",
            }}
            spacing={1}
          >
            {tags &&
              tags.map((tag: any) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: "12px",
                    padding: "0px",
                    width: tag.length < 3 ? "35px" : "auto",
                  }}
                />
              ))}
          </Stack>
        </FormInputWrapper>
      </Box>
    </Paper>
  );
}

export { PostContent };
