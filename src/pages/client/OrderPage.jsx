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
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    // Mock orders data
    const mockData = [
      {
        id: "ORD-001",
        name: "Srun davith",
        phone: "0964679123",
        telegram: "@johndoe",
        orderItems: [
          { name: "Samsung Galaxy S23", quantity: 1 },
          { name: "Phone Case", quantity: 2 },
        ],
        totalAmount: 899.99,
        date: "2025-03-12",
        status: "Processing",
      },
      {
        id: "ORD-002",
        name: "Jane Smith",
        phone: "+9876543210",
        telegram: "@janesmith",
        orderItems: [
          { name: "iPhone 15 Pro", quantity: 1 },
          { name: "AirPods Pro", quantity: 1 },
        ],
        totalAmount: 1299.99,
        date: "2025-04-01",
        status: "Shipped",
      },
      {
        id: "ORD-003",
        name: "Robert Johnson",
        phone: "+1122334455",
        telegram: "@robertj",
        orderItems: [{ name: "Google Pixel 8", quantity: 1 }],
        totalAmount: 699.99,
        date: "2025-04-05",
        status: "Delivered",
      },
    ];
    setOrders(mockData);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
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
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

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
          </Grid>
        </Paper>

        {/* Orders Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{order.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{order.phone}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.telegram}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.orderItems.map((item, index) => (
                        <Typography key={index}>
                          {item.quantity} × {item.name}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">
                        Details
                      </Button>
                      {order.status !== "Delivered" && (
                        <Button
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                          variant="contained"
                        >
                          Update
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default OrderPage;