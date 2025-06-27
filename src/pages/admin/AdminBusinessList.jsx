import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  TablePagination,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  Tooltip,
  Fade,
  Stack,
  Divider,
  Avatar,
  TableContainer,
} from "@mui/material";
import { 
  Search, 
  Refresh, 
  Business as BusinessIcon,
  TrendingUp 
} from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";

const AdminBusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/businesses");
      setBusinesses(response.data.data);
      console.log("Total businesses:", response.data.data?.total);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Failed to load businesses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const filteredBusinesses = businesses?.data?.filter((business) =>
    business.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "suspended":
        return "warning";
      case "pending":
        return "info";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getBusinessInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "B";
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
                bgcolor: "primary.main",
                width: 48,
                height: 48,
              }}
            >
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="600" 
                color="text.primary"
                sx={{ mb: 1 }}
              >
                Business lists
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
              >
                Manage and monitor all registered businesses
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Stack 
            direction={{ xs: "column", md: "row" }} 
            spacing={3} 
            sx={{ mb: 4 }}
          >
            <Card 
              sx={{ 
                flex: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TrendingUp sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      {filteredBusinesses.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Businesses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card 
              sx={{ 
                flex: 1,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white"
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BusinessIcon sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      {filteredBusinesses.filter(b => b.status?.toLowerCase() === "active").length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Businesses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>

          {/* Main Content Card */}
          <Card 
            elevation={0}
            sx={{ 
              border: 1,
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden"
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Card Header */}
              <Box 
                sx={{ 
                  p: 3,
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  borderBottom: 1,
                  borderColor: "divider"
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    mb: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="600"
                    color="text.primary"
                  >
                    Business Directory
                  </Typography>
                  <Tooltip title="Refresh data" arrow>
                    <IconButton 
                      onClick={fetchBusinesses} 
                      color="primary"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        }
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Search Field */}
                <TextField
                  fullWidth
                  placeholder="Search businesses by name..."
                  variant="outlined"
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "grey.300",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Box>

              {/* Error Alert */}
              {error && (
                <Box sx={{ p: 3, pt: 0 }}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      borderRadius: 2,
                      "& .MuiAlert-message": {
                        fontWeight: 500
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </Box>
              )}

              {/* Table Section */}
              <Box sx={{ position: "relative" }}>
                {loading ? (
                  <Box 
                    sx={{ 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center",
                      py: 8
                    }}
                  >
                    <CircularProgress size={48} thickness={4} />
                  </Box>
                ) : (
                  <Fade in={!loading}>
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
                            <TableCell width="80">#</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell align="center">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredBusinesses.length > 0 ? (
                            filteredBusinesses
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((business, index) => (
                                <TableRow 
                                  key={business._id}
                                  sx={{ 
                                    "&:hover": { 
                                      bgcolor: "action.hover",
                                      transform: "translateY(-1px)",
                                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                                    },
                                    transition: "all 0.2s ease-in-out",
                                    cursor: "pointer"
                                  }}
                                >
                                  <TableCell 
                                    sx={{ 
                                      fontWeight: "600",
                                      color: "primary.main",
                                      fontSize: "0.875rem"
                                    }}
                                  >
                                    {page * rowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                      <Avatar
                                        sx={{
                                          bgcolor: "primary.light",
                                          color: "primary.contrastText",
                                          width: 40,
                                          height: 40,
                                          fontSize: "0.875rem",
                                          fontWeight: "600"
                                        }}
                                      >
                                        {getBusinessInitials(business.name)}
                                      </Avatar>
                                      <Box>
                                        <Typography 
                                          variant="body1" 
                                          fontWeight="600"
                                          color="text.primary"
                                        >
                                          {business.name}
                                        </Typography>
                                        <Typography 
                                          variant="body2" 
                                          color="text.secondary"
                                        >
                                          ID: {business._id?.slice(-8)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography 
                                      variant="body1" 
                                      fontWeight="500"
                                      color="text.primary"
                                    >
                                      {business.userId?.name || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={business.status || "Unknown"}
                                      color={getStatusColor(business.status)}
                                      size="small"
                                      sx={{ 
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                        minWidth: 80
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell 
                                colSpan={4} 
                                align="center" 
                                sx={{ py: 6 }}
                              >
                                <Box sx={{ textAlign: "center" }}>
                                  <BusinessIcon 
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
                                    No businesses found
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                  >
                                    {search ? "Try adjusting your search criteria" : "No businesses registered yet"}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Fade>
                )}

                {/* Pagination */}
                {!loading && filteredBusinesses.length > 0 && (
                  <>
                    <Divider />
                    <TablePagination
                      component="div"
                      count={filteredBusinesses.length}
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
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default AdminBusinessList;