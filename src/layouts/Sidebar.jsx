import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  People,
  Settings,
  Assignment,
  Analytics,
  WorkspacePremium,
  Subscriptions,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

// Simulating user role (You should get this from auth context or state)
const userRole = "user"; // Change this to "admin" or "user" based on login session

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    {
      text: "Users",
      icon: <People />,
      path: "/admin/user-management",
      roles: ["admin"],
    },
    {
      text: "Role Management",
      icon: <Settings />,
      path: "/admin/role-management",
      roles: ["admin"],
    },
    {
      text: "Subscription Plan",
      icon: <WorkspacePremium />,
      path: "/admin/subscription-plan",
      roles: ["admin"],
    },
    {
      text: "User Subscription Plan",
      icon: <Subscriptions />,
      path: "/admin/user-subscriptions",
      roles: ["admin", "user"],
    },
    {
      text: "Reports",
      icon: <Assignment />,
      path: "/admin/reports",
      roles: ["admin"],
    },
    {
      text: "Analysis",
      icon: <Analytics />,
      path: "/admin/analysis",
      roles: ["admin", "user"],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          bgcolor: "white",
          color: "gray",
        },
      }}
    >
      <Box sx={{ p: 2, bgcolor: "primary.main" }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      <List>
        {menuItems
          .filter((item) => item.roles.includes(userRole)) // 🔹 Filter items based on user role
          .map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "inherit",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "white" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
