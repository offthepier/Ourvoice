import { styled } from "@mui/material";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: 4,
  position: "absolute",
  top: 0,
  bottom: 0,
  marginLeft: 12,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export { SearchIconWrapper };
