/* eslint-disable @next/next/no-css-tags */
"use client";

import { MainWrapper } from "src/components";

import React from "react";
import { SideBar } from "@/components/molecules";
import withAuth from "src/hoc/withAuth";
import { makeStyles } from "@mui/styles";
import { Box, Typography, Stack, Card } from "@mui/material";
import COLORS from "@/themes/colors";

const useStyles = makeStyles({
  root: {
    backgroundColor: 'red'
  },
  postCard: {
    padding: "1rem",
    cursor: "pointer",
    "&:hover": {
      border: "1px solid #000000"
    }
  }
});

const Review = () => {
  const styles = useStyles();
  return (
    <MainWrapper
      data-testid="post-review-wrapper"
      childrenLeft={<SideBar />}
    >
      <Box
        bgcolor="white"
        width="100%"
        border={COLORS.border}
        borderRadius="13px"
        padding="2rem"
        minHeight="300px"
      >
        <Typography variant="h5" fontWeight="600" gutterBottom>
          Review post
        </Typography>
        <Typography variant="caption" color={COLORS.greyIcon} gutterBottom>
          Select a post flagged as abusive by users
        </Typography>
        <Stack spacing={2}>
          <Card className={styles.postCard}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
            </Typography>
            <Typography variant="caption" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia at cum ex sed voluptate vero voluptatibus nulla! Voluptatibus alias amet doloremque itaque consequatur, assumenda vitae tempora asperiores facilis molestiae reprehenderit! 
            </Typography>
            <Typography variant="subtitle2" align="right" gutterBottom>
              Flagged by user1
            </Typography>
          </Card>
          <Card className={styles.postCard}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
            </Typography>
            <Typography variant="caption" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia at cum ex sed voluptate vero voluptatibus nulla! Voluptatibus alias amet doloremque itaque consequatur, assumenda vitae tempora asperiores facilis molestiae reprehenderit! 
            </Typography>
            <Typography variant="subtitle2" align="right" gutterBottom>
              Flagged by user2
            </Typography>
          </Card>
          <Card className={styles.postCard}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
            </Typography>
            <Typography variant="caption" gutterBottom>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia at cum ex sed voluptate vero voluptatibus nulla! Voluptatibus alias amet doloremque itaque consequatur, assumenda vitae tempora asperiores facilis molestiae reprehenderit! 
            </Typography>
            <Typography variant="subtitle2" align="right" gutterBottom>
              Flagged by user3
            </Typography>
          </Card>
        </Stack>
      </Box>
      
    </MainWrapper>
  );
};

export default withAuth(Review);
