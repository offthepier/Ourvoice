import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { IPosts, IUserActivity } from "./IhomeFeed.interface";
import { MpTag, comment, commentsLikes, positiveVote } from "src/assets/index";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { AddComments } from "../../atoms/AddComments/AddComments";
import COLORS from "src/themes/colors";
import { Comments } from "../../atoms/CommentsList/Comments";
import { CommunityContext } from "@/context/CommunityContext";
import { CustomSvgIcon } from "../../atoms/SvgIcon/CustomSvgIcon";
import { FormInputWrapper } from "../../atoms/StyledComponents/FormInputWrapper";
import ICommentsList from "@/service/Comments/IComments.interface";
import Image from "next/image";
import Linkify from "linkify-react";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import { POST_DESCRIPTION_LENGTH } from "@/constants/PostLegnths";
import { POST_TYPES } from "@/constants/PostTypes";
import PostCommentService from "@/service/Comments/CommentsService";
import { ProposalToolTip } from "../../atoms/Proposal/ProposalToolTip";
import { ReactPictureGrid } from "react-picture-grid";
import VOTES_TYPES from "@/constants/VotesType";
import { decrypt } from "../../../util/encrypt";
import { capitalizeFirstLetter } from "src/util/setCapital";
import moment from "moment";
import { onLikePost } from "./logic/onLikePost";
import { PostFollowButton } from "../../atoms/PostFollowButton/PostFollowButton";
import { onLikePostChallengeFeed } from "./logic/onLikePostChellengeFeed";

