import { Box, styled } from "@mui/material";

const FormWrapper = styled(Box)(({ theme }) => ({
  justifyItems: "center",
  maxWidth: 640,
  [theme.breakpoints.only("xs")]: {
    padding: 30,
    marginTop: 20,
  },
  [theme.breakpoints.only("sm")]: {
    padding: 8,
    marginTop: 20,
  },
  [theme.breakpoints.up("md")]: {
    padding: 20,
  },
})) as typeof Box;

export { FormWrapper };
