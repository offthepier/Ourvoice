import { Box } from "@mui/material";
import React from "react";

const FileUploadTooltip = () => {
  return (
    <Box ml={1}>
      <li>Valid File Types JPG, PNG</li>
      <li>Max File Size 5MB</li>
      <li>Max File Count 5</li>
    </Box>
  );
};

export { FileUploadTooltip };
