import * as React from "react";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { Avatar, Container, MenuList, Stack, Typography } from "@mui/material";
import { Logo, downArrow } from "@/assets/index";
import { NotificationMenu, SearchMenu } from "..";
import {
  SearchBarInputBase,
  SearchBarMain,
  SearchIconWrapper,
} from "@/components/atoms";
import { useContext, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import COLORS from "@/themes/colors";
import Divider from "@mui/material/Divider";
import ICognitoProfile from "@/types/ICognitoProfile";
import IPost from "@/components/atoms/TopProposals/Proposals.interface";
import IUser from "@/types/IUser";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import Link from "next/link";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationsOutlined } from "@mui/icons-material";
import PersonAdd from "@mui/icons-material/Person2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import SearchService from "@/service/Search/SearchService";
import Toolbar from "@mui/material/Toolbar";
import UserProfileService from "@/service/UserProfile/UserProfile.service";
import { styled } from "@mui/material/styles";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "src/util/setCapital";
import { CommunityContext } from "@/context/CommunityContext";

const NavBar = () => {
  const { getUser } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { logout } = useContext(AuthContext);
  const loggedEmail = getUser()?.email;

  // console.log(profilePic);
  //Notification Menu
  const [anchorElNotification, setAnchorElNotification] =
    useState<null | HTMLElement>(null);

  //Search Menu
  const [anchorElSearch, setAnchorElSearch] = useState<null | HTMLElement>(
    null
  );

  const {
    activeCommunity,
    setActiveCommunity,
    setIsChallengeOrProposalSelected,
    isChallengeOrProposalSelected,
  } = useContext(CommunityContext);
  const openNotification = Boolean(anchorElNotification);
  const openSearch = Boolean(anchorElSearch);

  const [searchText, setSearchText] = React.useState("");
  const debouncedFilter = useDebounce(searchText, 500);

  const { isLoading: searchLoading, data: searchData } = useQuery<
    { userResults: IUser[]; postResults: IPost[] },
    Error
  >(
    ["searchResults", debouncedFilter],
    async () => {
      return await SearchService.searchByText(debouncedFilter);
    },
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err: any) => {
        console.log(err);
      },
      enabled: debouncedFilter?.trim().length > 0,
    }
  );

  const { data } = useQuery<ICognitoProfile, Error>(
    "followers-count",
    async () => {
      return await UserProfileService.getUserProfileDetails();
    }
  );

  const firstName = data?.firstName;
  const lastName = data?.lastName;
  const profilePic = data?.imageUrl;

  //handle notifications menu
  const handleOpenNotification = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  //handle search menu
  const handleOpenSearch = (event: any) => {
    setAnchorElSearch(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  //handle profile menu
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfilePage = () => {
    setAnchorEl(null);
    navigate.push("/profile/private");
    handleMobileMenuClose();
  };

  const handleNotifications = () => {
    setAnchorEl(null);
    navigate.push("/notifications");
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate.push("/");
    logout();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClick = (selectedCommunity: string) => {
    setActiveCommunity(selectedCommunity);
    setIsChallengeOrProposalSelected(false);

    localStorage.setItem("selectedCommunity", selectedCommunity);
    localStorage.setItem("isChallengeOrProposalSelected", "false");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuList>
        {firstName ? (
          <>
            <MenuItem sx={{ marginBottom: -1 }}>
              {
                <Typography textTransform="capitalize">
                  {`${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
                    lastName
                  )}`}
                </Typography>
              }
            </MenuItem>
            <MenuItem sx={{ fontSize: "12px" }}>{loggedEmail}</MenuItem>{" "}
            <Divider />
          </>
        ) : (
          ""
        )}

        <MenuItem onClick={handleProfilePage}>
          <ListItemIcon>
            <PersonAdd fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Profile
        </MenuItem>
        {/* <MenuItem onClick={handleProfilePage}>Profile</MenuItem> */}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "black" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
        {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
      </MenuList>
    </Menu>
  );

  const setNewNotificationsCount = (count: number) => {
    setNotificationCount(count);
  };

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 13,
    height: 13,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotifications}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge
            badgeContent={notificationCount}
            sx={{ color: COLORS.accentColor }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="Travis Howard" src={profilePic} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box bgcolor="white">
      <Box sx={{ flexGrow: 1 }} maxWidth="lg" marginX="auto">
        <AppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar style={{ paddingRight: 0, paddingLeft: 0 }}>
              <Stack
                direction="row"
                flexGrow={1}
                justifyContent="space-between"
                // sx={{ backgroundColor: "blue" }}
              >
                <Link href={"/"}>
                  <Image
                    src={Logo || "Logo"}
                    alt={"Logo Text"}
                    height={46}
                    onClick={() => handleClick("ALL")}
                  />
                </Link>

                <SearchBarMain>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <SearchBarInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    fullWidth
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      handleOpenSearch(e);
                    }}
                    value={searchText}
                    onClick={() => {}}
                  />
                </SearchBarMain>
                <Box
                  sx={{ display: { xs: "none", md: "flex" }, width: "176px" }}
                  alignContent="flex-end"
                >
                  <Box flexGrow={1} />
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    sx={{
                      color: COLORS.accentColor,
                      // backgroundColor: "red",
                      marginRight: 2,
                      // padding: 0,
                    }}
                    onClick={handleOpenNotification}
                  >
                    {notificationCount != 0 ? (
                      <Badge
                        badgeContent={
                          notificationCount > 9 ? "9+" : notificationCount
                        }
                        sx={{
                          "& .MuiBadge-badge": {
                            color: "white",
                            backgroundColor: COLORS.accentColor,
                          },
                        }}
                      >
                        <NotificationsOutlined sx={{ fontSize: 24 }} />
                      </Badge>
                    ) : (
                      <NotificationsOutlined sx={{ fontSize: 26 }} />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    edge="end"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <SmallAvatar alt="Remy Sharp">
                          <Image
                            src={downArrow}
                            alt={"Logo Text"}
                            height={20}
                            width={20}
                          />
                        </SmallAvatar>
                      }
                    >
                      <Avatar alt="Travis Howard" src={profilePic}>
                        {/* <Image
                         
                          alt={"Logo Text"}
                          height={44}
                          width={44}
                        /> */}
                      </Avatar>
                    </Badge>
                    {/* <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar alt="fullname">
                        <Image
                          src={ProfileImage}
                          alt={"Logo Text"}
                          height={44}
                          width={44}
                        />
                      </Avatar>
                    </StyledBadge> */}
                    {/* <Image
                      src={ProfileImage}
                      alt={"Logo Text"}
                      height={44}
                      width={44}
                    /> */}
                  </IconButton>
                </Box>
              </Stack>

              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <NotificationMenu
        anchorEl={anchorElNotification}
        open={openNotification}
        onClose={handleCloseNotification}
        onNotificationCountUpdate={setNewNotificationsCount}
      />

      <SearchMenu
        anchorEl={anchorElSearch}
        open={openSearch}
        onClose={handleCloseSearch}
        searchResults={searchData}
        loadingResults={searchLoading}
      />
    </Box>
  );
};

export { NavBar };
