import { Container, Grid } from "@mui/material";

import HomeStyles from "@/styles/Home.module.css";
import IAuthPageWrapper from "./SurveyWrapper.interface";
import { NavBar } from "@/components/molecules";
import React from "react";

const SurveyWrapper = ({
  childrenLeft,
  children,
  childrenRight,
  showNavBar = true,
}: IAuthPageWrapper) => {
  return (
    <>
      {showNavBar && <NavBar data-testid="navbar" />}
      <Container data-testid="survey-page-wrapper" maxWidth="lg">
        <Grid
          container
          // bgcolor="grey"
          flex={1}
          height="93vh"
          spacing={0}
          direction="row"
        >
          <Grid
            item
            // bgcolor="green"
            // height="100%"
            lg={3}
            md={3}
            sm={false}
            xs={false}
            display={{ sm: "none", xs: "none", md: "flex" }}
          >
            {childrenLeft}
          </Grid>
          <Grid
            item
            // bgcolor="blue"
            md={9}
            sx={{
              overflowY: "scroll",
              maxHeight: "100vh",
              paddingLeft: { md: 4 },
              paddingY: { md: 4 },
              // paddingRight: 4,
            }}
            overflow="scroll"
            className={HomeStyles.container}
            justifyContent="center"
            justifyItems="center"
            sm={12}
            xs={12}
          >
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export { SurveyWrapper };
