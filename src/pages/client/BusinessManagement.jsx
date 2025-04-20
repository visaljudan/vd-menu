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
  CircularProgress, // Added for loading indication
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
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
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: pageNumber,
      limit: pageSize,
    });
    if (searchQuery) params.append("search", searchQuery);
    if (filters.status !== "All") params.append("status", filters.status);

    try {
      const response = await api.get("api/v1/businesses");
      setBusinesses(response.data.data.data || []);
      setTotalItems(response.data.data.total || 0);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError(
        `Failed to fetch businesses: ${err.response?.data?.message || err.message || "Please try again."}`
      );
      setBusinesses([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [token, pageNumber, pageSize, searchQuery, filters.status]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

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
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setAddEditDialogOpen(true);
  };

  const handleOpenEditDialog = (business) => {
    resetForm();
    setEditingBusiness(business);
    setFormState({
      telegramId: business.telegramId._id ?? "",
      name: business.name ?? "",
      description: business.description ?? "",
      location: business.location ?? "",
      status: business.status ?? "Active",
      logo: business.logo,
      image: business.image,
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

    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        !(typeof value === "string" && (key === "logo" || key === "image"))
      ) {
        formData.append(key, value);
      }
    });

    console.log("formState: ", formState);
    try {
      if (editingBusiness) {
        await api.patch(`api/v1/businesses/${editingBusiness._id}`, formState);
      } else {
        await api.post("api/v1/businesses", formState);
      }

      handleCloseAddEditDialog();
      fetchBusinesses(false);
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
      const response = await api.delete(
        `api/v1/businesses/${businessToDeleteId}`
      );
      setBusinessToDeleteId(null);
      handleCloseConfirmDeleteDialog();
      fetchBusinesses(false);
    } catch (err) {
      console.error("Error deleting business:", err);
      setError(
        `Failed to delete business: ${err.response?.data?.message || err.message || "Please try again."}`
      );
      handleCloseConfirmDeleteDialog();
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch Telegrams
  const fetchtelegrams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("api/v1/telegrams");
      setTelegrams(response.data.data);
    } catch (error) {
      console.error("Failed to fetch telegrams:", error);
      setNotification({
        open: true,
        message: `Failed to fetch telegrams: ${error.message || "Unknown error"}`,
        severity: "error",
      });
      setTelegrams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchtelegrams();
  }, [fetchtelegrams]);

  // --- Render Logic ---
  const businessesToDisplay = businesses;

  // Upload image
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
            // setProgressPercentage(progress);
          },
          (error) => reject(error),
          () => resolve()
        );
      });
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          avatar: "File size must be under 2MB.",
        });
        return;
      }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = function (e) {
        img.onload = function () {
          if (img.width >= 1000) {
            setErrors({
              ...errors,
              avatar: "Image dimensions must be 1000x1000 pixels or smaller.",
            });
            return;
          }

          uploadImage(file)
            .then((imageUrl) => {
              setFormState({ ...formState, logo: imageUrl });
            })
            .catch((error) => {
              console.error("Image upload failed:", error);
            });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          avatar: "File size must be under 2MB.",
        });
        return;
      }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = function (e) {
        img.onload = function () {
          if (img.width >= 1000) {
            setErrors({
              ...errors,
              avatar: "Image dimensions must be 1000x1000 pixels or smaller.",
            });
            return;
          }

          uploadImage(file)
            .then((imageUrl) => {
              setFormState({ ...formState, image: imageUrl });
            })
            .catch((error) => {
              console.error("Image upload failed:", error);
            });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // useEffect(() => {
  //   const fetchBusinesses = async () => {
  //     try {
  //       const response = await api.get("/api/v1/businesses");
  //       setBusinesses(response.data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch businesses:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBusinesses();
  // }, []);

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
          <Typography color="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {totalItems === 0 ? (
            <Typography color="error" sx={{ mb: 2 }} role="alert">
              Don't have data yet
            </Typography>
          ) : totalItems > 0 ? (
            businesses.map((item) => (
              <BusinessCard
                key={item._id}
                id={item._id}
                name={item.userId?.name || "No name"}
                description={item.description || "No description"}
                location={item.location || "Unknown"}
                photo={item.image || "https://via.placeholder.com/300"}
                logo={item.logo || "https://via.placeholder.com/100"}
                companyName={item.name || "Company"}
                onEdit={() => {
                  const businessToEdit = businesses.find(
                    (b) => b._id === item._id
                  );
                  if (businessToEdit) handleOpenEditDialog(businessToEdit);
                }}
                onDelete={() => handleOpenConfirmDeleteDialog(item._id)}
              />
            ))
          ) : (
            <Typography color="error" sx={{ mb: 2 }} role="alert">
              Loading...
            </Typography>
          )}
        </Box>
      </Box>

      {/* --- Add/Edit Dialog --- */}
      <Dialog
        open={isAddEditDialogOpen}
        onClose={handleCloseAddEditDialog}
        fullWidth
        maxWidth="sm"
        disableEscapeKeyDown={isSubmitting}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingBusiness ? "Edit Business" : "Add New Business"}
          <IconButton
            onClick={handleCloseAddEditDialog}
            edge="end"
            disabled={isSubmitting}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {formError && (
            <Typography color="error" sx={{ mb: 2 }} role="alert">
              {formError}
            </Typography>
          )}
          <TextField
            select
            label="Telegram ID"
            name="telegramId"
            value={formState.telegramId}
            onChange={handleFormInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled={isSubmitting}
            size="small"
          >
            {telegrams?.data?.map((telegram, index) => (
              <MenuItem key={telegram._id} value={telegram._id}>
                {telegram.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="CompanyName"
            name="name"
            value={formState.name}
            onChange={handleFormInputChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled={isSubmitting}
            size="small"
          />
          <TextField
            label="Description"
            name="description"
            value={formState.description}
            onChange={handleFormInputChange}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
            size="small"
          />
          <TextField
            label="Location"
            name="location"
            value={formState.location}
            onChange={handleFormInputChange}
            fullWidth
            sx={{ mb: 2 }} // Keep margin bottom for spacing
            disabled={isSubmitting}
            size="small"
          />
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              component="label"
              htmlFor="logo"
            >
              Logo
            </Typography>
            <TextField
              id="logo"
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              fullWidth
              disabled={isSubmitting}
              size="small"
              sx={{ mt: 0.5 }}
            />
            {formState?.logo && (
              <Box mt={1}>
                <img
                  src={formState.logo}
                  alt="Logo Preview"
                  style={{ maxHeight: 100, borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              component="label"
              htmlFor="image"
            >
              Image
            </Typography>
            <TextField
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              fullWidth
              disabled={isSubmitting}
              size="small"
              sx={{ mt: 0.5 }}
            />
            {formState?.image && (
              <Box mt={1}>
                <img
                  src={formState.image}
                  alt="Image Preview"
                  style={{ maxHeight: 100, borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>

          <TextField
            select
            label="Status"
            name="status"
            value={formState.status}
            onChange={handleFormInputChange}
            fullWidth
            required
            sx={{ mb: 2 }} // Ensure margin bottom is still present
            disabled={isSubmitting}
            size="small"
          >
            {FORM_STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button
            onClick={handleCloseAddEditDialog}
            color="inherit"
            disabled={isSubmitting}
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
