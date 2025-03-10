import { Box, Divider } from "@mui/material";
import {
  HouseOutlined,
  ManageAccountsOutlined,
  PeopleOutlineRounded,
  PersonPinCircleOutlined,
} from "@mui/icons-material";
import React, { useContext, useEffect } from "react";
import { SideBarItem, SideBarWrapper } from "../../atoms";

import COLORS from "@/themes/colors";
import { CommunityContext } from "@/context/CommunityContext";
import IAuthPageWrapper from "./SideBar.interface";
import Link from "next/link";
import { Stack } from "@mui/system";
import { USER_ROLES } from "@/constants/UserRoles";
import { makeStyles } from "@mui/styles";
import { useAuth } from "@/context/AuthContext";

const useStyles = makeStyles({
  active: {
    backgroundColor: "#CDCDFF",
  },
});
const SideBar = ({ title, disabled, disableCommunities }: IAuthPageWrapper) => {
  const {
    activeCommunity,
    setActiveCommunity,
    setIsChallengeOrProposalSelected,
    isChallengeOrProposalSelected,
  } = useContext(CommunityContext);

  const handleClick = (selectedCommunity: string) => {
    setActiveCommunity(selectedCommunity);
    setIsChallengeOrProposalSelected(false);

    localStorage.setItem("selectedCommunity", selectedCommunity);
    localStorage.setItem("isChallengeOrProposalSelected", "false");
  };

  useEffect(() => {
    const storedSelection = localStorage.getItem("selectedCommunity");
    const storedChallengeSelection = localStorage.getItem(
      "isChallengeOrProposalSelected"
    );

    if (storedSelection) {
      setActiveCommunity(storedSelection);
    } else {
      setActiveCommunity("ALL");
    }

    if (storedChallengeSelection) {
      setIsChallengeOrProposalSelected(storedChallengeSelection === "true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getUser } = useAuth();
  let adminRole = getUser()?.role === USER_ROLES.ADMIN;

  console.log(activeCommunity);

  return (
    <>
      <Box
        bgcolor="white"
        width="100%"
        height={adminRole ? "290px" : "252px"}
        border={COLORS.border}
        marginTop={4}
        sx={
          disabled
            ? {
                opacity: 0.5,
                pointerEvents: "none",
              }
            : {}
        }
        borderRadius="13px"
      >
        <Link href={"/"} key="1" style={{ textDecoration: "none" }}>
          <SideBarItem
            key="1"
            keyId="1"
            icon={<HouseOutlined sx={{ color: COLORS.greyIcon }} />}
            text="Home"
            onClick={() => handleClick("ALL")}
            selectedItem={false}
          />
        </Link>
        <Divider sx={{ color: COLORS.greyIcon }} />
        <Stack sx={disableCommunities ? { opacity: 0.4 } : {}}>
          <SideBarItem
            key="2"
            keyId="2"
            icon={<PeopleOutlineRounded sx={{ color: COLORS.greyIcon }} />}
            text="Community"
          />
          <SideBarWrapper
            selectedItem={activeCommunity === "ALL"}
            lastIndex={3}
          >
            <Divider sx={{ color: COLORS.greyIcon }} />
            <Link href={"/"} key="4" style={{ textDecoration: "none" }}>
              <SideBarItem
                key="3"
                keyId="3"
                onClick={() => handleClick("ALL")}
                icon={
                  <PersonPinCircleOutlined
                    sx={{
                      color:
                        activeCommunity === "ALL" &&
                        !isChallengeOrProposalSelected
                          ? "black"
                          : COLORS.greyIcon,
                    }}
                  />
                }
                text="All Communities"
                nested={true}
                selectedItem={activeCommunity === "ALL"}
              />
            </Link>
          </SideBarWrapper>
          <SideBarWrapper
            selectedItem={activeCommunity === "FEDERAL"}
            lastIndex={4}
          >
            <Divider sx={{ color: COLORS.greyIcon }} />
            <Link href={"/"} key="4" style={{ textDecoration: "none" }}>
              <SideBarItem
                key="4"
                keyId="4"
                onClick={() => handleClick("FEDERAL")}
                icon={
                  <PersonPinCircleOutlined
                    sx={{
                      color:
                        activeCommunity === "FEDERAL" &&
                        !isChallengeOrProposalSelected
                          ? "black"
                          : COLORS.greyIcon,
                    }}
                  />
                }
                text="Federal Electorate"
                nested={true}
                selectedItem={activeCommunity === "FEDERAL"}
              />
            </Link>
          </SideBarWrapper>

          <SideBarWrapper
            selectedItem={activeCommunity === "STATE"}
            lastIndex={5}
          >
            <Divider sx={{ color: COLORS.greyIcon }} />
            <Link href={"/"} key="5" style={{ textDecoration: "none" }}>
              <SideBarItem
                key="5"
                keyId="5"
                onClick={() => handleClick("STATE")}
                icon={
                  <PersonPinCircleOutlined
                    sx={{
                      color:
                        activeCommunity === "STATE" &&
                        !isChallengeOrProposalSelected
                          ? "black"
                          : COLORS.greyIcon,
                    }}
                  />
                }
                text="State Electorate"
                nested={true}
                selectedItem={activeCommunity === "STATE"}
              />
            </Link>
          </SideBarWrapper>
          <SideBarWrapper
            selectedItem={activeCommunity === "LOCAL"}
            lastIndex={6}
            role={adminRole ? "admin" : ""}
          >
            <Divider sx={{ color: COLORS.greyIcon }} />
            <Link href={"/"} key="6" style={{ textDecoration: "none" }}>
              <SideBarItem
                key="6"
                keyId="6"
                onClick={() => handleClick("LOCAL")}
                icon={
                  <PersonPinCircleOutlined
                    sx={{
                      color:
                        activeCommunity === "LOCAL" &&
                        !isChallengeOrProposalSelected
                          ? "black"
                          : COLORS.greyIcon,
                    }}
                  />
                }
                text="Local Electorate"
                nested={true}
                showDivider={false}
                selectedItem={activeCommunity === "LOCAL"}
              />
            </Link>
          </SideBarWrapper>
        </Stack>
        {adminRole ? (
          <Link href={"/admin"} key="7" style={{ textDecoration: "none" }}>
            <Divider sx={{ color: COLORS.greyIcon }} />
            <SideBarItem
              key="7"
              keyId="7"
              icon={<ManageAccountsOutlined sx={{ color: COLORS.greyIcon }} />}
              text="Admin Tasks"
            />
          </Link>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export { SideBar };
