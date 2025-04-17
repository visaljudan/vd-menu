import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
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
  Alert,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { styled } from "@mui/system";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";

// Custom styled components (kept as is, though StyledCard is not used in the provided snippet)
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
  const [telegrams, setTelegrams] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(false); // For general loading state (initial fetch, save, delete)
  const [dialogLoading, setDialogLoading] = useState(false); // Specific loading for dialog save button
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Can be user object for edit, or empty object for add
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to fetch telegrams from the API
  const fetchtelegrams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("api/v1/telegrams");
      console.log(response.data.data);
      setTelegrams(response.data.data);
    } catch (error) {
      console.error("Failed to fetch telegrams:", error);
      setNotification({
        open: true,
        message: `Failed to fetch telegrams: ${error.message || "Unknown error"}`,
        severity: "error",
      });
      setTelegrams([]); // Clear telegrams on error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, []); // No dependencies, fetchtelegrams itself doesn't change

  // Fetch telegrams when the component mounts
  useEffect(() => {
    fetchtelegrams();
  }, [fetchtelegrams]); // Depend on fetchtelegrams

  // Search/filter function (remains the same)
  const filteredtelegrams = telegrams?.data?.filter(
    (user) =>
      user.name?.toLowerCase().includes(filter.toLowerCase()) ||
      user.username?.toLowerCase().includes(filter.toLowerCase()) ||
      user.status?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOpenDialog = (user) => {
    // If user is null (adding), set currentUser to an empty object
    // Otherwise (editing), set currentUser to the user object
    setCurrentUser(
      user
        ? { ...user }
        : { name: "", username: "", phoneNumber: "", status: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null); // Reset currentUser when dialog closes
    setDialogLoading(false); // Ensure dialog loading is reset
  };

  const handleDialogInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSaveUser = async () => {
    setDialogLoading(true); // Start loading indicator in the dialog button
    const isEditing = currentUser && currentUser.id; // Check if it's an edit operation

    try {
      let response;
      if (isEditing) {
        // Update existing user (PUT or PATCH)
        response = await api.put(
          `/v1/telegrams/${currentUser.id}`,
          currentUser
        );
      } else {
        // Add new user (POST)
        // Ensure ID is not sent if the backend generates it
        const { id, ...newUser } = currentUser;
        response = await api.post("/v1/telegrams", newUser);
      }

      setNotification({
        open: true,
        message: isEditing
          ? "User updated successfully!"
          : "New user added successfully!",
        severity: "success",
      });
      handleCloseDialog(); // Close the dialog on success
      await fetchtelegrams(); // Refetch telegrams to update the table
    } catch (error) {
      console.error("Failed to save user:", error);
      setNotification({
        open: true,
        message: `Failed to save user: ${error.response?.data?.message || error.message || "Unknown error"}`,
        severity: "error",
      });
      // Keep the dialog open on error so user can retry or fix input
      setDialogLoading(false); // Stop dialog loading indicator on error
    }
    // No finally block needed here for setDialogLoading(false) because it's handled in success (via handleCloseDialog) and error paths.
  };

  const handleDeleteUser = async (id) => {
    // Optional: Add a confirmation dialog here before deleting

    // Set loading state if you want a general page indicator during delete
    // setLoading(true);
    try {
      await api.delete(`/v1/telegrams/${id}`);
      setNotification({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
      // Instead of filtering locally, refetch the data for consistency
      await fetchtelegrams(); // Refetch telegrams to update the table
    } catch (error) {
      console.error("Failed to delete user:", error);
      setNotification({
        open: true,
        message: `Failed to delete user: ${error.response?.data?.message || error.message || "Unknown error"}`,
        severity: "error",
      });
      // setLoading(false); // Stop loading indicator on error
    }
    // No finally needed if only using success/error paths
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
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

        {/* User Table Area */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
                {filteredtelegrams?.length > 0 ? (
                  filteredtelegrams.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenDialog(user)}
                          color="primary"
                          aria-label="edit user"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteUser(user.id)}
                          color="error"
                          aria-label="delete user"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No telegrams found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add New User Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={() => handleOpenDialog(null)} // Pass null to indicate adding a new user
        >
          Add New User
        </Button>

        {/* User Edit/Add Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {currentUser?.id ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            {/* Use name attribute for easier state update */}
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              name="name" // Add name attribute
              value={currentUser?.name || ""}
              onChange={handleDialogInputChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              name="username" // Add name attribute
              value={currentUser?.username || ""}
              onChange={handleDialogInputChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone Number"
              type="text"
              fullWidth
              variant="outlined"
              name="phoneNumber" // Add name attribute
              value={currentUser?.phoneNumber || ""}
              onChange={handleDialogInputChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Status"
              type="text"
              fullWidth
              variant="outlined"
              name="status" // Add name attribute
              value={currentUser?.status || ""}
              onChange={handleDialogInputChange}
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="secondary"
              disabled={dialogLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              color="primary"
              disabled={dialogLoading}
            >
              {dialogLoading ? (
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
          autoHideDuration={6000} // Increased duration slightly
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position Snackbar
        >
          {/* Use Alert component inside Snackbar for better styling */}
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default TelegramManagement;
