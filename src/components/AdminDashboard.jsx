
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Box, CssBaseline, Toolbar } from "@mui/material";

const AdminDashboard = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Topbar />
          <Toolbar />
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
