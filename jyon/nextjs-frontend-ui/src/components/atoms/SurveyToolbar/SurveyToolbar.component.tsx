import { completedSurvey, newSurvey } from "@/assets/index";
import COLORS from "@/themes/colors";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import ISurveyToolbar from "./SurveyToolbar.interface";
import { CommunityContext } from "@/context/CommunityContext";
const SurveyToolbar = ({ selected }: ISurveyToolbar) => {
  const { setActiveCommunity, setIsChallengeOrProposalSelected } =
    useContext(CommunityContext);

  const handleClick = () => {
    setActiveCommunity("");
    setIsChallengeOrProposalSelected(true);

    // Save to local storage
    localStorage.setItem("selectedCommunity", "");
    localStorage.setItem("isChallengeOrProposalSelected", "");
  };
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        gap={1}
        alignItems="center"
      >
        <Link
          href="/survey"
          style={{ textDecoration: "none" }}
          onClick={handleClick}
        >
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            padding={"12px"}
            borderRadius={"25px"}
            bgcolor={
              selected == "pending" ? COLORS.searchBarBackground : "transparent"
            }
            sx={{
              cursor: "pointer",
              ":hover": {
                bgcolor: COLORS.searchBarBackground,
              },
            }}
          >
            <Image src={completedSurvey} alt="newSurvey" />
            <Typography
              color={selected != "pending" ? "gray" : "black"}
              fontWeight={600}
              fontSize={14}
            >
              Pending Surveys
            </Typography>
          </Stack>
        </Link>

        <Link
          href="/survey/completed"
          style={{ textDecoration: "none" }}
          onClick={handleClick}
        >
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            padding={"12px"}
            borderRadius={"25px"}
            bgcolor={
              selected == "viewSurveys"
                ? COLORS.searchBarBackground
                : "transparent"
            }
            sx={{
              cursor: "pointer",
              ":hover": {
                bgcolor: COLORS.searchBarBackground,
              },
            }}
          >
            <Image src={newSurvey} alt="viewSurveys" />
            <Typography
              color={selected != "viewSurveys" ? "gray" : "black"}
              fontWeight={600}
              fontSize={14}
            >
              Completed Surveys
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </>
  );
};

export { SurveyToolbar };
