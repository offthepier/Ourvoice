import { Box } from "@mui/material";
import React from "react";

const PasswordStrengthTooltip = () => {
  return (
    <Box>
      <ul>
        <li>Minimum of 8 characters</li>
        <li>Contain an uppercase</li>
        <li>Contain a lowercase</li>
        <li>Contain a number (0-9)</li>
        <li>Contain a special character (!@#$%^&*)</li>
      </ul>
    </Box>
  );
};

export { PasswordStrengthTooltip };
