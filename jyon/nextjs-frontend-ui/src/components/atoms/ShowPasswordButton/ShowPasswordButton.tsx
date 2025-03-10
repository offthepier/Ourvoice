import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import React from "react";
import IShowPasswordButton from "./ShowPasswordButton.interface";

const ShowPasswordButton = ({ onClick, visibility }: IShowPasswordButton) => {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={onClick}
        sx={{ color: "#CCCCCC" }}
      >
        {visibility ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
};

export { ShowPasswordButton };
