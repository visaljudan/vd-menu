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
import api from "../../api/axiosConfig"; // Ensure this path is correct
import AdminDashboard from "../../components/AdminDashboard";

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

const AdminUserManagement = () => {
  const title = "User Management";

  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const handlePageChange = (_event, newPage) => {
    setPageNumber(newPage);
  };

  const handleLimitChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const getUsers = async () => {
    try {
      const res = await api.get(
        `/v1/users?page=${pageNumber}&limit=${pageSize}`
      );
      setUsers(res.data.data);
      setTotalItems(res.data.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/users/${id}`);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setConfirmOpen(false);
  };

  useEffect(() => {
    getUsers();
  }, [pageNumber, pageSize]);

  console.log(pageSize);
  return (
    <AdminDashboard>
      <Box sx={{ padding: 4 }}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Welcome to {title}
        </Typography>

        <Button variant="contained" onClick={() => setEditingUser({})}>
          Add User
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <Typography>Rows per page:</Typography>
          <Select value={pageSize} onChange={handleLimitChange} size="small">
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.data?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.updatedAt}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditingUser(user)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          setConfirmOpen(true);
                          setDeleteId(user._id);
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

        <Pagination
          count={Math.ceil(totalItems / pageSize)}
          page={pageNumber}
          onChange={handlePageChange}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />

        <ConfirmDialog
          open={confirmOpen}
          message="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setConfirmOpen(false)}
        />
      </Box>
    </AdminDashboard>
  );
};

export default AdminUserManagement;
