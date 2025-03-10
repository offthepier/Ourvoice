/* eslint-disable @next/next/no-css-tags */
import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/context/AuthContext";
import { CommunityContext } from "@/context/CommunityContext";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import IPost from "@/types/IPost";
import { Box, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Head from "next/head";
import React, { useContext } from "react";
import { InfiniteData, useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  StartProposalField,
  SurveyToolbarMP,
  SurveyToolbar,
  HomeFeedPost,
  PostSkelton,
} from "../..";

import { NEWS_FEED_PAGE_SIZE } from "@/constants/Pagination";

const useStyles = makeStyles({
  root: {
    [`& fieldset`]: {
      borderRadius: "48px",
    },
    height: "48px",
  },
});

type PageData = {
  posts: IPost[];
  lastEvaluatedKey?: Record<string, unknown>;
  lastEvaluatedType?: string;
};

// loading animation
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

function HomeMiddlePage() {
  const { activeCommunity } = useContext(CommunityContext);

  console.log(activeCommunity, "homeMiddlePage");
  const { getUser } = useAuth();

  //pagination
  const PAGE_SIZE = NEWS_FEED_PAGE_SIZE;
  const fetchPosts = async ({ pageParam }: { pageParam?: any }) => {
    const response = (await NewsFeedService.getNewsFeedPosts(
      activeCommunity,
      PAGE_SIZE,
      pageParam?.lastEvaluatedKey,
      pageParam?.lastEvaluatedType
    )) as PageData;

    return response;
  };

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    `newsFeed ${activeCommunity}`,
    fetchPosts,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.lastEvaluatedKey) {
          return {
            lastEvaluatedKey: lastPage.lastEvaluatedKey,
            lastEvaluatedType: lastPage.lastEvaluatedType,
          };
        } else {
          return null;
        }
      },
      select: (data) => {
        // Modify the data before returning it
        const modifiedData = {
          pageParams: data.pageParams,
          pages: data ? replaceDuplicatePosts(data?.pages) : undefined,
        };

        return modifiedData as any;
      },
      cacheTime: 0,
    }
  );

  function replaceDuplicatePosts(pages: any[]): any[] {
    const postMap = new Map<string, any>();

    // Iterate over the pages and posts, and store the posts in a map with postId as the key
    for (const page of pages) {
      for (const post of page.posts) {
        postMap.set(post.postId, post);
      }
    }

    // Reconstruct the pages with the unique posts
    const uniquePages = pages.map((page) => ({
      ...page,
      posts: page.posts.filter((post: any) => {
        const isDuplicate = postMap.has(post.postId);

        // Remove the post from the map once it has been encountered
        if (isDuplicate) {
          postMap.delete(post.postId);
          console.log("Duplicate Found ", post);
        }

        return isDuplicate;
      }),
    }));

    return uniquePages;
  }

  const getDataLength = (data: InfiniteData<PageData> | undefined) => {
    let dataLength = 0;
    data?.pages.map((page) => (dataLength += page?.posts?.length));
    if (dataLength > 0) {
      return dataLength;
    }
    return 0;
  };

  return (
    <Box width="100%" borderRadius={"16px"} component="form">
      <Head>
        <title>Home Page</title>
      </Head>

      <StartProposalField />

      <Stack direction="row" justifyContent="space-between" marginTop={1}>
        {getUser()?.role == USER_ROLES.MP ||
        getUser()?.role == USER_ROLES.ADMIN ? (
          <SurveyToolbarMP selected="none" />
        ) : (
          <SurveyToolbar selected="none" />
        )}
      </Stack>

      {isLoading ? (
        <>
          <PostSkelton />
          <PostSkelton />
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
                <HomeFeedPost key={`${post?.postId}`} post={post} />
              ))
            )}
        </InfiniteScroll>
      )}
    </Box>
  );
}

export default HomeMiddlePage;
