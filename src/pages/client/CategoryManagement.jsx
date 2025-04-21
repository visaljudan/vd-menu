import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TablePagination,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Business as BusinessIcon } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig";
import MainLayout from "../../layouts/MainLayout";

const ConfirmDialog = ({ open, onClose, onConfirm, message }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const CategoryModal = ({
  open,
  onClose,
  onSave,
  category,
  businesses,
  isEdit,
  isLoading,
}) => {
  const [form, setForm] = useState({
    name: category?.name || "",
    businessId: category?.businessId?._id || "",
    description: category?.description || "",
    status: category?.status || "active",
  });

  useEffect(() => {
    if (isEdit && category) {
      setForm({
        name: category.name || "",
        businessId: category.businessId?._id || "",
        description: category.description || "",
        status: category.status || "active",
      });
    } else {
      setForm({
        name: "",
        businessId: "",
        description: "",
        status: "active",
      });
    }
  }, [category, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      businessId: form.businessId,
      status: form.status,
    };

    if (form.description.trim()) {
      payload.description = form.description.trim();
    }

    onSave(isEdit ? { ...category, ...payload } : payload);
  };

  const requiredFieldsValid = form.name.trim() && form.businessId;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit" : "Add"} Category</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          required
          label="Business"
          name="businessId"
          value={form.businessId}
          onChange={handleChange}
          margin="dense"
          error={!form.businessId}
          helperText={!form.businessId && "Required"}
        >
          <MenuItem value="">
            <em>Select Business</em>
          </MenuItem>
          {businesses.map((b) => (
            <MenuItem key={b._id} value={b._id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          required
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="dense"
          error={!form.name.trim()}
          helperText={!form.name.trim() && "Required"}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={3}
        />

        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          margin="dense"
        >
          {["active", "inactive"].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!requiredFieldsValid}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoryManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  const token = currentUser?.token;
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    categories: [],
    businesses: [],
    loading: false,
    error: null,
    page: 0, // Changed to 0-based for MUI pagination
    pageSize: 10,
    total: 0,
    businessFilter: "",
  });

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    confirm: false,
    snackbar: { open: false, message: "", severity: "success" },
  });

  const [selected, setSelected] = useState({ category: null, deleteId: null });

  const fetchData = useCallback(
    async (type) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        if (type === "businesses") {
          const res = await api.get("/api/v1/businesses?limit=1000", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setState((prev) => ({
            ...prev,
            businesses: res.data.data?.data || [],
          }));
        } else {
          const res = await api.get(
            `/api/v1/categories?userId=${user._id}&page=${state.page + 1}&limit=${state.pageSize}`
          );
          const data = res.data.data;
          setState((prev) => ({
            ...prev,
            categories: data?.data || [],
            total: data?.total || 0,
            loading: false,
          }));
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error fetching data";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        setModals((prev) => ({
          ...prev,
          snackbar: { open: true, message: errorMessage, severity: "error" },
        }));
      }
    },
    [token, state.page, state.pageSize, state.businessFilter]
  );

  useEffect(() => {
    fetchData("businesses");
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!selected.deleteId) return;
    try {
      const res = await api.delete(`/api/v1/categories/${selected.deleteId}`);
      setModals((prev) => ({
        ...prev,
        confirm: false,
        snackbar: {
          open: true,
          message: "Deleted successfully",
          severity: "success",
        },
      }));
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      setModals((prev) => ({
        ...prev,
        snackbar: { open: true, message: errorMessage, severity: "error" },
      }));
    }
  };

  const handleSave = async (data) => {
    setIsLoading(true);
    try {
      const method = selected.category ? "patch" : "post";
      const url = selected.category
        ? `/api/v1/categories/${selected.category._id}`
        : "/api/v1/categories";
      await api[method](url, data);

      setModals((prev) => ({
        ...prev,
        [selected.category ? "edit" : "add"]: false,
        snackbar: {
          open: true,
          message: "Operation successful",
          severity: "success",
        },
      }));
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Operation failed";
      setModals((prev) => ({
        ...prev,
        snackbar: { open: true, message: errorMessage, severity: "error" },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setState((prev) => ({ ...prev, businessFilter: e.target.value, page: 0 }));
  };

  const filteredCategory = state.categories.filter((category) => {
    const selectedBusinessId = state.businessFilter;
    if (!selectedBusinessId) return true;

    return category.businessId?._id === selectedBusinessId;
  });

  const handlePageChange = (_, newPage) => {
    setState((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (e) => {
    setState((prev) => ({
      ...prev,
      pageSize: +e.target.value,
      page: 0,
    }));
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Category Management</title>
      </Helmet>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Category Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Business</InputLabel>
            <Select
              value={state.businessFilter}
              onChange={handleFilterChange}
              label="Filter by Business"
              renderValue={(val) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  {val
                    ? state.businesses.find((b) => b._id === val)?.name ||
                      "Unknown"
                    : "All Businesses"}
                </Box>
              )}
            >
              <MenuItem value="">
                <em>All Businesses</em>
              </MenuItem>
              {state.businesses.map((b) => (
                <MenuItem key={b._id} value={b._id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    {b.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={() => {
              setSelected({ category: null });
              setModals((prev) => ({ ...prev, add: true }));
            }}
            disabled={!token}
          >
            Add Category
          </Button>
        </Box>

        {state.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredCategory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    {state.businessFilter
                      ? "This business doesn't have any categories yet."
                      : "No categories found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategory.map((cat, i) => (
                  <TableRow key={cat._id} hover>
                    <TableCell>{state.page * state.pageSize + i + 1}</TableCell>
                    <TableCell>{cat.businessId?.name || "N/A"}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>
                      <Tooltip title={cat.description || ""}>
                        <Box
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "200px",
                          }}
                        >
                          {cat.description || "-"}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          cat.status === "active"
                            ? "success.main"
                            : "error.main",
                        fontWeight: "medium",
                      }}
                    >
                      {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            setSelected({ category: cat });
                            setModals((prev) => ({ ...prev, edit: true }));
                          }}
                          size="small"
                          color="primary"
                        >
                          <Edit fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setSelected({ deleteId: cat._id });
                            setModals((prev) => ({ ...prev, confirm: true }));
                          }}
                          color="error"
                          size="small"
                        >
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {state.total > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={state.total}
            rowsPerPage={state.pageSize}
            page={state.page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        <CategoryModal
          open={modals.add}
          onClose={() => setModals((prev) => ({ ...prev, add: false }))}
          onSave={handleSave}
          category={null}
          businesses={state.businesses}
          isEdit={false}
          isLoading={isLoading}
        />

        <CategoryModal
          open={modals.edit}
          onClose={() => setModals((prev) => ({ ...prev, edit: false }))}
          onSave={handleSave}
          category={selected.category}
          businesses={state.businesses}
          isEdit={true}
          isLoading={isLoading}
        />

        <ConfirmDialog
          open={modals.confirm}
          onClose={() => setModals((prev) => ({ ...prev, confirm: false }))}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this category? This action cannot be undone."
        />

        <Snackbar
          open={modals.snackbar.open}
          autoHideDuration={6000}
          onClose={() =>
            setModals((prev) => ({
              ...prev,
              snackbar: { ...prev.snackbar, open: false },
            }))
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={modals.snackbar.severity}
            onClose={() =>
              setModals((prev) => ({
                ...prev,
                snackbar: { ...prev.snackbar, open: false },
              }))
            }
            sx={{ width: "100%" }}
          >
            {modals.snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default CategoryManagement;
