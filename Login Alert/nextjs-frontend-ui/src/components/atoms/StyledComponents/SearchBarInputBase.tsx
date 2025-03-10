import { InputBase, styled } from "@mui/material";

const SearchBarInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  marginTop: 4,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    maxWidth: "650px",
  },
}));

export { SearchBarInputBase };
