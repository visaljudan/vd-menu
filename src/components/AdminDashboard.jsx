import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 240;

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#121212",
            color: "white",
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
          Admin Panel
        </Typography>
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Clients" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ShoppingCartIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ReceiptIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <WorkIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LocalShippingIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Logistics" />
          </ListItem>
          <ListItem button onClick={() => navigate("/admin/user-management")}>
            <ListItemIcon>
              <PersonIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main">
        <Paper sx={{ p: 3 }}>
          {children || (
            <Typography variant="h5">Welcome to Admin Dashboard</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
