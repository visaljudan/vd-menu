import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, People, Settings } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Users", icon: <People />, path: "/admin/user-management" },
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
