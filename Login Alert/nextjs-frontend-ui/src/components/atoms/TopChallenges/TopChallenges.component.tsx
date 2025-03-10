import { Box, Typography, Stack, Button } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import ChallengesService from "@/service/Challenges/Challenges.service";
import { useQuery } from "react-query";
import IChallenge from "@/types/IChallenge";

const useStyles = makeStyles({
  top: {
    backgroundColor: "white",
  },

  folowText: {
    color: "#6666FF",
    borderRadius: "32px",
    backgroundColor: "white",
    borderColor: "#6666FF",
    fontSize: 12,
    width: 80,
    textTransform: "none",
  },

  unFollowText: {
    color: "white",
    backgroundColor: "#6666FF",
    borderRadius: "32px",
    width: 80,
    fontSize: 12,
    textTransform: "none",
  },
});

const TopChallenges = () => {
  const classes = useStyles();
  const { data } = useQuery<IChallenge[], Error>(
    "topchallenges",
    async () => {
      return await ChallengesService.getTopChallenges();
    },
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err: any) => {
        console.log(err);
      },
    }
  );

  return (
    <Box
      data-testid="top-challenges"
      className={classes.top}
      sx={{
        borderRadius: 2,
        marginTop: 4,
        padding: 2,
        backgroundColor: "white",
      }}
    >
      <Typography fontWeight="bold">Trending Topics</Typography>
      <Box mt={2} />
      {data &&
        data?.map((challenge) => (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="space-between"
            key={challenge.challengeID}
            style={{ marginTop: 2 }}
          >
            <Typography sx={{ fontSize: 12, color: "#999999", marginTop: 1 }}>
              {challenge.title}
            </Typography>
            <Button
              sx={{ fontSize: 12, borderRadius: "15px" }}
              variant="outlined"
            >
              Follow
            </Button>
          </Stack>
        ))}
    </Box>
  );
};

export { TopChallenges };