function HomeFeedPost({
  post,
  challengeId,
}: {
  post: IPosts;
  challengeId?: string;
}) {
  const {
    postId,
    challenge,
    title,
    userId,
    images,
    tags,
    createdAt,
    description,
    likes,
    positiveVotes = 0,
    negativeVotes = 0,
    userFirstName,
    userLastName,
    communityType,
    postType,
  } = post;

  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  const [showMore, setShowMore] = useState(false);
  const [likePost] = useState(false);
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const [positiveVotesCount, setPositiveVotesCount] = useState(0);
  const [negativeVotesCount, setNegativeVotesCount] = useState(0);
  const { activeCommunity } = useContext(CommunityContext);
  const [displayCount, setDisplayCount] = useState(3);
  const [showSeeMore, setShowSeeMore] = useState(true);

  useEffect(() => {
    if (positiveVote < 0) setPositiveVotesCount(0);
    else setPositiveVotesCount(positiveVotes);
  }, [positiveVotes]);

  useEffect(() => {
    if (negativeVotes < 0) setNegativeVotesCount(0);
    else setNegativeVotesCount(negativeVotes);
  }, [negativeVotes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCommentsLoaded(true);
          observer.disconnect();
        } else {
          setCommentsLoaded(false);
        }
      });
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);
  //getUserActivity

  const { isLoading, data } = useQuery<ICommentsList[], Error>(
    `comments ${postId}`,
    async () => {
      return await PostCommentService.getPostsComments(postId);
    },
    {
      onSuccess: () => {},
      onError: (err: any) => {
        console.log(err);
      },
      enabled: commentsLoaded,
    }
  );

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
      enabled: commentsLoaded,
    }
  );

  const { mutateAsync: likePosts } = useMutation(NewsFeedService.likePost, {
    onMutate: (newData) => {
      console.log(newData);
      if (challengeId) {
        onLikePostChallengeFeed(newData, queryClient, challengeId);
      } else {
        onLikePost(newData, queryClient, activeCommunity);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`userActivity ${postId}`]);
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  //dislike
  const { mutateAsync: disLikePosts } = useMutation(NewsFeedService.likePost, {
    onMutate: (newData) => {
      console.log(newData);
      if (challengeId) {
        onLikePostChallengeFeed(newData, queryClient, challengeId);
      } else {
        onLikePost(newData, queryClient, activeCommunity);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`userActivity ${postId}`]);
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  const generalPostLike = async () => {
    try {
      await likePosts({
        postID: postId,
        postCreatorID: userId,
        postCreatorRole: activityData?.postCreatorInfo.role,
        status: !likePost,
        type: VOTES_TYPES.LIKE,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const generalPostDislike = async () => {
    try {
      await disLikePosts({
        postID: postId,
        postCreatorID: userId,
        postCreatorRole: activityData?.postCreatorInfo.role,
        status: likePost,
        type: VOTES_TYPES.LIKE,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //vote postive

  const votePostive = async (status: boolean) => {
    try {
      await likePosts({
        postID: postId,
        postCreatorID: userId,
        postCreatorRole: "MP",
        status: !status,
        type: VOTES_TYPES.POSITIVE,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const voteNegative = async (status: boolean) => {
    try {
      await disLikePosts({
        postID: postId,
        postCreatorID: userId,
        postCreatorRole: "MP",
        status: !status,
        type: VOTES_TYPES.NEGATIVE,
      });
    } catch (error) {
      console.log(error);
    }
  };

  let postCreatorImage = activityData?.postCreatorInfo.imageUrl;

  const handleSeeMore = () => {
    setDisplayCount(data?.length || 0);
    setShowSeeMore(false);
  };

  const handleSeeLess = () => {
    setDisplayCount(3);
    setShowSeeMore(true);
  };

  //decrypt the userid

  const relavantUSer = decrypt(userId);

  const getElectorateLabel = (communityType: string) => {
    let label;

    if (communityType === "STATE") {
      label = "State Electorate";
    } else if (communityType === "LOCAL") {
      label = "Local Electorate";
    } else {
      label = "Federal Electorate";
    }

    return label;
  };

  function renderDescriptionToggle() {
    if (description.length < POST_DESCRIPTION_LENGTH) {
      return "";
    } else if (showMore) {
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
  }

  const renderComments = () => {
    if (commentsLoaded) {
      if (isLoading) {
        return <div>Loading...</div>;
      } else {
        return (
          data &&
          data
            .slice(0, displayCount)
            .map((commentsList: ICommentsList) => (
              <Comments
                data={commentsList}
                key={commentsList.commentID}
                activities={activityData}
              />
            ))
        );
      }
    } else {
      return null;
    }
  };

  return (
    <Paper key={postId} elevation={1} ref={containerRef}>
      <Box mt={1} />
      {postType === POST_TYPES.GENERAL ? (
        <Divider
          color="rgb(102, 102, 255)"
          sx={{ height: "3px", backgroundColor: "rgb(102, 102, 255)" }}
        />
      ) : (
        <Divider
          color="#EA3CD5"
          sx={{ height: "3px", backgroundColor: "rgba(234, 60, 213, 1)" }}
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
          >
            <Stack direction="row" alignItems="center">
              <Stack>
                <Stack>
                  {activityData?.postCreatorInfo.role === "MP" ? (
                    <Box
                      sx={{
                        background:
                          "linear-gradient(90deg, #EA3CD5 -2.12%, #E5FE57 100%),linear-gradient(0deg, #D9D9D9, #D9D9D9)",
                        borderRadius: 199,
                        padding: 0.3,
                      }}
                    >
                      {activityData.postCreatorInfo.imageUrl ||
                      postCreatorImage ? (
                        <Avatar
                          src={
                            activityData.postCreatorInfo.imageUrl ??
                            postCreatorImage
                          }
                          sx={{ width: 30, height: 30 }}
                        />
                      ) : (
                        <Avatar src={""} sx={{ width: 30, height: 30 }} />
                      )}
                    </Box>
                  ) : (
                    <Avatar
                      src={activityData?.postCreatorInfo.imageUrl}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                </Stack>
              </Stack>

              {activityData?.postCreatorInfo.role === "MP" ? (
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
                          activityData.postCreatorInfo.firstName ??
                            userFirstName
                        )} ${capitalizeFirstLetter(
                          activityData.postCreatorInfo.lastName ?? userLastName
                        )}`}
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
                    mt={1}
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
                        marginLeft="8px"
                        fontWeight="600"
                        fontSize={"12px"}
                        lineHeight={1}
                        textTransform="capitalize"
                        component="span"
                        maxWidth={"200px"}
                      >
                        {`${capitalizeFirstLetter(
                          activityData?.postCreatorInfo.firstName ??
                            userFirstName
                        )} ${capitalizeFirstLetter(
                          activityData?.postCreatorInfo.lastName ?? userLastName
                        )}`}
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
          </Stack>

          <PostFollowButton
            postId={postId}
            relevantUser={relavantUSer}
            postFollowStatus={activityData?.postFollowStatus}
          />
        </FormInputWrapper>

        <Box mt={2} />

        <FormInputWrapper>
          <Stack
            direction={mobileView ? "row" : "column"}
            sx={{ width: { sm: "100%", md: "100%", lg: "80%" } }}
            spacing={2}
          >
            {postType === "GENERAL" ? (
              <Chip
                label="General"
                sx={{ background: "#CDCDFF", fontSize: "12px" }}
                size="small"
              />
            ) : (
              <Chip
                label="Proposal"
                sx={{ background: "#F6AFEE", fontSize: "12px" }}
                size="small"
              />
            )}

            <Chip
              label={getElectorateLabel(communityType)}
              sx={{ background: "#F2F2F2", fontSize: "12px" }}
              size="small"
            />

            <Chip
              label={challenge}
              sx={{ background: "#DDFEDD", fontSize: "12px" }}
              size="small"
            />
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            {title}
          </Typography>
        </FormInputWrapper>
        <Box mt={2} />
        <Divider />
        <Box mt={2} />
        <FormInputWrapper>
          <Linkify options={{ target: "_blank" }}>
            <Typography
              sx={{
                fontSize: "14px",
                textAlign: "justify",
                whiteSpace: "pre-line",
              }}
              color={{ color: `${COLORS.neutralTextBlack}` }}
            >
              {showMore
                ? description.toString()
                : `${description
                    ?.substring(0, POST_DESCRIPTION_LENGTH)
                    .toString()}`}
              <Typography
                onClick={() => setShowMore(!showMore)}
                sx={{ fontSize: "14px" }}
              >
                {renderDescriptionToggle()}
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
            {tags &&
              tags.map((tag: any) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "12px",
                    padding: "0px",
                    width: tag.length < 3 ? "35px" : "auto",
                  }}
                />
              ))}
          </Stack>
        </FormInputWrapper>
        <Box mt={1} />
      </Box>

      {images.length > 0 && (
        <ReactPictureGrid
          data={images.map((e, i) => {
            return {
              image: e,
              title: "Image " + i,
              description: title + " image " + i,
            };
          })}
          gap={2}
          showPreview={true}
          pattern={[images.length < 2 ? "wide" : "small"]}
        />
      )}

      <Box padding={2} sx={{ backgroundColor: COLORS.commentSectionColor }}>
        <Box mt={2} />

        <FormInputWrapper>
          {postType === "GENERAL" ? (
            <Stack
              direction={mobileView ? "row" : "column"}
              sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Stack alignItems="center" direction="row" mb={0.6}>
                <Image src={commentsLikes} alt="blank" />
                <Box ml={1}>
                  <Typography sx={{ color: "grey", fontSize: "12px" }}>
                    {likes}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "grey",
                  marginBottom: 0.5,
                  marginRight: 1,
                }}
              >
                {data?.length} Comments
              </Typography>
            </Stack>
          ) : (
            <Stack
              direction={mobileView ? "row" : "column"}
              sx={{ width: { sm: "100%", md: "100%", lg: "100%" } }}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "grey",
                  marginBottom: 0.5,
                  marginRight: 1,
                }}
              >
                {data?.length} Comments
              </Typography>
            </Stack>
          )}
        </FormInputWrapper>

        <Divider />
        <Box mt={1} />
        <FormInputWrapper>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {postType === "GENERAL" ? (
              <Grid item display="inline-flex">
                {activityData?.data.votedPost ? (
                  <Button
                    sx={{
                      fontSize: "12px",
                      borderRadius: "32px",
                      height: "28px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      minWidth: "80px",
                      color: COLORS.primary,
                      backgroundColor: "transparent",
                      ":hover": {
                        backgroundColor: "white",
                        color: "grey",
                      },
                      width: 35,
                      "& > *:first-child": {
                        fontSize: 40,
                        marginLeft: -2.0,
                      },
                    }}
                    // variant="outlined"
                    onClick={generalPostDislike}
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
                        style={{ width: "26px", height: "26px" }}
                      />
                    }
                  >
                    <Typography sx={{ fontSize: "14px", marginRight: -1 }}>
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
                      backgroundColor: "transparent",
                      // gap: "10px",
                      ":hover": {
                        color: COLORS.primary,
                        backgroundColor: "transparent",
                      },
                      "& > *:first-child": {
                        fontSize: "inherit",
                        marginLeft: -2.0,
                      },
                    }}
                    startIcon={
                      <CustomSvgIcon
                        width={30}
                        height={30}
                        xmlns="http://www.w3.org/2000/svg"
                        d="M15.2029 20H4.60621V7.2L11.241 0L12.1718 0.775C12.2673 0.858333 12.3389 0.975 12.3866 1.125C12.4344 1.275 12.4582 1.45833 12.4582 1.675V1.925L11.3842 7.2H18.5203C18.9021 7.2 19.2363 7.35 19.5227 7.65C19.8091 7.95 19.9523 8.3 19.9523 8.7V10.75C19.9523 10.8667 19.9642 10.9875 19.9881 11.1125C20.0119 11.2375 20 11.3583 19.9523 11.475L16.9451 18.725C16.8019 19.075 16.5672 19.375 16.241 19.625C15.9149 19.875 15.5688 20 15.2029 20ZM6.03819 18.5H15.5131L18.5203 11.025V8.7H9.61814L10.8831 2.475L6.03819 7.825V18.5ZM4.60621 7.2V8.7H1.43198V18.5H4.60621V20H0V7.2H4.60621Z"
                        style={{ width: "26px", height: "26px" }}
                      />
                    }
                    // variant="outlined"
                    onClick={generalPostLike}
                  >
                    <Typography sx={{ fontSize: "14px" }}>Like</Typography>
                  </Button>
                )}
              </Grid>
            ) : (
              <Grid item display="inline-flex">
                <Tooltip
                  title={<ProposalToolTip text="I support this proposal" />}
                  arrow
                >
                  <Stack
                    direction="row"
                    alignItems="end"
                    marginRight={2}
                    marginBottom={1}
                    // sx={{ bgcolor: "red" }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() =>
                        votePostive(
                          activityData?.data.voteType == VOTES_TYPES.POSITIVE
                        )
                      }
                    >
                      <CustomSvgIcon
                        width="21px"
                        height="21px"
                        xmlns="http://www.w3.org/2000/svg"
                        d="M16.023 20.9974H4.34946V7.55906L11.2986 0L12.1235 0.682415C12.3068 0.822398 12.4276 0.979878 12.486 1.15486C12.5443 1.32983 12.5734 1.53106 12.5734 1.75853V2.021L11.4486 7.55906H19.4976C19.8809 7.55906 20.2267 7.72092 20.535 8.04463C20.8432 8.36834 20.9974 8.73142 20.9974 9.13387V11.2861C20.9974 11.4786 20.9766 11.7017 20.9349 11.9554C20.8932 12.2091 20.8307 12.4322 20.7474 12.6247L17.8478 19.6588C17.6978 20.0263 17.452 20.3412 17.1104 20.6037C16.7688 20.8662 16.4063 20.9974 16.023 20.9974ZM2.84965 7.55906V20.9974H0V7.55906H2.84965Z"
                        // fill="#CCCCCC"
                        sx={{
                          color:
                            activityData?.data.voteType == VOTES_TYPES.POSITIVE
                              ? COLORS.primary
                              : "#CCCCCC",
                          ":hover": {
                            color: COLORS.primary,
                          },
                        }}
                      />
                    </IconButton>
                    {/* <Image src={negativeVote} alt="blank" /> */}
                    {activityData?.data.votedPost && (
                      <Typography
                        fontSize={"12px"}
                        fontWeight="bold"
                        color={
                          activityData.data.voteType == VOTES_TYPES.POSITIVE
                            ? COLORS.primary
                            : COLORS.greyIcon
                        }
                        marginLeft={0.5}
                        // marginTop={1}
                      >
                        {positiveVotesCount == 0
                          ? "0"
                          : Math.round(
                              (positiveVotesCount /
                                (positiveVotesCount + negativeVotesCount)) *
                                100
                            )}
                        %
                      </Typography>
                    )}
                  </Stack>
                </Tooltip>
                <Tooltip
                  title={<ProposalToolTip text="I reject this proposal" />}
                  arrow
                >
                  <Stack direction="row" alignItems="start" marginTop={1}>
                    <IconButton
                      size="small"
                      sx={{
                        minWidth: 0,
                        padding: 0,
                      }}
                      onClick={() =>
                        voteNegative(
                          activityData?.data.voteType == VOTES_TYPES.NEGATIVE
                        )
                      }
                    >
                      <CustomSvgIcon
                        width="120px"
                        height="120px"
                        xmlns="http://www.w3.org/2000/svg"
                        d="M4.97455 0.000164032L16.6481 0.000164032L16.6481 13.4385L9.69896 20.9976L8.87406 20.3151C8.69075 20.1752 8.56993 20.0177 8.51161 19.8427C8.45328 19.6677 8.42412 19.4665 8.42412 19.239V18.9766L9.54898 13.4385L1.49998 13.4385C1.11669 13.4385 0.770901 13.2766 0.462605 12.9529C0.15431 12.6292 0.000164032 12.2661 0.000164032 11.8637V9.71146C0.000164032 9.51898 0.0209942 9.29589 0.0626564 9.04217C0.104319 8.78845 0.166811 8.56535 0.250134 8.37288L3.14977 1.33875C3.29975 0.971292 3.54556 0.656332 3.88718 0.393866C4.22881 0.131397 4.59126 0.000164032 4.97455 0.000164032ZM18.1479 13.4385L18.1479 0.000164032H20.9976L20.9976 13.4385H18.1479Z"
                        // fill="#CCCCCC"
                        sx={{
                          color:
                            activityData?.data.voteType == VOTES_TYPES.NEGATIVE
                              ? COLORS.primary
                              : "#CCCCCC",
                          ":hover": {
                            color: COLORS.primary,
                          },
                        }}
                      />
                    </IconButton>
                    {/* <Image src={negativeVote} alt="blank" /> */}
                    {activityData?.data.votedPost && (
                      <Typography
                        fontSize={"12px"}
                        fontWeight="bold"
                        color={
                          activityData.data.voteType == VOTES_TYPES.NEGATIVE
                            ? COLORS.primary
                            : COLORS.greyIcon
                        }
                        marginLeft={0.6}
                        marginTop={-0.2}
                        // marginBottom={1}
                      >
                        {negativeVotesCount == 0
                          ? "0"
                          : Math.round(
                              (negativeVotesCount /
                                (positiveVotesCount + negativeVotesCount)) *
                                100
                            ) ?? 0}
                        %
                      </Typography>
                    )}
                  </Stack>
                </Tooltip>
              </Grid>
            )}

            <Grid item display="inline-flex">
              <Button
                sx={{
                  fontSize: "12px",
                  borderRadius: "32px",
                  height: "28px",
                  fontWeight: 400,
                  lineHeight: "18px",
                  minWidth: "80px",
                  // gap: "10px",
                  ":hover": {
                    backgroundColor: "white",
                    color: "white",
                  },
                }}
              >
                <Image src={comment} alt="blank" />
                <Typography ml={1} sx={{ fontSize: "14px", color: "#6666FF" }}>
                  Comment
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </FormInputWrapper>
        <FormInputWrapper margin={1}>
          {postType !== "GENERAL" ? (
            <Box>
              <span style={{ fontSize: "10px" }}>
                {positiveVotesCount + negativeVotesCount}
              </span>
              <span style={{ fontSize: "10px", marginLeft: "2px" }}>votes</span>
            </Box>
          ) : (
            ""
          )}
        </FormInputWrapper>
        <Box mt={1}>
          <AddComments key={postId} postId={postId} mobileView={mobileView} />
        </Box>
        <Box mt={2} />
        {showSeeMore && data && data.length > 3 && (
          <Typography
            onClick={handleSeeMore}
            sx={{
              color: COLORS.greyIcon,
              textAlign: "right",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Show more..
          </Typography>
        )}

        {displayCount > 3 && (
          <Typography
            onClick={handleSeeLess}
            sx={{
              color: COLORS.greyIcon,
              textAlign: "right",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Show less..
          </Typography>
        )}
        <div>{renderComments()}</div>
      </Box>
    </Paper>
  );
}

export { HomeFeedPost };
