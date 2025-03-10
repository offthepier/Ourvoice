import { styled, TextField } from "@mui/material";

const EdgeTextField = styled(TextField)({
  '& input[type="password"]::-ms-reveal': {
    display: "none",
  },
  '& input[type="password"]::-ms-clear': {
    display: "none",
  },
});

export { EdgeTextField };
