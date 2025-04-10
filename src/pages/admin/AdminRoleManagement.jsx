import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  TextField,
  Tooltip,
  TablePagination,
  MenuItem,
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import { Edit, Delete } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import api from "../../api/axiosConfig";

const RoleFormDialog = ({ open, onClose, onSubmit, role, loading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (role && open) {
      setName(role.name || "");
      setDescription(role.description || "");
      setStatus(role.status || "active");
    }
  }, [role, open]);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setStatus("active");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }

    const formData = {
      ...role,
      name,
      description,
      status,
    };

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{role ? "Edit Role" : "Add Role"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDialog = ({ message, onConfirm, onClose, open, loading }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        variant="contained"
        color="error"
        onClick={onConfirm}
        disabled={loading}
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const AdminRoleManagement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  const title = "Role Management";

  const [roles, setRoles] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (roleData) => {
    setLoading(true);
    try {
      if (roleData._id) {
        const res = await api.patch(`/api/v1/roles/${roleData._id}`, roleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message);
      } else {
        const res = await api.post("/api/v1/roles", roleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message);
      }
      fetchRoles();
      setFormOpen(false);
      setSelectedRole(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await api.delete(`/api/v1/roles/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting role");
    } finally {
      setLoading(false);
    }
    setConfirmOpen(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <MainLayout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Add Role
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : roles.total > 0 ? (
                roles?.data?.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role._id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.slug}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.status}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            setSelectedRole(role);
                            setFormOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setDeleteId(role._id);
                            setConfirmOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : roles.total < 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
      </Box>

      {/* Dialogs */}
      <RoleFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedRole(null);
        }}
        onSubmit={handleCreateOrUpdate}
        role={selectedRole}
        loading={loading}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this role?"
        loading={loading}
      />
    </MainLayout>
  );
};

export default AdminRoleManagement;
