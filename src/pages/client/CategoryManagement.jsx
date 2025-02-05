import { useState, useEffect } from "react";
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
  Pagination
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from 'react-helmet';

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

export default function CategoryManagementPage() {
  const title = "Category Management";
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://list.free.mockoapp.net/Category")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = () => {
    const newCategory = {
      id: isEditMode ? editingCategory.id : categories.length + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      status,
      type: "Service",
    };
    setCategories((prev) =>
      isEditMode
        ? prev.map((cat) => (cat.id === editingCategory.id ? newCategory : cat))
        : [...prev, newCategory]
    );
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setStatus("Active");
    setIsEditMode(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setIsEditMode(true);
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setStatus(category.status);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    setConfirmOpen(false);
  };

  const filteredCategories = categories.filter(
    (category) =>
      (filterType === "All" || category.type === filterType) &&
      (filterStatus === "All" || category.status === filterStatus) &&
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Helmet>
          <title>{title}</title>
        </Helmet>
        <Typography variant="h5" fontWeight="bold">
          Welcome to {title}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setOpen(true); clearForm(); }}>Add Category</Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <TextField select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <MenuItem value="All">All Types</MenuItem>
          <MenuItem value="Service">Service</MenuItem>
          <MenuItem value="Freelancer">Freelancer</MenuItem>
        </TextField>
        <TextField select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Chip label={category.status} color={category.status === "Active" ? "success" : "default"} size="small" />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(category)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => { setConfirmOpen(true); setDeleteId(category.id); }} color="error">
                      <DeleteTwoToneIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredCategories.length / itemsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEditMode ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Slug" fullWidth value={slug} disabled sx={{ mb: 2 }} />
          <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
          <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{isEditMode ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this category?"
        onConfirm={() => handleDelete(deleteId)}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
