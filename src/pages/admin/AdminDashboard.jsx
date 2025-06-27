import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import MainLayout from '../../layouts/MainLayout';
import api from "../../api/axiosConfig";

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  
  const title = 'Admin Dashboard';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/dashboard');
        setStats(response.data.data);
        console.log(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading && !stats) {
    return (
      <MainLayout>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading dashboard data...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  // Summary cards configuration
  const summaryCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
      icon: <PeopleAltIcon />,
      color: theme.palette.primary.main,
      description: stats?.userGrowth ? `+${stats.userGrowth}% from last month` : '',
    },
    {
      title: 'Businesses',
      value: stats?.totalBusinesses?.toLocaleString() || '0',
      icon: <BusinessIcon />,
      color: theme.palette.success.main,
      description: stats?.businessGrowth ? `+${stats.businessGrowth}% from last month` : '',
    },
    {
      title: 'Categories',
      value: stats?.totalCategories?.toLocaleString() || '0',
      icon: <CategoryIcon />,
      color: theme.palette.warning.main,
      description: 'Across all businesses',
    },
    {
      title: 'Total Items',
      value: stats?.totalItems?.toLocaleString() || '0',
      icon: <InventoryIcon />,
      color: theme.palette.secondary.main,
      description: stats?.itemGrowth ? `+${stats.itemGrowth}% from last month` : '',
    },
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
          >
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Summary Cards Grid */}
        <Grid container spacing={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(card.color, 0.1),
                          color: card.color,
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        {card.title}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="h4"
                      component="div"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      {card.value}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default AdminDashboard;