import { useEffect, useState, useCallback } from "react";
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip, TablePagination, Select, MenuItem,
  CircularProgress, Snackbar, Alert, FormControl, InputLabel
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
      <Button onClick={onConfirm} color="error" variant="contained">Confirm</Button>
    </DialogActions>
  </Dialog>
);
const CategoryModal = ({ open, onClose, onSave, category, businesses, isEdit }) => {
  const [form, setForm] = useState({
    name: category?.name || "",
    businessId: category?.businessId?._id || "",
    description: category?.description || "",
    status: category?.status || "active"
  });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      businessId: form.businessId,
      status: form.status
    };
    
    // Only include description if it's not empty
    if (form.description.trim()) {
      payload.description = form.description.trim();
    }
    
    onSave(isEdit ? { ...category, ...payload } : payload);
  };

  const requiredFieldsValid = form.name.trim() && form.businessId;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit' : 'Add'} Category</DialogTitle>
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
          <MenuItem value=""><em>Select Business</em></MenuItem>
          {businesses.map(b => (
            <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
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
          {["active", "inactive"].map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoryManagement = () => {
  const { token } = useSelector(state => state.user.currentUser || {});
  const [state, setState] = useState({
    categories: [], businesses: [], loading: false, error: null,
    page: 1, pageSize: 10, total: 0, businessFilter: ""
  });
  const [modals, setModals] = useState({
    add: false, edit: false, confirm: false, snackbar: { open: false, message: "", severity: "success" }
  });
  const [selected, setSelected] = useState({ category: null, deleteId: null });

  const fetchData = useCallback(async (type) => {
    if (!token) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      if (type === 'businesses') {
        const res = await api.get('/api/v1/businesses?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        setState(prev => ({ ...prev, businesses: res.data.data?.data || [] }));
      } else {
        let url = `/api/v1/categories?page=${state.page}&limit=${state.pageSize}`;
        if (state.businessFilter) url += `&businessId=${state.businessFilter}`;
        
        const res = await api.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data.data;
        setState(prev => ({ ...prev, 
          categories: data?.data || [], 
          total: data?.total || 0 
        }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: err.response?.data?.message || "Error fetching data" }));
      setModals(prev => ({ ...prev, 
        snackbar: { open: true, message: "Operation failed", severity: "error" }
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [token, state.page, state.pageSize, state.businessFilter]);

  useEffect(() => { fetchData('businesses') }, [fetchData]);
  useEffect(() => { fetchData() }, [fetchData]);

  const handleDelete = async () => {
    if (!selected.deleteId) return;
    try {
      await api.delete(`/api/v1/categories/${selected.deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      setModals(prev => ({ ...prev, 
        confirm: false, 
        snackbar: { open: true, message: "Deleted successfully", severity: "success" }
      }));
      fetchData();
    } catch (err) {
      setModals(prev => ({ ...prev, 
        snackbar: { open: true, message: "Delete failed", severity: "error" }
      }));
    }
  };

  const handleSave = async (data) => {
    try {
      const method = selected.category ? 'patch' : 'post';
      const url = selected.category ? `/api/v1/categories/${selected.category._id}` : '/api/v1/categories';
      await api[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
      
      setModals(prev => ({ ...prev, 
        [selected.category ? 'edit' : 'add']: false,
        snackbar: { open: true, message: "Operation successful", severity: "success" }
      }));
      fetchData();
    } catch (err) {
      setModals(prev => ({ ...prev, 
        snackbar: { open: true, message: "Operation failed", severity: "error" }
      }));
    }
  };

  const handleFilterChange = (e) => {
    setState(prev => ({ ...prev, businessFilter: e.target.value, page: 1 }));
  };

  return (
    <MainLayout>
      <Helmet><title>Category Management</title></Helmet>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Category Management
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Business</InputLabel>
            <Select
              value={state.businessFilter}
              onChange={handleFilterChange}
              label="Filter by Business"
              renderValue={(val) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  {val ? state.businesses.find(b => b._id === val)?.name || 'Unknown' : 'All Businesses'}
                </Box>
              )}
            >
              <MenuItem value=""><em>All Businesses</em></MenuItem>
              {state.businesses.map(b => (
                <MenuItem key={b._id} value={b._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    {b.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            onClick={() => setModals(prev => ({ ...prev, add: true }))}
            disabled={!token}
          >
            Add Category
          </Button>
        </Box>

        {state.error && <Alert severity="error" sx={{ mb: 2 }}>{state.error}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell></TableRow>
              ) : state.categories.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  No categories found
                </TableCell></TableRow>
              ) : (
                state.categories.map((cat, i) => (
                  <TableRow key={cat._id} hover>
                    <TableCell>{(state.page - 1) * state.pageSize + i + 1}</TableCell>
                    <TableCell>{cat.businessId?.name || 'N/A'}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.slug || '-'}</TableCell>
                    <TableCell sx={{ color: cat.status === 'active' ? 'success.main' : 'text.secondary' }}>
                      {cat.status}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => {
                          setSelected({ category: cat });
                          setModals(prev => ({ ...prev, edit: true }));
                        }}
                        size="small"
                      >
                        <Edit fontSize="inherit" />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelected({ deleteId: cat._id });
                          setModals(prev => ({ ...prev, confirm: true }));
                        }}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="inherit" />
                      </IconButton>
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
            page={state.page - 1}
            onPageChange={(_, p) => setState(prev => ({ ...prev, page: p + 1 }))}
            onRowsPerPageChange={(e) => setState(prev => ({ 
              ...prev, 
              pageSize: +e.target.value,
              page: 1 
            }))}
          />
        )}

        <CategoryModal
          open={modals.add || modals.edit}
          onClose={() => setModals(prev => ({ ...prev, add: false, edit: false }))}
          onSave={handleSave}
          category={selected.category}
          businesses={state.businesses}
          isEdit={modals.edit}
        />

        <ConfirmDialog
          open={modals.confirm}
          onClose={() => setModals(prev => ({ ...prev, confirm: false }))}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this category?"
        />

        <Snackbar
          open={modals.snackbar.open}
          autoHideDuration={6000}
          onClose={() => setModals(prev => ({ ...prev, snackbar: { ...prev.snackbar, open: false } }))}
        >
          <Alert severity={modals.snackbar.severity}>
            {modals.snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default CategoryManagement;