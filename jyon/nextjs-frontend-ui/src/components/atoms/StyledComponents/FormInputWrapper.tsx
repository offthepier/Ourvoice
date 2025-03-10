import { Stack, styled } from "@mui/material";

const FormInputWrapper = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  [theme.breakpoints.only("sm")]: {
    flexDirection: "row",
    alignItems: "center",
  },
  [theme.breakpoints.only("md")]: {
    flexDirection: "column",
    alignItems: "normal",
  },
  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
    alignItems: "center",
  },
})) as typeof Stack;

export { FormInputWrapper };
