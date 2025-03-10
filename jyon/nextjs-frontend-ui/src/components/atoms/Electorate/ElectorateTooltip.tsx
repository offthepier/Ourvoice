import { Box } from "@mui/material";
import React from "react";

interface IText {
  text: string;
}

const ElectorateTooltip = ({ text }: IText) => <Box>{text}</Box>;

export { ElectorateTooltip };
