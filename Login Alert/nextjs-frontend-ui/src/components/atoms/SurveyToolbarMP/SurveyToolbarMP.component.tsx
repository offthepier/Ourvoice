import { completedSurvey, newSurvey } from "@/assets/index";
import COLORS from "@/themes/colors";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import ISurveyToolbar from "./SurveyToolbarMP.interface";
import { CommunityContext } from "@/context/CommunityContext";

const SurveyToolbarMP = ({ selected }: ISurveyToolbar) => {
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
          href="/survey/create"
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
              selected == "newSurvey"
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
            <Image src={completedSurvey} alt="newSurvey" />
            <Typography
              color={selected != "newSurvey" ? "gray" : "black"}
              fontWeight={600}
              fontSize={14}
            >
              New Survey
            </Typography>
          </Stack>
        </Link>

        <Link
          href="/survey/published"
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
              Published Surveys
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </>
  );
};

export { SurveyToolbarMP };
