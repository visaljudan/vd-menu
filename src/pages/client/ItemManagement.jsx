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
  LinearProgress, // Added for price input
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import MainLayout from "../../layouts/MainLayout";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig"; // Ensure this is configured with base URL and potentially auth interceptors
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase"; // Ensure Firebase storage is initialized

// Confirmation Dialog Component (remains the same)
const ConfirmDialog = ({ message, onConfirm, onClose, open }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography> {/* Use Typography for consistent styling */}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

// Initial form state constant
const initialFormState = {
  name: "",
  description: "",
  businessId: "", // Added businessId
  category: "",
  image: null, 
  price: "",
  status: "Active",
};

const ItemManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user; // Assuming user object has _id
  const token = currentUser?.token; // Token for authenticated requests

  const title = "Item Management";
  const [items, setItems] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]); // Categories for the form dropdown
  const [dialogCategories, setDialogCategories] = useState([]); // Separate state for dialog categories
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false); // Dialog open state
  const [confirmOpen, setConfirmOpen] = useState(false); // Delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // ID of item to delete
  const [editingItem, setEditingItem] = useState(null); // Item being edited (_id included)
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({}); // State for form validation errors
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // General error messages (e.g., fetch errors)
  const [uploadProgress, setUploadProgress] = useState(0); // Image upload progress
  const [isUploading, setIsUploading] = useState(false); // Image upload status

  const [filters, setFilters] = useState({
    status: "All", // Consider if status filter is needed/supported by API
    business: "",
    category: "",
  });

  // --- API Request Configuration ---
  // Setup Axios instance headers for authenticated requests if not done globally
  const authApi = api; // Use the imported api instance
  // Consider adding an interceptor to `api` in `axiosConfig.js` to automatically add the token
  const getAuthHeaders = useCallback(() => {
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [token]);

  // --- Data Fetching ---

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // --- !!! Assume API supports these filters. Adjust query params as needed. ---
    const params = {
      page: pageNumber,
      size: pageSize,
      userId: user?._id, 
      search: searchQuery,
      businessId: filters.business || undefined, 
      categoryId: filters.category || undefined, 
      
    };

    // Remove undefined params
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    try {
      // --- !!! Adjust API endpoint if needed ---
      const response = await authApi.get("/api/v1/items", { params, ...getAuthHeaders() });
      const data = response.data.data;
      setItems(data.data || []); // Ensure items is always an array
      setTotalItems(data.total || 0); // Ensure total is a number
    } catch (err) {
      setError(
        `Failed to fetch items: ${err.response?.data?.message || err.message}`
      );
      setItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
    // Include all dependencies that should trigger a refetch
  }, [pageNumber, pageSize, searchQuery, filters.business, filters.category, getAuthHeaders,user._id]); // Removed user._id unless strictly necessary and stable

  const fetchBusinesses = useCallback(async () => {
    // No need for setIsLoading here if fetchItems already sets it
    try {
      // --- !!! Adjust API endpoint if needed ---
      const response = await authApi.get("/api/v1/businesses", getAuthHeaders());
      setBusinesses(response.data.data.data || []);
    } catch (err) {
      setError( // Append to existing errors or replace? Consider strategy.
        `Failed to fetch businesses: ${err.response?.data?.message || err.message}`
      );
      setBusinesses([]);
    }
  }, [getAuthHeaders]);

  // Fetch categories for a specific business (used in the form)
  const fetchCategoriesForBusiness = useCallback(async (businessId) => {
    if (!businessId) {
      setDialogCategories([]); // Clear categories if no business selected
      return;
    }
    // Consider adding a loading state for the category dropdown specifically
    try {
       // --- !!! Adjust API endpoint and params if needed ---
      const response = await authApi.get(
        `/api/v1/categories?businessId=${businessId}`, // Fetch all categories for the business
        getAuthHeaders()
      );
      setDialogCategories(response.data.data.data || []);
    } catch (err) {
       // Handle error fetching categories for the dialog (e.g., set form error)
      setFormErrors(prev => ({ ...prev, category: "Could not load categories" }));
      console.error("Failed to fetch categories for dialog:", err);
      setDialogCategories([]);
    }
  }, [getAuthHeaders]);

  // --- Effects ---

  // Fetch items when pagination, search, or filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]); // fetchItems useCallback handles its own dependencies

  // Fetch businesses on component mount
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Fetch categories for the main filter dropdown when the business filter changes
  useEffect(() => {
    // This fetches categories for the *filter* dropdown, not the dialog
    const fetchFilterCategories = async (businessId) => {
        if (!businessId) {
            setCategories([]);
            return;
        }
        try {
            const response = await authApi.get(
                `/api/v1/categories?businessId=${businessId}`, getAuthHeaders()
            );
            setCategories(response.data.data.data || []);
        } catch (err) {
            console.error("Failed to fetch filter categories:", err);
            setCategories([]);
        }
    };

    if (filters.business) {
        fetchFilterCategories(filters.business);
    } else {
        setCategories([]); // Clear filter categories if no business filter selected
    }
    // Reset category filter if business filter changes
    setFilters(prev => ({ ...prev, category: '' }));

  }, [filters.business, getAuthHeaders, authApi]);


  // Fetch categories for the *dialog form* when the business selection in the form changes
  useEffect(() => {
    if (form.businessId) {
      fetchCategoriesForBusiness(form.businessId);
    } else {
      setDialogCategories([]); // Clear if business is deselected
    }
  }, [form.businessId, fetchCategoriesForBusiness]);


  // --- Form Handling ---

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
        const newState = { ...prev, [name]: value };
        // If business changes, reset category
        if (name === 'businessId') {
            newState.category = '';
        }
        return newState;
    });
    // Clear validation error for the field being changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

   // Upload image to Firebase
  const uploadImage = async (file) => {
    if (!file) throw new Error("No file selected");
    setIsUploading(true);
    setUploadProgress(0);
    // --- Ensure unique file names or handle collisions ---
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
          reject(error); // Reject the promise on error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setIsUploading(false);
            setUploadProgress(100); // Mark as complete
            resolve(downloadURL); // Resolve the promise with the URL
          } catch (error) {
             console.error("Error getting download URL:", error);
             setIsUploading(false);
             setUploadProgress(0);
             reject(error); // Reject if getting URL fails
          }
        }
      );
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFormErrors((prev) => ({ ...prev, image: null })); // Clear previous image errors

    if (file) {
      // Basic client-side validation (optional, server should validate too)
      if (file.size > 5 * 1024 * 1024) { // Increased limit to 5MB
        setFormErrors((prev) => ({
          ...prev,
          image: "File size must be under 5MB.",
        }));
        return;
      }
      if (!file.type.startsWith('image/')) {
           setFormErrors((prev) => ({
          ...prev,
          image: "Invalid file type. Please select an image.",
        }));
        return;
      }

      // Optional: Check dimensions client-side (can be complex)
      // const img = new Image();
      // const reader = new FileReader();
      // reader.onload = (event) => {
      //   img.onload = () => {
      //     // Dimension check logic here
      //     // if (img.width > 1000 || img.height > 1000) { ... set error ... return; }
      //     // Proceed with upload if dimensions are okay
      //   };
      //   img.src = event.target.result;
      // };
      // reader.readAsDataURL(file);

      try {
        const imageUrl = await uploadImage(file);
        setForm((prev) => ({ ...prev, image: imageUrl })); // Update form state with URL
      } catch (error) {
        console.error("Image upload failed:", error);
        setFormErrors((prev) => ({
          ...prev,
          image: `Upload failed: ${error.message}`,
        }));
         setForm((prev) => ({ ...prev, image: null })); // Clear image if upload fails
         e.target.value = null; // Reset file input
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
    if (isNaN(price) || price < 0) errors.price = "Price must be a positive number";
    // Image is optional, so no validation unless required
    // if (!form.image) errors.image = "Image is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    setError(null); // Clear general errors
    if (!validateForm()) return; // Stop if validation fails

    setIsSubmitting(true);

    // Prepare data for API
    const itemData = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.category,
      businessId: form.businessId,
      price: parseFloat(form.price),
      status: form.status,
      // Only include image if it's set (it will be a URL string)
      ...(form.image && { image: form.image }),
    };

    try {
      let response;
      if (editingItem) {
        // --- !!! Ensure API uses _id in URL ---
        response = await authApi.patch(`/api/v1/items/${editingItem._id}`, itemData, getAuthHeaders());
      } else {
        response = await authApi.post("/api/v1/items", itemData, getAuthHeaders());
      }

      console.log("API Response:", response.data); // Log success response
      setOpen(false); // Close dialog
      resetFormAndEditingState();
      fetchItems(); // Refresh the list
    } catch (err) {
      console.error("Failed to save item:", err);
      // Set error message based on API response or generic message
      const apiError = err.response?.data?.message || err.message;
      setError( // Show error in the main page area or dialog? Dialog might be better.
        `Failed to save item: ${apiError}`
      );
       // Optionally set form-specific errors if the API returns field-level issues
       // if (err.response?.data?.errors) { setFormErrors(err.response.data.errors); }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dialog and Edit/Delete Handling ---

  const handleEdit = (item) => {
    setEditingItem(item); // Store the whole item, including _id and businessId
    setForm({
      name: item.name || "",
      description: item.description || "",
      businessId: item.businessId?._id || "", // Set business first
      category: item.categoryId?._id || "",   // Then set category
      price: item.price?.toString() || "",
      status: item.status || "Active",
      image: item.image || null, // Pre-fill with existing image URL
    });
    setFormErrors({}); // Clear previous form errors
    setError(null); // Clear general errors
    // Categories for the selected business will be fetched by the useEffect watching form.businessId
    setOpen(true); // Open the dialog
  };

  const resetFormAndEditingState = () => {
    setForm(initialFormState);
    setEditingItem(null);
    setFormErrors({});
    setError(null); // Clear general error too
    setDialogCategories([]); // Clear categories in dialog
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleDeleteRequest = (itemId) => {
    // --- Ensure `item._id` is passed here ---
    setDeleteId(itemId);
    setConfirmOpen(true);
    setError(null); // Clear errors before showing dialog
  };

  const handleDeleteConfirm = async () => {
    setError(null);
    // Add loading state for delete action?
    try {
       // --- Ensure API uses _id in URL ---
      await authApi.delete(`/api/v1/items/${deleteId}`, getAuthHeaders());
      setConfirmOpen(false);
      setDeleteId(null);

      // Optimistic UI update or refetch:
      // Refetch is simpler unless dealing with large datasets/slow network
      // Check if the deleted item was the last one on the current page
       if (items.length === 1 && pageNumber > 1) {
         setPageNumber(pageNumber - 1); // Go to previous page if last item deleted
       } else {
         fetchItems(); // Otherwise, just refresh the current page
       }
    } catch (err) {
      setError(
        `Failed to delete item: ${err.response?.data?.message || err.message}`
      );
      setConfirmOpen(false); // Keep dialog closable even on error
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

  // --- Pagination Handlers ---
  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage + 1); // Material UI pages are 0-indexed
  };

  const handleRowsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1); // Reset to first page when page size changes
  };

  // --- Render ---
  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}> {/* Responsive padding */}
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Align items vertically
            flexWrap: "wrap", // Allow wrapping on smaller screens
            mb: 3, // Increased margin bottom
            gap: 2, // Add gap between title and button
          }}
        >
          <Typography variant="h5" fontWeight="bold" component="h1"> {/* Use h1 for semantic heading */}
            {title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            disabled={isLoading || isSubmitting} // Disable when loading/submitting
          >
            Add Item
          </Button>
        </Box>

        {/* General Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }} // Allow search to grow
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          <TextField
            select
            label="Filter by Business"
            value={filters.business}
            onChange={(e) =>
              // Reset page number when filter changes
              { setFilters((prev) => ({ ...prev, business: e.target.value, category: '' })); setPageNumber(1); }
            }
            sx={{ width: 200 }}
            disabled={isLoading || businesses.length === 0}
            displayEmpty // Show label even when empty
            size="small"
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
            label="Filter by Category"
            value={filters.category}
            onChange={(e) =>
              // Reset page number when filter changes
              { setFilters((prev) => ({ ...prev, category: e.target.value })); setPageNumber(1); }
            }
            sx={{ width: 200 }}
            disabled={isLoading || !filters.business || categories.length === 0} // Disable if no business selected or no categories
            displayEmpty
            size="small"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories?.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Items Table */}
        <TableContainer component={Paper} elevation={2}> {/* Add subtle shadow */}
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}> {/* Light grey header */}
              <TableRow>
                {/* Added Image column */}
                <TableCell sx={{ width: '80px' }}>Image</TableCell>
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
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}> {/* Increase padding */}
                    <CircularProgress size={30} sx={{ mr: 1 }}/>
                    <Typography variant="body1">Loading Items...</Typography>
                  </TableCell>
                </TableRow>
              ) : items?.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item._id} hover> {/* Add hover effect */}
                     {/* Image Cell */}
                    <TableCell>
                       <Box
                          component="img"
                          sx={{
                            height: 40,
                            width: 40,
                            objectFit: 'cover', // Crop image nicely
                            borderRadius: 1, // Slightly rounded corners
                            border: '1px solid',
                            borderColor: 'divider' // Use theme divider color
                          }}
                          alt={item.name || 'Item image'}
                          src={item.image || '/placeholder-image.png'} // Provide a fallback placeholder
                          onError={(e) => { e.target.src = '/placeholder-image.png'; }} // Handle broken images
                        />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{item.name}</TableCell>
                    <TableCell>{item.categoryId?.name || 'N/A'}</TableCell> {/* Handle missing category name */}
                    <TableCell>${item.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === "Active" ? "success" : "default"}
                        size="small"
                        sx={{ textTransform: 'capitalize' }} // Capitalize status
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        {/* Add span for Tooltip when IconButton is disabled */}
                        <span>
                          <IconButton
                            onClick={() => handleEdit(item)}
                            size="small"
                            color="primary" // Use theme color
                            disabled={isSubmitting} // Disable while another action is in progress
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                         <span>
                          <IconButton
                            // --- Pass item._id to delete handler ---
                            onClick={() => handleDeleteRequest(item._id)}
                            size="small"
                            color="error" // Use theme color
                            disabled={isSubmitting}
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                         </span>
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

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalItems}
          page={pageNumber - 1} // 0-based index for component
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]} // Added more options
          sx={{ mt: 2 }} // Add margin top
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1 }}> {/* Reduce bottom padding */}
          {editingItem ? "Edit Item" : "Add Item"}
          <IconButton
            aria-label="close" // Accessibility
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 12, top: 10 }} // Adjust position slightly
            disabled={isSubmitting || isUploading}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Display general submit errors here */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {/* Use Box for layout within DialogContent */}
          <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}> {/* Increased gap */}
              <TextField
              select
              label="Business"
              name="businessId"
              value={form.businessId}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.businessId}
              helperText={formErrors.businessId}
              disabled={isSubmitting || isLoading || editingItem} 
              size="small"
            >
               <MenuItem value="" disabled><em>Select a Business</em></MenuItem> {/* Placeholder */}
              {businesses.map((bus) => (
                <MenuItem key={bus._id} value={bus._id}>
                  {bus.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.category}
              helperText={formErrors.category}
              disabled={isSubmitting || !form.businessId || dialogCategories.length === 0} 
              size="small"
            >
              <MenuItem value="" disabled><em>Select a Category</em></MenuItem> 
              {dialogCategories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={isSubmitting}
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              fullWidth
              required
              multiline
              rows={3} 
              error={!!formErrors.description}
              helperText={formErrors.description}
              disabled={isSubmitting}
              size="small"
            />

            {/* Image Upload Field */}
            <Box>
              <Typography variant="subtitle2" gutterBottom component="label" htmlFor="item-image-upload">
                Item Image (Optional, max 5MB)
              </Typography>
              <TextField
                id="item-image-upload"
                type="file"
                name="imageFile" // Use different name to avoid conflict with form.image URL state
                accept="image/*"
                onChange={handleImageChange}
                fullWidth
                size="small"
                sx={{ mt: 0.5 }}
                error={!!formErrors.image}
                helperText={formErrors.image || (isUploading ? `Uploading: ${uploadProgress.toFixed(0)}%` : '')}
                disabled={isSubmitting || isUploading}
                InputLabelProps={{ shrink: true }} // Keep label floated
              />
              {/* Image Preview */}
              {form.image && !isUploading && ( // Show preview if URL exists and not currently uploading
                <Box mt={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={form.image}
                    alt="Image Preview"
                    style={{ maxHeight: 60, maxWidth: 60, borderRadius: 4, objectFit: 'cover' }}
                  />
                  <Typography variant="caption">Current Image</Typography>
                   {/* Add button to remove image */}
                  <Button size="small" color="error" onClick={() => setForm(prev => ({ ...prev, image: null}))} disabled={isSubmitting}>
                      Remove
                  </Button>
                </Box>
              )}
               {/* Show progress bar during upload */}
               {isUploading && (
                 <Box sx={{ width: '100%', mt: 1 }}>
                   <LinearProgress variant="determinate" value={uploadProgress} />
                 </Box>
               )}
            </Box>

            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleFormChange}
              fullWidth
              required
              error={!!formErrors.price}
              helperText={formErrors.price}
              disabled={isSubmitting}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { step: "0.01", min: "0" } // Allow decimals, prevent negative
              }}
            />
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleFormChange}
              fullWidth
              disabled={isSubmitting}
              size="small"
            >
              {/* Ensure values match backend expectations */}
              {["Active", "Inactive"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}> {/* Add padding */}
          <Button onClick={handleCloseDialog} disabled={isSubmitting || isUploading}>Cancel</Button>
          <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading} // Disable while submitting or uploading
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit"/>
                  {editingItem ? "Updating..." : "Adding..."}
                 </>
              ) : (
                editingItem ? "Update Item" : "Add Item"
              )}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this item? This action cannot be undone." // More specific message
        onConfirm={handleDeleteConfirm}
        onClose={() => setConfirmOpen(false)} // Ensure it can be closed
      />
    </MainLayout>
  );
};

export default ItemManagement;