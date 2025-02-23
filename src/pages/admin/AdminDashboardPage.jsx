  ListItem,
import React from "react";
import { Typography } from "@mui/material";
import AdminDashboard from "../../components/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <AdminDashboard>
      <Typography variant="h4">Dashboard Overview</Typography>
      <Typography variant="body1">
        Here is the main content of the admin dashboard.
      </Typography>
    </AdminDashboard>
  );
};

export default AdminDashboardPage;
