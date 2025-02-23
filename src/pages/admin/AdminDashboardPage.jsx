import { Container, Grid, Paper, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#121212",
            color: "white"
          },
        }}
      >
        <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>Admin Panel</Typography>
        <List>
          <ListItem button>
            <ListItemIcon><DashboardIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><PeopleIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><ShoppingCartIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><ReceiptIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><WorkIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><LocalShippingIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Logistics" />
          </ListItem>
          <ListItem button onClick={() => navigate("/user-management")}>
            <ListItemIcon><PersonIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><SettingsIcon style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default AdminDashboardPage;