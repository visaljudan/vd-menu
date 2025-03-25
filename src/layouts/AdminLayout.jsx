import React from "react";
import { Box, CssBaseline } from "@mui/material"; // Make sure these are imported
import Sidebar from "./Sidebar"; // Adjust path accordingly
import Topbar from "./Topbar"; // Adjust path accordingly

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Topbar />
        <Box sx={{ py: 6, px: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
