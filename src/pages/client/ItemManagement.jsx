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
  InputAdornment,
  LinearProgress,
  Avatar,
  Card,
  CardContent,
  Divider,
  Grid,
  useTheme
} from "@mui/material";
import { Edit, Add, Close, CloudUpload } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import MainLayout from "../../layouts/MainLayout";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const ConfirmDialog = ({ message, onConfirm, onClose, open }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
      <Typography variant="body1">{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
      <Button onClick={onClose} variant="outlined" color="inherit">
        Cancel
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const initialFormState = {
  name: "",
  description: "",
  businessId: "",
  category: "",
  image: null,
  price: "",
  status: "active",
};

const ItemManagement = () => {
  const theme = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  const token = currentUser?.token;

  const title = "Item Management";
  const [items, setItems] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogCategories, setDialogCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [filters, setFilters] = useState({
    status: "All",
    business: "",
    category: "",
  });

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = {
      page: pageNumber,
      size: pageSize,
      userId: user?._id,
      search: searchQuery,
      businessId: filters.business || undefined,
      categoryId: filters.category || undefined,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    try {
      const response = await api.get("/api/v1/items", { params });
      const data = response.data.data;
      setItems(data.data || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(
        `Failed to fetch items: ${err.response?.data?.message || err.message}`
      );
      setItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, searchQuery, filters.business, filters.category, user._id]);

  const fetchBusinesses = useCallback(async () => {
    try {
      const response = await api.get("/api/v1/businesses");
      setBusinesses(response.data.data.data || []);
    } catch (err) {
      setError(
        `Failed to fetch businesses: ${err.response?.data?.message || err.message}`
      );
      setBusinesses([]);
    }
  }, []);

  const fetchCategoriesForBusiness = useCallback(async (businessId) => {
    if (!businessId) {
      setDialogCategories([]);
      return;
    }
    try {
      const response = await api.get(`/api/v1/categories?businessId=${businessId}`);
      setDialogCategories(response.data.data.data || []);
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        category: "Could not load categories",
      }));
      setDialogCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    const fetchFilterCategories = async (businessId) => {
      if (!businessId) {
        setCategories([]);
        return;
      }
      try {
        const response = await api.get(`/api/v1/categories?businessId=${businessId}`);
        setCategories(response.data.data.data || []);
      } catch (err) {
        setCategories([]);
      }
    };

    if (filters.business) {
      fetchFilterCategories(filters.business);
    } else {
      setCategories([]);
    }
    setFilters((prev) => ({ ...prev, category: "" }));
  }, [filters.business]);

  useEffect(() => {
    if (form.businessId) {
      fetchCategoriesForBusiness(form.businessId);
    } else {
      setDialogCategories([]);
    }
  }, [form.businessId, fetchCategoriesForBusiness]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "businessId") {
        newState.category = "";
      }
      return newState;
    });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const uploadImage = async (file) => {
    if (!file) throw new Error("No file selected");
    setIsUploading(true);
    setUploadProgress(0);
    const storageRef = ref(storage, `vd-menu/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Firebase upload error:", error);
          setIsUploading(false);
          setUploadProgress(0);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setIsUploading(false);
            setUploadProgress(100);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            setIsUploading(false);
            setUploadProgress(0);
            reject(error);
          }
        }
      );
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFormErrors((prev) => ({ ...prev, image: null }));

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          image: "File size must be under 5MB.",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Invalid file type. Please select an image.",
        }));
        return;
      }

      try {
        const imageUrl = await uploadImage(file);
        setForm((prev) => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error("Image upload failed:", error);
        setFormErrors((prev) => ({
          ...prev,
          image: `Upload failed: ${error.message}`,
        }));
        setForm((prev) => ({ ...prev, image: null }));
        e.target.value = null;
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.businessId) errors.businessId = "Business is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.description.trim()) errors.description = "Description is required";
    const price = parseFloat(form.price);
    if (isNaN(price)) {
      errors.price = "Price must be a number";
    } else if (price < 0) {
      errors.price = "Price cannot be negative";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);

    const itemData = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.category,
      businessId: form.businessId,
      price: parseFloat(form.price),
      status: form.status,
      ...(form.image && { image: form.image }),
    };

    try {
      let response;
      if (editingItem) {
        response = await api.patch(`/api/v1/items/${editingItem._id}`, itemData);
      } else {
        response = await api.post("/api/v1/items", itemData);
      }

      setOpen(false);
      resetFormAndEditingState();
      fetchItems();
    } catch (err) {
      const apiError = err.response?.data?.message || err.message;
      setError(`Failed to save item: ${apiError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      businessId: item.businessId?._id || "",
      category: item.categoryId?._id || "",
      price: item.price?.toString() || "",
      status: item.status || "active",
      image: item.image || null,
    });
    setFormErrors({});
    setError(null);
    setOpen(true);
  };

  const resetFormAndEditingState = () => {
    setForm(initialFormState);
    setEditingItem(null);
    setFormErrors({});
    setError(null);
    setDialogCategories([]);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleDeleteRequest = (itemId) => {
    setDeleteId(itemId);
    setConfirmOpen(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    setError(null);
    try {
      await api.delete(`/api/v1/items/${deleteId}`);
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

  const handleOpenAddDialog = () => {
    resetFormAndEditingState();
    setOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
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

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        
        {/* Header Section */}
        <Card sx={{ mb: 3, boxShadow: theme.shadows[1] }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="600" color="text.primary">
                {title}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenAddDialog}
                disabled={isLoading || isSubmitting}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Add Item
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Filter Section */}
        <Card sx={{ mb: 3, boxShadow: theme.shadows[1] }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search Items"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Business"
                  variant="outlined"
                  size="small"
                  value={filters.business}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      business: e.target.value,
                      category: "",
                    }));
                    setPageNumber(1);
                  }}
                  disabled={isLoading || businesses.length === 0}
                >
                  <MenuItem value="">All Businesses</MenuItem>
                  {businesses?.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Category"
                  variant="outlined"
                  size="small"
                  value={filters.category}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, category: e.target.value }));
                    setPageNumber(1);
                  }}
                  disabled={isLoading || !filters.business || categories.length === 0}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories?.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card sx={{ boxShadow: theme.shadows[1] }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ width: 80 }}>Image</TableCell>
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
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} sx={{ mr: 1 }} />
                      <Typography variant="body1">Loading Items...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredItems?.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 48, height: 48 }}
                          variant="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.categoryId?.name || "N/A"} 
                          size="small" 
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography color="text.secondary">
                          ${item.price?.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          color={item.status === "active" ? "success" : "default"}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(item)}
                            size="small"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ mr: 1 }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteRequest(item._id)}
                            size="small"
                            color="error"
                            disabled={isSubmitting}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1">
                        No items found matching your criteria.
                      </Typography>
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
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog 
          open={open} 
          onClose={handleCloseDialog} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {editingItem ? "Edit Item" : "Add New Item"}
            <IconButton
              onClick={handleCloseDialog}
              disabled={isSubmitting || isUploading}
              color="inherit"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Business"
                  name="businessId"
                  value={form.businessId}
                  onChange={handleFormChange}
                  required
                  error={!!formErrors.businessId}
                  helperText={formErrors.businessId}
                  disabled={isSubmitting || isLoading || editingItem}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select a Business
                  </MenuItem>
                  {businesses.map((bus) => (
                    <MenuItem key={bus._id} value={bus._id}>
                      {bus.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                  error={!!formErrors.category}
                  helperText={formErrors.category}
                  disabled={
                    isSubmitting ||
                    !form.businessId ||
                    dialogCategories.length === 0
                  }
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select a Category
                  </MenuItem>
                  {dialogCategories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  multiline
                  rows={3}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Item Image
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.default'
                    }}
                  >
                    {form.image ? (
                      <>
                        <Box
                          component="img"
                          src={form.image}
                          alt="Preview"
                          sx={{
                            maxHeight: 150,
                            maxWidth: '100%',
                            mb: 2,
                            borderRadius: 1
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setForm(prev => ({ ...prev, image: null }))}
                          disabled={isSubmitting}
                        >
                          Remove Image
                        </Button>
                      </>
                    ) : (
                      <>
                        <CloudUpload fontSize="large" color="action" sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Drag and drop an image here, or click to select
                        </Typography>
                        <Button
                          variant="contained"
                          component="label"
                          disabled={isSubmitting || isUploading}
                        >
                          Upload Image
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          Max file size: 5MB
                        </Typography>
                      </>
                    )}
                  </Box>
                  {isUploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      <Typography variant="caption" display="block" textAlign="center">
                        Uploading: {Math.round(uploadProgress)}%
                      </Typography>
                    </Box>
                  )}
                  {formErrors.image && (
                    <Typography color="error" variant="caption">
                      {formErrors.image}
                    </Typography>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  disabled={isSubmitting}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    inputProps: { step: "0.01", min: "0" },
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {["active", "inactive"].map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              onClick={handleCloseDialog}
              disabled={isSubmitting || isUploading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : editingItem ? (
                "Update Item"
              ) : (
                "Add Item"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          open={confirmOpen}
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onClose={() => setConfirmOpen(false)}
        />
      </Box>
    </MainLayout>
  );
};

export default ItemManagement;