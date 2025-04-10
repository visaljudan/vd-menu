import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../app/user/userSlice";
import { toast } from "react-toastify";

const Logo = styled("img")(({ theme }) => ({
  height: "2rem",
  marginRight: theme.spacing(2),
}));

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is mobile

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleSignOut = () => {
    dispatch(signOutStart());
    setLoading(true);
    try {
      dispatch(signOutSuccess());
      Navigate("/signin");
      toast.success("Signout successful!");
    } catch (error) {
      setLoading(false);
      dispatch(signOutFailure());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo
            src="https://i.pinimg.com/736x/12/83/16/1283166bf58b7a77574a51cdeaa68142.jpg"
            alt="Logo"
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              height: "2rem",
            }}
          />
          <Box sx={{ flexGrow: 1 }} />

          <NavLink to="/">
            <Button>Home</Button>
          </NavLink>
          <NavLink to="/about">
            <Button>About</Button>
          </NavLink>
          <NavLink to="/contact">
            <Button>Contact</Button>
          </NavLink>
          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            // Mobile Menu (Drawer)
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              sx={{ width: 250 }}
            >
              <Box sx={{ width: 250, padding: 2 }}>
                {user ? (
                  <>
                    <NavLink
                      to={
                        user?.roleId?.slug === "admin"
                          ? "/admin/dashboard"
                          : "/client/dashboard"
                      }
                    >
                      <Button fullWidth>Dashboard</Button>
                    </NavLink>
                    <Button fullWidth onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <NavLink to="/signin">
                      <Button fullWidth>Sign In</Button>
                    </NavLink>
                    <NavLink to="/signup">
                      <Button fullWidth>Sign Up</Button>
                    </NavLink>
                  </>
                )}
              </Box>
            </Drawer>
          ) : (
            // Desktop Menu
            <Box>
              {user ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="base"
                    sx={{ marginRight: 2, color: "black" }}
                  >
                    Welcome, {user?.name}
                  </Typography>
                  <NavLink
                    to={
                      user?.roleId?.slug === "admin"
                        ? "/admin/dashboard"
                        : "/client/dashboard"
                    }
                  >
                    <Button>Dashboard</Button>
                  </NavLink>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </Box>
              ) : (
                <>
                  <NavLink to="/signin">
                    <Button>Sign In</Button>
                  </NavLink>
                  <NavLink to="/signup">
                    <Button>Sign Up</Button>
                  </NavLink>
                </>
              )}
            </Box>
          )}
          {/* Dropdown menu (for small screens) */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <NavLink to="/home">
                <Typography variant="body1" color="textPrimary">
                  Home
                </Typography>
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <NavLink to="/about">
                <Typography variant="body1" color="textPrimary">
                  About
                </Typography>
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <NavLink to="/contact">
                <Typography variant="body1" color="textPrimary">
                  Contact
                </Typography>
              </NavLink>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
