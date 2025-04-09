import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Link,
  useTheme,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

const Logo = styled('img')(({ theme }) => ({
  height: '2rem',
  marginRight: theme.spacing(2),
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
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
        >
          <MenuIcon />
        </IconButton>
        <Logo
          src="https://i.pinimg.com/736x/12/83/16/1283166bf58b7a77574a51cdeaa68142.jpg"  // Use a URL here
          alt="Travel Destinations"
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
            height: '2rem',
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Box>
        <Button href="/signin"  onClick={() => console.log("Signin")}> {/* Example Sign Up button */}
            Sign In
          </Button>
          <Button href="/signup" onClick={() => console.log("Sign Up")}> {/* Example Sign Up button */}
            Sign Up
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem onClick={handleMenuClose}>About</MenuItem>
          <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
