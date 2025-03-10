import COLORS from "@/themes/colors";
import { Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import ISideBarItem from "./SideBarItem.interface";
import { CommunityContext } from "@/context/CommunityContext";

const SideBarItem = ({
  keyId,
  onClick,
  selectedItem,
  icon,
  nested,
  text,
}: ISideBarItem) => {
  const { setIsChallengeOrProposalSelected, isChallengeOrProposalSelected } =
    useContext(CommunityContext);
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        margin={1}
        marginTop={1}
        marginLeft={nested ? 4 : 2}
        onClick={() => {
          onClick?.(keyId);
          if (isChallengeOrProposalSelected) {
            setIsChallengeOrProposalSelected(false);
          }
        }}
        key={keyId}
      >
        {icon}
        <Typography
          sx={{
            color:
              selectedItem && !isChallengeOrProposalSelected
                ? "black"
                : COLORS.greyIcon, // Updated this line,
            fontWeight: "bold",
            fontSize: "14px",
          }}
          marginLeft={1}
        >
          {text}
        </Typography>
      </Stack>
    </>
  );
};

export { SideBarItem };
