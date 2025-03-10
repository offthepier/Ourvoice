import COLORS from "@/themes/colors";
import { styled } from "@mui/material";

const SearchBarMain = styled("div")(({ theme }) => ({
  borderRadius: 22,
  backgroundColor: COLORS.searchBarBackground,
  marginRight: theme.spacing(2),
  maxWidth: "500px",
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    margin: "auto",
    width: "100%",
    // flexGrow: 1,
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export { SearchBarMain };
