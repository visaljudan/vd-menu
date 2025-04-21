import { useState, useEffect, useCallback } from "react"; // Added useCallback
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TablePagination,
  CircularProgress, // Added for loading state
  Alert, // Added for potential error display
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import MainLayout from "../../layouts/MainLayout";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig"; // Assuming this is your configured Axios instance

// --- ConfirmDialog remains the same ---
const ConfirmDialog = ({ message, onConfirm, onClose, open }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const ItemManagement = () => {
  const { currentUser } = useSelector((state) => state.user);

  const title = "Item Management";
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "All" });
  const [open, setOpen] = useState(false); // For Add/Edit Dialog
  const [confirmOpen, setConfirmOpen] = useState(false); // For Delete Confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    status: "Active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNumber,
        size: pageSize,
      };

      const response = await api.get("/api/v1/items", {
        params: params,
      });

      const data = response.data.data;
      setItems(data.data);
      setTotalItems(data.total);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError(
        `Failed to fetch items: ${err.response?.data?.message || err.message}`
      );
      setItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle Add/Update ---
  const handleSubmit = async () => {
    setError(null);
    const itemData = { ...form };
    itemData.price = parseFloat(itemData.price) || 0;

    try {
      if (editingItem) {
        // Update existing item
        await api.patch(`/api/v1/items/${editingItem.id}`, itemData);
      } else {
        // Add new item
        await api.post("/api/v1/items", itemData);
      }
      setOpen(false);
      resetFormAndEditingState();
      fetchItems();
    } catch (err) {
      console.error("Failed to save item:", err);
      setError(
        `Failed to save item: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // --- Handle Edit Button Click ---
  const handleEdit = (item) => {
    // Make sure the form state matches the item structure from the API
    setForm({
      name: item.name || "",
      category: item.category || "",
      price: item.price?.toString() || "", // Ensure price is string for TextField
      status: item.status || "Active",
    });
    setEditingItem(item);
    setError(null); // Clear errors when opening dialog
    setOpen(true);
  };

  // --- Reset Form and Editing State ---
  const resetFormAndEditingState = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      status: "Active",
    });
    setEditingItem(null);
    setError(null); // Also clear errors on close/reset
  };

  // --- Handle Delete Confirmation Dialog ---
  const handleDeleteRequest = (itemId) => {
    setDeleteId(itemId);
    setConfirmOpen(true);
    setError(null); // Clear errors when opening dialog
  };

  // --- Handle Delete Action ---
  const handleDeleteConfirm = async () => {
    setError(null);
    try {
      await api.delete(`/api/v1/items/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfirmOpen(false);
      setDeleteId(null);
      if (items.length === 1 && pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      } else {
        fetchItems();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      setError(
        `Failed to delete item: ${err.response?.data?.message || err.message}`
      );
      setConfirmOpen(false);
    }
  };

  // --- Handle Closing the Add/Edit Dialog ---
  const handleCloseDialog = () => {
    setOpen(false);
    resetFormAndEditingState();
  };

  const filteredItems = items.filter(
    ({ name, status }) =>
      (filters.status === "All" || status === filters.status) &&
      (name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) // Add nullish coalescing for safety
  );

  // --- Pagination Handlers ---
  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage + 1); // Material UI's page is 0-based, our state is 1-based
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1); // Reset to first page when page size changes
  };

  // --- Open Add Item Dialog ---
  const handleOpenAddDialog = () => {
    resetFormAndEditingState(); // Ensure form is clear before opening for add
    setOpen(true);
  };

  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog} // Use specific handler
          >
            Add Item
          </Button>
        </Box>

        {/* Display Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* Search and Filter remain client-side in this example */}
          <TextField
            placeholder="Search by Name (on current page)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
            disabled={isLoading} // Disable while loading
          />
          <TextField
            select
            label="Status Filter"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            sx={{ width: 150 }}
            disabled={isLoading} // Disable while loading
          >
            {["All", "Active", "Inactive"].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                    <Typography>Loading Items...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    {" "}
                    {/* Assuming API provides 'id' */}
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.categoryId?.name}</TableCell>
                    {/* Format price if needed */}
                    <TableCell>
                      $
                      {typeof item.price === "number"
                        ? item.price.toFixed(2)
                        : item.price}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === "Active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(item)}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteRequest(item.id)} // Use specific handler
                          size="small"
                        >
                          <DeleteTwoToneIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {totalItems === 0 &&
                    !searchQuery &&
                    filters.status === "All"
                      ? "No items exist."
                      : "No items found matching your criteria."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Use totalItems from API for pagination count */}
        <TablePagination
          component="div"
          count={totalItems}
          page={pageNumber - 1} // Mui pagination is 0-based
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]} // Optional: provide page size options
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog} // Use specific handler
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingItem ? "Edit Item" : "Add Item"}
          <IconButton
            onClick={handleCloseDialog} // Use specific handler
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Display Dialog Specific Error */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              type="number" // Use number type for price input
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ step: "0.01" }} // Optional: Allow decimal prices
            />
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              {["Active", "Inactive"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>{" "}
          {/* Use specific handler */}
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        message="Are you sure you want to delete this item?"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm} // Use specific handler
      />
    </MainLayout>
  );
};

export default ItemManagement;
