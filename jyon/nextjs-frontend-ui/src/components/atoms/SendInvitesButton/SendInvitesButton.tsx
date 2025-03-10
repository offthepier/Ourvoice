import { Button } from "@mui/material";
import React from "react";
import { CustomSvgIcon } from "../SvgIcon/CustomSvgIcon";
import ISendInvitesButton from "./SendInvitesButton.interface";

const SendInvitesButton = ({ onClick }: ISendInvitesButton) => {
  return (
    <Button
      variant="outlined"
      sx={{
        background: "#999999",
        borderColor: "#999999",
        fontSize: "16px",
        width: "160px",
        height: "44px",
        fontWeight: 400,
        color: "white",
        "&:hover": {
          backgroundColor: "#6666FF",
          color: "white",
        },
      }}
      endIcon={
        <CustomSvgIcon
          width={18}
          height={15}
          xmlns="http://www.w3.org/2000/svg"
          d="M0.26123 14.8327V9.2181L7.18206 7.49935L0.26123 5.73477V0.166016L17.6779 7.49935L0.26123 14.8327Z"
          fill="white"
          sx={{ marginTop: 1 }}
        />
      }
      onClick={onClick}
    >
      Send
    </Button>
  );
};

export { SendInvitesButton };
