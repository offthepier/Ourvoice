import { Container, Grid } from "@mui/material";

import IProfilePageWrapper from "./ProfileWrappr.interface";
import { NavBar } from "@/components/molecules";
import React from "react";

const ProfileWrapper = ({
  childrenLeft,
  childrenRight,
  showNavBar = true,
}: IProfilePageWrapper) => {
  return (
    <>
      {showNavBar && <NavBar data-testid="navbar" />}
      <Container data-testid="profile-page-wrapper" maxWidth="lg">
        <Grid container height="100%" spacing={2} direction="row">
          <Grid
            md={3}
            item
            // bgcolor="blue"
            sm={false}
            xs={false}
            display={{ sm: "none", xs: "none", md: "flex" }}
          >
            {childrenLeft}
          </Grid>

          <Grid
            item
            // bgcolor="green"
            md={9}
            justifyContent="center"
            justifyItems="center"
            sm={12}
            xs={12}
          >
            {childrenRight}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export { ProfileWrapper };
