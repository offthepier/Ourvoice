import { Dialog, styled } from "@mui/material";

const BasicModalDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  borderRadius: 22,
}));

export { BasicModalDialog };
