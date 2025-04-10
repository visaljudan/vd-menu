import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

// Mock Data (replace with actual data fetching logic)
const mockData = {
  totalBusinesses: 12,
  totalCategories: 8,
  totalItems: 56,
  top5Businesses: [
    { name: "Business 1", itemsCount: 15 },
    { name: "Business 2", itemsCount: 12 },
    { name: "Business 3", itemsCount: 10 },
    { name: "Business 4", itemsCount: 8 },
    { name: "Business 5", itemsCount: 6 },
  ],
};

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call to fetch dashboard data
    setTimeout(() => {
      setLoading(false); // Stop loading after mock data is loaded
    }, 1000);
  }, []);

  return (
    <MainLayout>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Businesses</Typography>
                    <Typography variant="h5">
                      {mockData.totalBusinesses}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Categories</Typography>
                    <Typography variant="h5">
                      {mockData.totalCategories}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Items</Typography>
                    <Typography variant="h5">{mockData.totalItems}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Top 5 Businesses</Typography>
                    <ul>
                      {mockData.top5Businesses.map((business, index) => (
                        <li key={index}>
                          {business.name}: {business.itemsCount} items
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h6" gutterBottom>
                Manage Your Business
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <NavLink to="/client/business-management">
                    <Card sx={{ textAlign: "center", padding: 2 }}>
                      <Typography variant="h6">Business Management</Typography>
                    </Card>
                  </NavLink>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <NavLink to="/client/category-management">
                    <Card sx={{ textAlign: "center", padding: 2 }}>
                      <Typography variant="h6">Category Management</Typography>
                    </Card>
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
