import { useEffect, useState } from "react";
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
  Pagination,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import api from "../../api/axiosConfig";
import MainLayout from "../../layouts/MainLayout";
import { useSelector } from "react-redux";

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

const EditCategoryModal = ({ open, category, onClose, onSave }) => {
  
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  useEffect(() => {
    setName(category?.name || "");
    setDescription(category?.description || "");
  }, [category]);

  const handleSave = () => {
    onSave({ ...category, name, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddCategoryModal = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave({ name, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoryManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
    const user = currentUser?.user;
    const token = currentUser?.token;

  const title = "Category Management";
 
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const getCategories = async () => {
    try {
      const res = await api.get(
        `api/v1/categories?page=${pageNumber}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      const data = res.data.data;
      setCategories(data);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onConfirm = async (id) => {
    await api.delete(`api/v1/categorise/${id}`),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    getCategories();
  };

  const handleEditSave = async (category) => {
    try {
      await api.patch(`api/v1/categories/${category._id}`, category) , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      getCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
    setEditModalOpen(false);
  };

  const handleAddSave = async (category) => {
    try {
      await api.post("/v1/categories", category);
      getCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
    setAddModalOpen(false);
  };

  useEffect(() => {
    getCategories();
  }, [pageNumber, pageSize]);
  console.log();
  return (
    <MainLayout>
    <Box sx={{ padding: 4 }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Typography variant="h5" fontWeight="bold">
        Welcome to {title}
      </Typography>

      <Button
        variant="contained"
        onClick={() => setAddModalOpen(true)}
        sx={{ mt: 2 }}
      >
        Add Category
      </Button>

      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
        <Typography>Rows per page:</Typography>
        <Select value={pageSize} onChange={handleLimitChange} size="small">
          {[5, 10, 20, 50].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box> */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NO</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.data?.map((category, index) => (
              <TableRow key={category._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.status}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => {
                        setEditingCategory(category);
                        setEditModalOpen(true);
                      }}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setConfirmOpen(true);
                        setDeleteId(category._id);
                      }}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={totalItems}
          page={pageNumber - 1}
          onPageChange={(_, newPage) => setPageNumber(newPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
            setPageNumber(1);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Box>
      <EditCategoryModal
        open={editModalOpen}
        category={editingCategory}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
      />
      <AddCategoryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this category?"
        onConfirm={() => onConfirm(deleteId)}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
    </MainLayout>
  );
};

export default CategoryManagement;
