import {
  Box,
  Button,
  Chip,
  Divider,
  FormLabel,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FormInputWrapper, FormWrapper } from "src/components/atoms";
import InfiniteScroll from "react-infinite-scroll-component";
import COLORS from "src/themes/colors";
import IProfile from "@/types/IProfile";
import IUser from "./UserPost.interface";
import IUserProfile from "@/service/UserProfile/UserProfile.interface";
import React from "react";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "src/util/setCapital";
import { InfiniteData, useInfiniteQuery, useQuery } from "react-query";
import { useRouter } from "next/router";
import { PostContent } from "../PostContent/PostContent";
import { POST_PAGE_SIZE } from "@/constants/Pagination";
import { PostSkelton } from "../..";
import IPost from "@/types/IPost";

type PageData = {
  posts: IPost[];
  lastEvaluatedKey?: Record<string, unknown>;
};

function IndeterminateProgress() {
  return (
    <>
      <PostSkelton />
      <PostSkelton />
    </>
  );
}

// When that is finish up the scroll
export function EndMessage() {
  return (
    <Typography textAlign="center" marginTop={4} color="grey">
      No posts to display
    </Typography>
  );
}

function UserPost({ details, id }: IUser) {
  console.log(details, "___userpost___");
  const navigate = useRouter();

  const { getUser } = useAuth();

  const loggedEmail = getUser()?.email;

  const PAGE_SIZE = POST_PAGE_SIZE;
  const fetchPosts = async ({ pageParam }: { pageParam?: any }) => {
    const response = (await UserProfileService.getUserPosts(
      id,
      PAGE_SIZE,
      pageParam?.lastEvaluatedKey
    )) as PageData;

    return response;
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    `user-posts`,
    fetchPosts,
    {
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        if (lastPage.lastEvaluatedKey) {
          return {
            lastEvaluatedKey: lastPage.lastEvaluatedKey,
          };
        } else {
          return null;
        }
      },
    }
  );

  console.log(data, "camehere");

  const getDataLength = (data: InfiniteData<PageData> | undefined) => {
    let dataLength = 0;
    data?.pages.map((page: any) => (dataLength += page?.posts?.length));
    if (dataLength > 0) {
      return dataLength;
    }
    return 0;
  };

  const mobileView = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const renderInterests = (details: IProfile | undefined) => {
    if (!details?.interests || details?.interests?.length === 0) {
      return "N/A";
    } else {
      return details?.interests?.map((interest) => (
        <Chip key={interest} label={interest} variant="outlined" />
      ));
    }
  };

  return (
    <Box
      component="main"
      sx={{ height: "100%" }}
      bgcolor="white"
      width="100%"
      marginTop={4}
      borderRadius="15px"
      border={COLORS.border}
    >
      <FormWrapper
        margin={4}
        sx={{
          maxWidth: {
            sm: "70%",
            md: "100%",
            lg: "90%",
          },
        }}
      >
        <FormInputWrapper>
          <FormLabel
            sx={{
              fontSize: "21px",
              fontWeight: 600,
              textAlign: mobileView ? "-moz-initial" : "center",
            }}
          >
            {loggedEmail === details?.email ? "Public View" : "Profile"}
          </FormLabel>

          {loggedEmail === details?.email && (
            <Box textAlign="center">
              <Button
                disableElevation
                variant="contained"
                sx={{
                  background: "#6666FF",
                  borderColor: "#999999",
                  fontSize: "16px",
                  width: "156px",
                  fontWeight: 600,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#6666FF",
                    color: "white",
                  },
                  marginTop: mobileView ? 0 : 2,
                }}
                onClick={() => navigate.push("/profile/private")}
              >
                Edit Profile
              </Button>
            </Box>
          )}
        </FormInputWrapper>
        <Box mt={3} />
        <FormInputWrapper>
          <FormLabel>Name</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "80%", md: "100%", lg: "80%" } }}
          >
            <Typography variant="subtitle1" textTransform="capitalize">
              {`${capitalizeFirstLetter(
                details?.firstName
              )} ${capitalizeFirstLetter(details?.lastName)}`}
            </Typography>
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>About me</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "80%", md: "100%", lg: "80%" } }}
          >
            <Typography variant="subtitle1">
              {details?.intro ? details?.intro : "N/A"}
            </Typography>
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>Country</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "80%", md: "100%", lg: "80%" } }}
          >
            <Typography variant="subtitle1">
              {details?.geoLocation?.country}
            </Typography>
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>Gender</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: { sm: "80%", md: "100%", lg: "80%" } }}
          >
            <Typography variant="subtitle1">
              {details?.gender ? details.gender : "N/A"}
            </Typography>
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>Interests</FormLabel>
          <Stack
            direction="row"
            sx={{ width: { sm: "80%", md: "100%", lg: "80%" } }}
            spacing={1}
          >
            {renderInterests(details)}
          </Stack>
        </FormInputWrapper>
        <Box mt={2} />
        <FormInputWrapper>
          <FormLabel>Latest Posts</FormLabel>
        </FormInputWrapper>
        <Box mt={2} />
        <Divider />
        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              animation="wave"
              height={"100vh"}
              sx={{ marginY: 1, borderRadius: 4 }}
            />
          </>
        ) : (
          <InfiniteScroll
            hasMore={hasNextPage || false}
            next={fetchNextPage}
            dataLength={getDataLength(data)}
            loader={<IndeterminateProgress />}
            endMessage={<EndMessage />}
          >
            {data &&
              data?.pages?.map((newsFeed) =>
                newsFeed?.posts?.map((post: any, index: any) => (
                  <PostContent key={`${post?.postId}`} post={post} />
                ))
              )}
          </InfiniteScroll>
        )}
      </FormWrapper>
    </Box>
  );
}

export { UserPost };
