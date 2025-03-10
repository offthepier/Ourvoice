import { Box, Typography } from "@mui/material";
import React from "react";

const MpUploadTooltip = () => {
  return (
    <Box margin={2}>
      <Typography fontWeight={600} fontSize="10px">
        Prepare the CSV file with email addresses:
      </Typography>
      <Typography fontWeight={400} fontSize="10px">
        The minimum requirements for the email data file are as follows,
      </Typography>
      <Box mt={2} />
      <Box>
        <li>A CSV file format</li>
        <li>A column called Email with the email addresses</li>
        <li>A column called Name with the recipient names</li>
        <li>A column called Electorate Type with the Electorate type</li>
        <li>A column called Electorate Name with the Electorate name</li>
      </Box>
    </Box>
  );
};

export { MpUploadTooltip };
