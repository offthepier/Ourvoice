import { PasswordStrengthTooltip } from "@/components/atoms";
import { InfoRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import IPasswordTooltip from "./PasswordTooltip.interface";

const PasswordTooltip = ({ isError }: IPasswordTooltip) => {
  return (
    <Tooltip
      title={<PasswordStrengthTooltip />}
      sx={{
        marginBottom: {
          lg: isError ? "24px" : 0,
        },
      }}
    >
      <IconButton>
        <InfoRounded
          fontSize="small"
          sx={{ color: "#231F20", fontSize: "1rem" }}
        />
      </IconButton>
    </Tooltip>
  );
};

export { PasswordTooltip };
