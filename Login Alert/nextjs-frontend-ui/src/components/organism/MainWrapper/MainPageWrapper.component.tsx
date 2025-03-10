import { Container, Grid, Stack } from "@mui/material";

import HomeStyles from "@/styles/Home.module.css";
import IAuthPageWrapper from "./MainPageWrapper.interface";
import { NavBar } from "@/components/molecules";
import React from "react";

const MainWrapper = ({
  childrenLeft,
  children,
  childrenRight,
  showNavBar = true,
}: IAuthPageWrapper) => {
  return (
    <>
      {showNavBar && <NavBar data-testid="navbar" />}
      <Container data-testid="main-page-wrapper" maxWidth="lg">
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
            md={childrenRight ? 6 : 9}
            sx={{
              overflowY: "scroll",
              maxHeight: "100vh",
              padding: { sm: childrenRight ? 4 : 0 },
              paddingTop: { sm: 4, xs: 4 },
              paddingLeft: { sm: 4 },
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
          <Grid
            item
            md={3}
            sm={false}
            xs={false}
            display={{ sm: "none", xs: "none", md: "flex" }}
          >
            <Stack width={"100%"}>{childrenRight}</Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export { MainWrapper };
