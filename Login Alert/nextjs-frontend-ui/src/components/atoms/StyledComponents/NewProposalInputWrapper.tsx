import { Stack, styled } from "@mui/material";

const NewProposalInputWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  marginTop: 20,
})) as typeof Stack;

export { NewProposalInputWrapper };
