/* eslint-disable @next/next/no-css-tags */
"use client";

import { Box, Stack, Menu, MenuItem, IconButton, Icon, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from "@mui/material";
import { ChallengesView, HomeFeedPost, MainWrapper } from "../../components";
import {
  PostSkelton,
  StartProposalField,
  SurveyToolbar,
  SurveyToolbarMP,
  TopProposals,
} from "@/components/atoms";

import Head from "next/head";
import IPostFull from "@/types/IPostFull";
import NewsFeedService from "@/service/NewsFeed/NewsFeedService";
import React, { useState } from "react";
import { SideBar } from "@/components/molecules";
import { USER_ROLES } from "@/constants/UserRoles";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import withAuth from "src/hoc/withAuth";

const PostView = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, data } = useQuery<IPostFull, Error>(
      ["post" + decodeURIComponent(id as string), id],
      async () => {
        return await NewsFeedService.getPostById(decodeURIComponent(id as string));
      },
      {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err: any) => {
          console.log(err);
        },
        enabled: id !== undefined,
      }
  );

  const { getUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // State for managing the dialogs
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
    setOpenBlockDialog(true); // Open the second dialog
  };

  const handleBlockUser = (block: boolean) => {
    if (block) {
      setHidePost(true);
    }
    setOpenBlockDialog(false);
  };

  const handleReportPost = () => {
    setOpenReportDialog(true);
    handleCloseMenu();
  };

  const [hidePost, setHidePost] = useState(false);

  return (
      <MainWrapper
          childrenRight={
            <Stack>
              <ChallengesView />{" "}
              <TopProposals selectedId={decodeURIComponent(id as string)} />
            </Stack>
          }
          childrenLeft={<SideBar />}
      >
        <Box width="100%" borderRadius={"16px"} component="form">
          <Head>
            <title>View Post</title>
          </Head>

          <StartProposalField />

          <Stack direction="row" justifyContent="space-between" marginTop={1}>
            {getUser()?.role === USER_ROLES.MP ||
            getUser()?.role === USER_ROLES.ADMIN ? (
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
          ) : !hidePost && (
              <Box position="relative">
                <HomeFeedPost key={data.post.postId} post={data.post} />
                <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={handleOpenMenu}
                >
                  <Icon>more_vert</Icon>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                >
                  <MenuItem onClick={handleReportPost}>Report</MenuItem>
                </Menu>

                <Dialog
                    open={openReportDialog}
                    onClose={handleCloseReportDialog}
                    aria-labelledby="report-dialog-title"
                    aria-describedby="report-dialog-description"
                >
                  <DialogTitle id="report-dialog-title">{"Reported!"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="report-dialog-description">
                      Thank you for your report, the post has been sent to the Admin for reviewing.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseReportDialog} color="primary" autoFocus>
                      Next
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                    open={openBlockDialog}
                    onClose={() => setOpenBlockDialog(false)}
                    aria-labelledby="block-dialog-title"
                    aria-describedby="block-dialog-description"
                >
                  <DialogTitle id="block-dialog-title">{"Block User"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="block-dialog-description">
                      Would you like to block this user?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleBlockUser(false)} color="primary">
                      No
                    </Button>
                    <Button onClick={() => handleBlockUser(true)} color="primary">
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
          )}
        </Box>
      </MainWrapper>
  );
};

export default withAuth(PostView);
