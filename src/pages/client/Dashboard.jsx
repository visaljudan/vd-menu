import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button
} from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";

// Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";

// Quick Action Button Component
const QuickActionButton = ({ title, icon, to, color }) => {
  const theme = useTheme();
  
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        color={color || "primary"}
        startIcon={icon}
        fullWidth
        sx={{
          height: 80,
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: 3,
          fontSize: "1rem",
          textTransform: "none",
          borderRadius: "12px",
          boxShadow: theme.shadows[2],
          transition: "all 0.3s",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: theme.shadows[4]
          }
        }}
      >
        {title}
      </Button>
    </NavLink>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: "100%",
        boxShadow: theme.shadows[3],
        borderRadius: "12px",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[6]
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main" ml={0.5}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: color || theme.palette.primary.main,
              width: 56,
              height: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalBusinesses: 0,
    totalCategories: 0,
    totalItems: 0,
    salesToday: 0,
    lowStockItems: 0,
    recentSales: [],
    lowStockProducts: []
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Get the current user's ID
      const userId = user?._id;
      
      if (!userId) {
        console.error("User ID not available");
        setLoading(false);
        return;
      }

      // Fetch all dashboard data for the specific user
      const [businessesResponse, categoriesResponse, itemsResponse] = await Promise.all([
        api.get(`api/v1/businesses?userId=${userId}`).catch(err => ({ data: { data: { total: 0 } } })),
        api.get(`api/v1/categories?userId=${userId}`).catch(err => ({ data: { data: { total: 0 } } })),
        api.get(`api/v1/items?userId=${userId}`).catch(err => ({ data: { data: { total: 0 } } }))
      ]);
      
      // Extract totals from responses
      const totalBusinesses = businessesResponse.data?.data?.total || 0;
      const totalCategories = categoriesResponse.data?.data?.total || 0;
      const totalItems = itemsResponse.data?.data?.total || 0;
      
      console.log("Dashboard data for user:", userId, {
        totalBusinesses,
        totalCategories,
        totalItems
      });
      
      setDashboardData(prev => ({
        ...prev,
        totalBusinesses,
        totalCategories,
        totalItems
      }));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderRecentSales = () => (
    <List sx={{ width: "100%" }}>
      {dashboardData.recentSales.length > 0 ? (
        dashboardData.recentSales.map((sale, index) => (
          <React.Fragment key={index}>
            <ListItem
              secondaryAction={
                <Typography variant="body2" color="textSecondary">
                  {sale.time}
                </Typography>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <PointOfSaleIcon color="success" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${sale.id} - ${sale.product}`}
                secondary={sale.amount}
                primaryTypographyProps={{ fontWeight: "medium" }}
                secondaryTypographyProps={{ color: "success.main", fontWeight: "medium" }}
              />
            </ListItem>
            {index < dashboardData.recentSales.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText
            primary="No recent sales"
            secondary="Sales will appear here once you start recording them"
            primaryTypographyProps={{ color: "textSecondary" }}
            secondaryTypographyProps={{ color: "textSecondary" }}
          />
        </ListItem>
      )}
    </List>
  );

  const renderLowStockItems = () => (
    <List sx={{ width: "100%" }}>
      {dashboardData.lowStockProducts.length > 0 ? (
        dashboardData.lowStockProducts.map((product, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                  <WarningIcon color="warning" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`${product.stock} left (threshold: ${product.threshold})`}
                primaryTypographyProps={{ fontWeight: "medium" }}
                secondaryTypographyProps={{ color: "warning.main" }}
              />
              <Button 
                variant="outlined" 
                size="small" 
                color="warning"
                startIcon={<LocalShippingIcon />}
              >
                Reorder
              </Button>
            </ListItem>
            {index < dashboardData.lowStockProducts.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText
            primary="No low stock items"
            secondary="All products are well stocked"
            primaryTypographyProps={{ color: "textSecondary" }}
            secondaryTypographyProps={{ color: "textSecondary" }}
          />
        </ListItem>
      )}
    </List>
  );

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ padding: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(75deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            padding: { xs: 3, md: 4 },
            marginBottom: 4,
            borderRadius: "16px"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Welcome back, {user?.name || "User"}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, mt: 1 }}>
            Here's what's happening with your business today
          </Typography>
        </Paper>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={4}>
            <StatCard 
              title="Total Businesses" 
              value={dashboardData.totalBusinesses} 
              icon={<BusinessIcon fontSize="large" />}
              color={theme.palette.primary.main}
              trend="+3 this month"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <StatCard 
              title="Total Categories" 
              value={dashboardData.totalCategories} 
              icon={<CategoryIcon fontSize="large" />}
              color={theme.palette.info.main}
              trend="+2 this month"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <StatCard 
              title="Total Items" 
              value={dashboardData.totalItems} 
              icon={<InventoryIcon fontSize="large" />}
              color={theme.palette.success.main}
              trend="+12% this month"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: "12px", height: "100%" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="medium">
                    Recent Sales
                  </Typography>
                  <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                    <TrendingUpIcon color="success" />
                  </Avatar>
                </Box>
                {renderRecentSales()}
              </CardContent>
            </Card>
          </Grid> */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "12px", mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <QuickActionButton 
                      title="Add New Business" 
                      icon={<AddIcon />} 
                      to="/client/business-management" 
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <QuickActionButton 
                      title="Add New Category" 
                      icon={<CategoryIcon />} 
                      to="/client/category-management"
                      color="success"
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <QuickActionButton 
                      title="View Reports" 
                      icon={<AssessmentIcon />} 
                      to="/reports" 
                      color="info"
                    />
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
            
            {/* <Card sx={{ borderRadius: "12px" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="medium">
                    Low Stock Items
                  </Typography>
                  <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                    <WarningIcon color="warning" />
                  </Avatar>
                </Box>
                {renderLowStockItems()}
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;