import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Container,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Divider,
  Alert,
  Fade,
  ButtonGroup,
  Button
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Analytics,
  People,
  Business,
  Inventory,
  Report,
  TrendingUp,
  TrendingDown,
  Refresh,
  DateRange,
  Category,
  Warning,
  Assessment,
  ShowChart,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayout";

const AdminAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');

  // Enhanced mock summary data with trends
  const summaryData = [
    { 
      title: "Total Users", 
      value: 1200, 
      trend: +15.3,
      icon: <People />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Active platform users"
    },
    { 
      title: "Total Businesses", 
      value: 480, 
      trend: +8.7,
      icon: <Business />,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Registered businesses"
    },
    { 
      title: "Total Items", 
      value: 3100, 
      trend: +23.1,
      icon: <Inventory />,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Listed products"
    },
    { 
      title: "Reports This Month", 
      value: 34, 
      trend: -12.4,
      icon: <Report />,
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      description: "User reports received"
    },
  ];

  // Enhanced growth data with more metrics
  const growthData = [
    { month: "Jan", users: 200, businesses: 80, items: 500, revenue: 15000 },
    { month: "Feb", users: 300, businesses: 120, items: 750, revenue: 22000 },
    { month: "Mar", users: 400, businesses: 160, items: 900, revenue: 28000 },
    { month: "Apr", users: 500, businesses: 200, items: 1100, revenue: 35000 },
    { month: "May", users: 650, businesses: 250, items: 1350, revenue: 42000 },
    { month: "Jun", users: 800, businesses: 300, items: 1600, revenue: 50000 },
  ];

  // Enhanced category distribution with more details
  const categoryData = [
    { name: "Electronics", value: 1200, growth: 15.2, color: "#0088FE" },
    { name: "Furniture", value: 600, growth: 8.5, color: "#00C49F" },
    { name: "Clothing", value: 400, growth: 12.3, color: "#FFBB28" },
    { name: "Vehicles", value: 900, growth: 6.8, color: "#FF8042" },
    { name: "Books", value: 300, growth: 18.7, color: "#8884D8" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Enhanced business activity data
  const barData = [
    { name: "Gadget Zone", reports: 12, resolved: 8, rating: 4.2 },
    { name: "Furniture Mart", reports: 8, resolved: 6, rating: 4.5 },
    { name: "Auto Center", reports: 15, resolved: 10, rating: 3.8 },
    { name: "Style Corner", reports: 4, resolved: 4, rating: 4.8 },
    { name: "Book Haven", reports: 6, resolved: 5, rating: 4.6 },
  ];

  // Performance metrics data
  const performanceData = [
    { metric: "User Satisfaction", value: 87, color: "#4caf50" },
    { metric: "Platform Uptime", value: 99.9, color: "#2196f3" },
    { metric: "Response Time", value: 92, color: "#ff9800" },
    { metric: "Resolution Rate", value: 85, color: "#9c27b0" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper 
          sx={{ 
            p: 2, 
            border: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 3
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            {`${label}`}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index}
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const renderMetricCard = (data, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Card 
        elevation={0}
        sx={{ 
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          }
        }}
      >
        <Box
          sx={{
            background: data.color,
            height: 4,
            width: '100%',
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              sx={{
                background: data.color,
                width: 48,
                height: 48,
              }}
            >
              {data.icon}
            </Avatar>
            <Chip
              icon={data.trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${data.trend > 0 ? '+' : ''}${data.trend}%`}
              color={data.trend > 0 ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ mb: 1 }}>
            {data.value.toLocaleString()}
          </Typography>
          <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 0.5 }}>
            {data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header Section */}
          <Box 
            sx={{ 
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Analytics />
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight="600" 
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  Platform Analytics
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                >
                  Comprehensive insights and performance metrics
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ButtonGroup variant="outlined" size="small">
                <Button 
                  variant={timeRange === 'week' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={timeRange === 'month' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={timeRange === 'year' ? 'contained' : 'outlined'}
                  onClick={() => setTimeRange('year')}
                >
                  Year
                </Button>
              </ButtonGroup>
              <Tooltip title="Refresh Data" arrow>
                <IconButton 
                  color="primary"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {summaryData.map(renderMetricCard)}
          </Grid>

          {/* Navigation Tabs */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 4,
              border: 1,
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ 
                px: 2,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }
              }}
            >
              <Tab icon={<ShowChart />} label="Growth Analysis" />
              <Tab icon={<PieChartIcon />} label="Category Distribution" />
              <Tab icon={<BarChartIcon />} label="Business Reports" />
              <Tab icon={<Assessment />} label="Performance" />
            </Tabs>
          </Card>

          {/* Tab Content */}
          <Fade in={activeTab === 0}>
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <Card 
                elevation={0}
                sx={{ 
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    p: 3,
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    Growth Trends Over Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track platform growth across key metrics
                  </Typography>
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorBusinesses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                      <Area type="monotone" dataKey="businesses" stackId="1" stroke="#82ca9d" fillOpacity={1} fill="url(#colorBusinesses)" />
                      <Area type="monotone" dataKey="items" stackId="1" stroke="#ffc658" fillOpacity={1} fill="url(#colorItems)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Box>
          </Fade>

          <Fade in={activeTab === 1}>
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 3,
                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        borderBottom: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        Category Distribution
                      </Typography>
                    </Box>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 3,
                        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        borderBottom: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        Category Insights
                      </Typography>
                    </Box>
                    <CardContent>
                      <Stack spacing={2}>
                        {categoryData.map((category, index) => (
                          <Box key={category.name}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: category.color,
                                  }}
                                />
                                <Typography variant="body2" fontWeight="600">
                                  {category.name}
                                </Typography>
                              </Box>
                              <Chip
                                label={`+${category.growth}%`}
                                color="success"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                              {category.value.toLocaleString()} items
                            </Typography>
                            {index < categoryData.length - 1 && <Divider />}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          <Fade in={activeTab === 2}>
            <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <Card 
                elevation={0}
                sx={{ 
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    p: 3,
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    borderBottom: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" color="text.primary">
                    Business Report Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor businesses with the highest report frequency
                  </Typography>
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="reports" fill="#f44336" name="Total Reports" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolved" fill="#4caf50" name="Resolved Reports" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Box>
          </Fade>

          <Fade in={activeTab === 3}>
            <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
              <Grid container spacing={3}>
                {performanceData.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                        height: '100%',
                        textAlign: 'center'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: `conic-gradient(${metric.color} ${metric.value * 3.6}deg, #e0e0e0 0deg)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              backgroundColor: 'background.paper',
                            }
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            fontWeight="700"
                            sx={{ position: 'relative', zIndex: 1 }}
                          >
                            {metric.value}%
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="600" color="text.primary">
                          {metric.metric}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default AdminAnalysis;