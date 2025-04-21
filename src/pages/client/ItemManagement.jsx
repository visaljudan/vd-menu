import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import MainLayout from "../../layouts/MainLayout";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig";

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
  const user = currentUser?.user;
  const token = currentUser?.token;

  const title = "Item Management";
  const [items, setItems] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
  const [filters, setFilters] = useState({
    status: "All",
    business: "",
    category: "",
  });

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { page: pageNumber, size: pageSize, userId: user._id };
      const response = await api.get("/api/v1/items", { params });
      const data = response.data.data;
      setItems(data.data);
      setTotalItems(data.total);
    } catch (err) {
      setError(
        `Failed to fetch items: ${err.response?.data?.message || err.message}`
      );
      setItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, user._id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    const itemData = { ...form, price: parseFloat(form.price) || 0 };
    try {
      if (editingItem) {
        await api.patch(`/api/v1/items/${editingItem.id}`, itemData);
      } else {
        await api.post("/api/v1/items", itemData);
      }
      setOpen(false);
      resetFormAndEditingState();
      fetchItems();
    } catch (err) {
      setError(
        `Failed to save item: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || "",
      category: item.categoryId?._id || "",
      price: item.price?.toString() || "",
      status: item.status || "Active",
    });
    setEditingItem(item);
    setError(null);
    setOpen(true);
  };

  const resetFormAndEditingState = () => {
    setForm({ name: "", category: "", price: "", status: "Active" });
    setEditingItem(null);
    setError(null);
  };

  const handleDeleteRequest = (itemId) => {
    setDeleteId(itemId);
    setConfirmOpen(true);
    setError(null);
  };

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
      setError(
        `Failed to delete item: ${err.response?.data?.message || err.message}`
      );
      setConfirmOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    resetFormAndEditingState();
  };

  const filteredItems = items?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBusiness =
      !filters.business || item.businessId?._id === filters.business;
    const matchesCategory =
      !filters.category || item.categoryId?._id === filters.category;
    return matchesSearch && matchesBusiness && matchesCategory;
  });

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
  };

  const handleOpenAddDialog = () => {
    resetFormAndEditingState();
    setOpen(true);
  };

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("api/v1/businesses");
      setBusinesses(response.data.data.data);
    } catch (err) {
      setError(
        `Failed to fetch businesses: ${err.response?.data?.message || err.message}`
      );
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const fetchCategories = useCallback(async (businessId) => {
    try {
      if (!businessId) return setCategories([]);
      const response = await api.get(
        `/api/v1/categories?businessId=${businessId}`
      );
      setCategories(response.data.data.data);
    } catch (err) {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    if (filters.business) {
      fetchCategories(filters.business);
    }
  }, [filters.business, fetchCategories]);

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
            onClick={handleOpenAddDialog}
          >
            Add Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
            disabled={isLoading}
          />
          <TextField
            select
            label="Business Filter"
            value={filters.business}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, business: e.target.value }))
            }
            sx={{ width: 200 }}
            disabled={isLoading}
          >
            <MenuItem value="">All Businesses</MenuItem>
            {businesses?.map((b) => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Catgogry Filter"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            sx={{ width: 200 }}
            disabled={isLoading}
          >
            {categories?.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
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
              ) : filteredItems?.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.categoryId?.name}</TableCell>
                    <TableCell>${item.price?.toFixed(2)}</TableCell>
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
                          onClick={() => handleDeleteRequest(item.id)}
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
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalItems}
          page={pageNumber - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingItem ? "Edit Item" : "Add Item"}
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ step: "0.01" }}
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingItem ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDeleteConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </MainLayout>
  );
};

export default ItemManagement;
