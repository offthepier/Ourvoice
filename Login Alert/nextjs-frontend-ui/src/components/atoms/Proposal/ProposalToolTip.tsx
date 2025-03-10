import { Box } from "@mui/material";
import React from "react";

interface IText {
  text: string;
}

const ProposalToolTip = ({ text }: IText) => <Box>{text}</Box>;

export { ProposalToolTip };
