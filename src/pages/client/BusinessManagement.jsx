import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
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
  Grid,
  Alert,
} from "@mui/material";
import { Edit, Add, Close, CloudUpload } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";
import BusinessCard from "../../components/BusinessCard";

// --- Constants ---
const COMPONENT_TITLE = "Business Management";
const API_ENDPOINT = "/api/v1/businesses";
const STATUS_OPTIONS = ["All", "active", "inactive"];
const FORM_STATUS_OPTIONS = ["active", "inactive"];
const TABLE_HEADERS = [
  "ID",
  "Name",
  "Description",
  "Location",
  "Status",
  "Actions",
];
const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
const INITIAL_FORM_STATE = {
  telegramId: "",
  name: "",
  description: "",
  location: "",
  logo: null,
  image: null,
  status: "active",
};

// --- Helper Components ---
const ConfirmDialog = ({ message, onConfirm, onClose, open, isLoading }) => (
  <Dialog open={open} onClose={!isLoading ? onClose : undefined}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit" disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={onConfirm}
        disabled={isLoading}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {isLoading ? "Deleting..." : "Confirm"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default function BusinessManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const [telegrams, setTelegrams] = useState([]);
  const [errors, setErrors] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: STATUS_OPTIONS[0] });

  const [isAddEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [businessToDeleteId, setBusinessToDeleteId] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: pageNumber,
      limit: pageSize,
    });
    if (searchQuery) params.append("search", searchQuery);
    if (filters.status !== "All") params.append("status", filters.status);

    try {
      const response = await api.get(`${API_ENDPOINT}?${params.toString()}`);
      setBusinesses(response.data.data || []);
      setTotalItems(response.data.total || 0);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError(
        `Failed to fetch businesses: ${
          err.response?.data?.message || err.message || "Please try again."
        }`
      );
      setBusinesses([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize, searchQuery, filters.status]);

  const fetchTelegrams = useCallback(async () => {
    try {
      const response = await api.get("api/v1/telegrams");
      setTelegrams(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Failed to fetch telegrams:", error);
      setError(
        `Failed to fetch telegrams: ${
          error.message || "Unknown error"
        }`
      );
      setTelegrams([]);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
    fetchTelegrams();
  }, [fetchBusinesses, fetchTelegrams]);

  // --- Event Handlers ---
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPageNumber(1);
  };

  const handleFormInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "file" ? (files ? files[0] : null) : value,
    }));
    if (formError) setFormError(null);
  };

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
    setEditingBusiness(null);
    setFormError(null);
    setErrors({});
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setAddEditDialogOpen(true);
  };

  const handleOpenEditDialog = (business) => {
    setEditingBusiness(business);
    setFormState({
      telegramId: business.telegramId?._id || "",
      name: business.name || "",
      description: business.description || "",
      location: business.location || "",
      status: business.status || "active",
      logo: business.logo || null,
      image: business.image || null,
    });
    setAddEditDialogOpen(true);
  };

  const handleCloseAddEditDialog = () => {
    if (isSubmitting) return;
    setAddEditDialogOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      let response;
      if (editingBusiness) {
        response = await api.patch(
          `${API_ENDPOINT}/${editingBusiness._id}`,
          formState
        );
      } else {
        response = await api.post(API_ENDPOINT, formState);
      }

      handleCloseAddEditDialog();
      fetchBusinesses();
    } catch (err) {
      console.error(
        `Error ${editingBusiness ? "updating" : "adding"} business:`,
        err
      );
      setFormError(
        `Failed to ${editingBusiness ? "update" : "add"} business. ${
          err.response?.data?.message ||
          err.message ||
          "Please check details and try again."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConfirmDeleteDialog = (id) => {
    setBusinessToDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    if (isDeleting) return;
    setConfirmDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await api.delete(`${API_ENDPOINT}/${businessToDeleteId}`);
      setBusinessToDeleteId(null);
      handleCloseConfirmDeleteDialog();
      fetchBusinesses();
    } catch (err) {
      console.error("Error deleting business:", err);
      setError(
        `Failed to delete business: ${
          err.response?.data?.message || err.message || "Please try again."
        }`
      );
      handleCloseConfirmDeleteDialog();
    } finally {
      setIsDeleting(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      if (!file) throw new Error("No file selected");
      const storageRef = ref(storage, `vd-menu/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => reject(error),
          () => resolve()
        );
      });
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        logo: "File size must be under 2MB.",
      });
      return;
    }

    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = async function (e) {
        img.onload = async function () {
          if (img.width > 1000 || img.height > 1000) {
            setErrors((prev) => ({
              ...prev,
              logo: "Image dimensions must be 1000x1000 pixels or smaller.",
            }));
            return;
          }

          try {
            const imageUrl = await uploadImage(file);
            setFormState((prev) => ({ ...prev, logo: imageUrl }));
            setErrors((prev) => ({ ...prev, logo: null }));
          } catch (error) {
            console.error("Image upload failed:", error);
            setErrors((prev) => ({
              ...prev,
              logo: "Failed to upload image. Please try again.",
            }));
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image processing failed:", error);
      setErrors((prev) => ({
        ...prev,
        logo: "Failed to process image. Please try again.",
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "File size must be under 2MB.",
      }));
      return;
    }

    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = async function (e) {
        img.onload = async function () {
          if (img.width > 1000 || img.height > 1000) {
            setErrors((prev) => ({
              ...prev,
              image: "Image dimensions must be 1000x1000 pixels or smaller.",
            }));
            return;
          }

          try {
            const imageUrl = await uploadImage(file);
            setFormState((prev) => ({ ...prev, image: imageUrl }));
            setErrors((prev) => ({ ...prev, image: null }));
          } catch (error) {
            console.error("Image upload failed:", error);
            setErrors((prev) => ({
              ...prev,
              image: "Failed to upload image. Please try again.",
            }));
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image processing failed:", error);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to process image. Please try again.",
      }));
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{COMPONENT_TITLE}</title>
      </Helmet>

      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* --- Header --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 3,
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            {COMPONENT_TITLE}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            disabled={isLoading || isSubmitting}
          >
            Add Business
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: "200px" }}
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
        </Box>
        {/* --- Display General Errors --- */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {isLoading ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={24} />
                <Typography>Loading Items...</Typography>
              </Box>
            </Box>
          ) : businesses.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No businesses found
            </Typography>
          ) : (
            businesses?.data?.map((item) => (
              <BusinessCard
                key={item._id}
                id={item._id}
                name={item.name || "No name"}
                description={item.description || "No description"}
                location={item.location || "Unknown"}
                photo={item.image || "https://via.placeholder.com/300"}
                logo={item.logo || "https://via.placeholder.com/100"}
                companyName={item.name || "Company"}
                onEdit={() => handleOpenEditDialog(item)}
                onDelete={() => handleOpenConfirmDeleteDialog(item._id)}
              />
            ))
          )}
        </Box>
      </Box>

      {/* --- Add/Edit Business Dialog --- */}
      <Dialog
        open={isAddEditDialogOpen}
        onClose={handleCloseAddEditDialog}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={isSubmitting}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[5],
          },
        }}
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight="medium">
            {editingBusiness ? "Edit Business" : "Add New Business"}
          </Typography>
          <IconButton
            onClick={handleCloseAddEditDialog}
            edge="end"
            disabled={isSubmitting}
            sx={{ color: "primary.contrastText" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent dividers sx={{ py: 3, px: 3 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Telegram ID */}
            <Grid item xs={12}>
              <TextField
                select
                label="Telegram ID"
                name="telegramId"
                value={formState.telegramId}
                onChange={handleFormInputChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
               <MenuItem value="" disabled>
                    Select a Category
                  </MenuItem>
                  {telegrams?.data?.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            {/* Company Name */}
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                name="name"
                value={formState.name}
                onChange={handleFormInputChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formState.description}
                onChange={handleFormInputChange}
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting}
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={formState.location}
                onChange={handleFormInputChange}
                fullWidth
                disabled={isSubmitting}
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Logo Upload */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom component="div">
                  Logo
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  Upload Logo
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    hidden
                  />
                </Button>
                {errors.logo && (
                  <Typography color="error" variant="caption">
                    {errors.logo}
                  </Typography>
                )}
                {formState.logo && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={formState.logo}
                      alt="Logo Preview"
                      style={{
                        maxHeight: 120,
                        maxWidth: "100%",
                        borderRadius: 1,
                        border: "1px solid #eee",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom component="div">
                  Image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </Button>
                {errors.image && (
                  <Typography color="error" variant="caption">
                    {errors.image}
                  </Typography>
                )}
                {formState.image && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={formState.image}
                      alt="Image Preview"
                      style={{
                        maxHeight: 120,
                        maxWidth: "100%",
                        borderRadius: 1,
                        border: "1px solid #eee",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <TextField
                select
                label="Status"
                name="status"
                value={formState.status}
                onChange={handleFormInputChange}
                fullWidth
                required
                disabled={isSubmitting}
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                {FORM_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseAddEditDialog}
            color="inherit"
            disabled={isSubmitting}
            sx={{ mr: 1, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{ px: 3 }}
          >
            {isSubmitting ? "Saving..." : editingBusiness ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Confirmation Dialog --- */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        message="Are you sure you want to delete this business? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseConfirmDeleteDialog}
        isLoading={isDeleting}
      />
    </MainLayout>
  );
}