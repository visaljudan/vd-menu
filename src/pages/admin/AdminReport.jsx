import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  Container,
  InputAdornment,
  Fade,
  TablePagination,
} from "@mui/material";
import {
  Report as ReportIcon,
  FilterList,
  Visibility,
  CheckCircle,
  Warning,
  Business,
  Inventory,
  Person,
  DateRange,
  Clear,
  TrendingUp,
  PendingActions,
} from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayout";

const AdminReport = () => {
  const [reports, setReports] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    // Mock reports data with enhanced structure
    const mockData = [
      {
        id: "RP-001",
        reporter: "User123",
        target: "Phone Hub",
        type: "Business",
        reason: "Selling counterfeit products",
        date: "2025-03-12",
        status: "Pending",
        severity: "High",
        description: "Customer reported fake iPhone sales with altered serial numbers.",
      },
      {
        id: "RP-002",
        reporter: "User345",
        target: "Samsung Galaxy S10",
        type: "Item",
        reason: "Incorrect specifications",
        date: "2025-04-01",
        status: "Resolved",
        severity: "Low",
        description: "Product listing had wrong RAM specifications.",
      },
      {
        id: "RP-003",
        reporter: "User567",
        target: "Gadget World",
        type: "Business",
        reason: "Scam business",
        date: "2025-04-05",
        status: "Pending",
        severity: "Critical",
        description: "Multiple users reported payment issues and non-delivery.",
      },
      {
        id: "RP-004",
        reporter: "User789",
        target: "iPhone 13 Pro",
        type: "Item",
        reason: "Damaged product received",
        date: "2025-04-08",
        status: "Under Review",
        severity: "Medium",
        description: "Product arrived with screen damage despite good packaging.",
      },
      {
        id: "RP-005",
        reporter: "User101",
        target: "Tech Solutions",
        type: "Business",
        reason: "Poor customer service",
        date: "2025-04-10",
        status: "Resolved",
        severity: "Low",
        description: "Customer service was unresponsive for warranty claims.",
      },
    ];
    setReports(mockData);
  }, []);

  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.date);
    const monthMatch = filterMonth
      ? reportDate.getMonth() + 1 === parseInt(filterMonth)
      : true;
    const yearMatch = filterYear
      ? reportDate.getFullYear().toString() === filterYear
      : true;
    return monthMatch && yearMatch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "success";
      case "pending":
        return "warning";
      case "under review":
        return "info";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "#f44336";
      case "high":
        return "#ff9800";
      case "medium":
        return "#2196f3";
      case "low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const getTypeIcon = (type) => {
    return type === "Business" ? <Business /> : <Inventory />;
  };

  const clearFilters = () => {
    setFilterMonth("");
    setFilterYear("");
    setPage(0);
  };

  const handleMarkResolved = (reportId) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Resolved" }
          : report
      )
    );
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending").length,
    resolved: reports.filter(r => r.status === "Resolved").length,
    critical: reports.filter(r => r.severity === "Critical").length,
  };

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
              gap: 2
            }}
          >
            <Avatar
              sx={{
                bgcolor: "error.main",
                width: 48,
                height: 48,
              }}
            >
              <ReportIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="600" 
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Reports Management
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
              >
                Monitor and manage user reports and complaints
              </Typography>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <ReportIcon sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Reports
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                  color: "white"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PendingActions sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {stats.pending}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Pending
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                  color: "white"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CheckCircle sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {stats.resolved}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Resolved
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  color: "white"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Warning sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {stats.critical}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Critical
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              border: 1,
              borderColor: "divider",
              borderRadius: 3
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <FilterList color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Filter Reports
                </Typography>
                {(filterMonth || filterYear) && (
                  <Chip
                    label="Filters Active"
                    color="primary"
                    size="small"
                    onDelete={clearFilters}
                    deleteIcon={<Clear />}
                  />
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Filter by Month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="">All Months</MenuItem>
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Filter by Year"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    type="number"
                    placeholder="2025"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: "flex", gap: 2, height: "100%" }}>
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      disabled={!filterMonth && !filterYear}
                      sx={{ 
                        borderRadius: 2,
                        minWidth: 120,
                        height: 56
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card 
            elevation={0}
            sx={{ 
              border: 1,
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden"
            }}
          >
            <Box 
              sx={{ 
                p: 3,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                borderBottom: 1,
                borderColor: "divider"
              }}
            >
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Reports List ({filteredReports.length} items)
              </Typography>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow 
                    sx={{ 
                      bgcolor: "grey.50",
                      "& .MuiTableCell-head": {
                        fontWeight: "700",
                        color: "text.primary",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }
                    }}
                  >
                    <TableCell>Report ID</TableCell>
                    <TableCell>Reporter</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                    <TableRow 
                      key={report.id}
                      sx={{ 
                        "&:hover": { 
                          bgcolor: "action.hover",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        },
                        transition: "all 0.2s ease-in-out"
                      }}
                    >
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          color="primary.main"
                        >
                          {report.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
                            <Person sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight="500">
                            {report.reporter}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.light" }}>
                            {getTypeIcon(report.type)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {report.target}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.reason}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getTypeIcon(report.type)}
                          label={report.type}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: "500" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: getSeverityColor(report.severity),
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            fontWeight="500"
                            sx={{ color: getSeverityColor(report.severity) }}
                          >
                            {report.severity}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(report.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={report.status}
                          color={getStatusColor(report.status)}
                          size="small"
                          sx={{ 
                            fontWeight: "600",
                            textTransform: "capitalize",
                            minWidth: 80
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Details" arrow>
                            <IconButton size="small" color="primary">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {report.status !== "Resolved" && (
                            <Tooltip title="Mark as Resolved" arrow>
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleMarkResolved(report.id)}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Box sx={{ textAlign: "center" }}>
                          <ReportIcon 
                            sx={{ 
                              fontSize: 64, 
                              color: "grey.400",
                              mb: 2
                            }} 
                          />
                          <Typography 
                            variant="h6" 
                            color="text.secondary"
                            fontWeight="500"
                          >
                            No reports found
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                          >
                            {filterMonth || filterYear 
                              ? "Try adjusting your filter criteria" 
                              : "No reports have been submitted yet"
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredReports.length > 0 && (
              <>
                <Divider />
                <TablePagination
                  component="div"
                  count={filteredReports.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10]}
                  sx={{ 
                    "& .MuiTablePagination-toolbar": {
                      px: 3,
                      py: 2
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                      fontWeight: "500"
                    }
                  }}
                />
              </>
            )}
          </Card>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default AdminReport;