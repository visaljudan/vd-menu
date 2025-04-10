import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MainLayout from "../../layouts/MainLayout";
import { Helmet } from "react-helmet";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topBusinesses, setTopBusinesses] = useState([]);
  const title = "Admin Dashboard";

  useEffect(() => {
    const mockStats = {
      users: 1200,
      businesses: 300,
      categories: 20,
      items: 7000,
      growth: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        users: [100, 200, 300, 600],
        items: [500, 1500, 3000, 7000],
      },
    };

    const mockTopBusinesses = [
      { name: "Tech Store", itemCount: 1200 },
      { name: "Phone Hub", itemCount: 900 },
      { name: "Gadget World", itemCount: 850 },
      { name: "ElectroKing", itemCount: 700 },
      { name: "SecondZone", itemCount: 670 },
    ];

    setTimeout(() => {
      setStats(mockStats);
      setTopBusinesses(mockTopBusinesses);
    }, 500);
  }, []);

  // if (!stats) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  const chartData = stats?.growth?.labels.map((label, index) => ({
    name: label,
    users: stats?.growth?.users[index],
    items: stats?.growth?.items[index],
  }));

  const summaryData = [
    { title: "Users", value: stats?.users },
    { title: "Businesses", value: stats?.businesses },
    { title: "Categories", value: stats?.categories },
    { title: "Items", value: stats?.items },
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          {summaryData.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="subtitle1" color="textSecondary">
                  {stat.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Growth Chart */}
        <Box mt={5}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Growth Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#1976d2" />
                <Line type="monotone" dataKey="items" stroke="#2e7d32" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Top Businesses */}
        <Box mt={5}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Businesses by Item Count
            </Typography>
            <List>
              {topBusinesses.map((biz, index) => (
                <ListItem key={index} divider>
                  <ListItemText primary={biz.name} />
                  <Typography fontWeight="bold">
                    {biz.itemCount} items
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default AdminDashboard;
