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
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import { toast } from "react-toastify";

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
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  const token = currentUser?.token;

  const title = "User Management";

  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState();
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
        `/v1/users?page=${pageNumber}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.data);
      setTotalItems(res.data.data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response.data.message);
    }
    setConfirmOpen(false);
  };

  useEffect(() => {
    getUsers();
  }, [pageNumber, pageSize]);

  return (
    <MainLayout>
      <Box sx={{ padding: 4 }}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Welcome to {title}
        </Typography>
        <Button variant="contained" component={Link} to="/admin/users/0">
          Add User
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Date Create</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.total > 0 ? (
                users?.data?.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.roleId.name}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      {new Date(user.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          component={Link}
                          to={`/admin/users/${user._id}`}
                        >
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
                ))
              ) : users.total < 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    style={{ color: "red" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              )}
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
        <ConfirmDialog
          open={confirmOpen}
          message="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setConfirmOpen(false)}
        />
      </Box>
    </MainLayout>
  );
};

export default AdminUserManagement;
