import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { styled } from "@mui/system";
import MainLayout from "../../layouts/MainLayout";

// Sample mock data for Telegram user management
const initialData = [
  {
    id: 1,
    name: "John Doe",
    username: "@johndoe",
    phoneNumber: "+123456789",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "@janesmith",
    phoneNumber: "+987654321",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Michael Scott",
    username: "@michaelscott",
    phoneNumber: "+112233445",
    status: "Active",
  },
  {
    id: 4,
    name: "Dwight Schrute",
    username: "@dwight",
    phoneNumber: "+223344556",
    status: "Inactive",
  },
];

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const TelegramManagement = () => {
  const [users, setUsers] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Search/filter function
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.status.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOpenDialog = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleSaveUser = () => {
    // Simulate API call to save user changes
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setNotification({
        open: true,
        message: currentUser
          ? "User updated successfully!"
          : "New user added successfully!",
        severity: "success",
      });
      setOpenDialog(false);
    }, 1000);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setNotification({
      open: true,
      message: "User deleted successfully!",
      severity: "success",
    });
  };

  return (
    <MainLayout>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600 }}>
          Telegram User Management
        </Typography>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          label="Search by Name, Username, or Status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          sx={{ marginBottom: 3 }}
          InputProps={{
            endAdornment: <Search />,
          }}
        />

        {/* User Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenDialog(user)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteUser(user.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add New User Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => handleOpenDialog(null)}
        >
          Add New User
        </Button>

        {/* User Edit/Add Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {currentUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={currentUser?.name || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Username"
              value={currentUser?.username || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Phone Number"
              value={currentUser?.phoneNumber || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, phoneNumber: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Status"
              value={currentUser?.status || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, status: e.target.value })
              }
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveUser} color="primary">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          message={notification.message}
          severity={notification.severity}
        />
      </Box>
    </MainLayout>
  );
};

export default TelegramManagement;
