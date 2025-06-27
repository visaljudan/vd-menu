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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Close } from "@mui/icons-material";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  
  // Update modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    phone: "",
    address: "",
    status: "",
    note: ""
  });
  
  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  // Loading states for operations
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const statusOptions = ["pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/v1/orders");
      // The response has a data property containing the orders array
      setOrders(response.data.data || []);
      setLoading(false);
      console.log("Orders fetched:", response.data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  const filteredOrders = orders?.data?.filter((order) => {
    const orderDate = new Date(order.createdAt || order.updatedAt);
    const monthMatch = filterMonth
      ? orderDate.getMonth() + 1 === parseInt(filterMonth)
      : true;
    const yearMatch = filterYear
      ? orderDate.getFullYear().toString() === filterYear
      : true;
    return monthMatch && yearMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Processing":
        return "warning";
      case "pending":
        return "default";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      name: order.name || "",
      phone: order.phone || "",
      address: order.address || "",
      status: order.status || "",
      note: order.note || ""
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedOrder) return;
    
    setUpdating(true);
    try {
      const response = await api.put(`/api/v1/orders/${selectedOrder.id}`, updateData);
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, ...updateData }
          : order
      ));
      
      setUpdateModalOpen(false);
      setSnackbar({
        open: true,
        message: "Order updated successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error updating order:", err);
      setSnackbar({
        open: true,
        message: "Failed to update order. Please try again.",
        severity: "error"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    setDeleting(true);
    try {
      await api.delete(`/api/v1/orders/${orderToDelete.id}`);
      
      // Remove the order from local state
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      
      setDeleteModalOpen(false);
      setSnackbar({
        open: true,
        message: "Order deleted successfully!",
        severity: "success"
      });
    } catch (err) {
      console.error("Error deleting order:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete order. Please try again.",
        severity: "error"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <MainLayout>
        <Box p={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box p={4}>
          <Alert severity="error">Error loading orders: {error}</Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Orders Report
        </Typography>

        {/* Filter section */}
        <Paper sx={{ padding: 2, marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
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
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                type="number"
                placeholder="2025"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterMonth("");
                  setFilterYear("");
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Orders Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Order ID</TableCell> */}
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      {/* <TableCell>{order.id}</TableCell> */}
                      <TableCell>
                        <Typography fontWeight="bold">{order.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{order.phone}</Typography>
                        {order.business?.name && (
                          <Typography variant="body2" color="text.secondary">
                            Business: {order.business.name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.items?.map((item, index) => (
                          <Typography key={index} variant="body2">
                            {item.quantity} × {item.itemId.name} (${item.unitPrice})
                          </Typography>
                        )) || "No items"}
                      </TableCell>
                      <TableCell>
                        ${order.total || "0.00"}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleUpdateClick(order)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No orders found for the selected filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Update Order Modal */}
        <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Update Order #{selectedOrder?.id}
            <IconButton
              onClick={() => setUpdateModalOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={updateData.phone}
                  onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={updateData.address}
                  onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  value={updateData.note}
                  onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={updateData.status}
                    label="Status"
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateSubmit} 
              variant="contained" 
              disabled={updating}
            >
              {updating ? <CircularProgress size={20} /> : "Update Order"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete order #{orderToDelete?.id} for {orderToDelete?.name}?
              {orderToDelete?.items?.length > 0 && (
                <span> This order contains {orderToDelete.items.length} items.</span>
              )}
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleting}
            >
              {deleting ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default OrderPage;