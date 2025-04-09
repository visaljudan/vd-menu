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
  TablePagination,
} from "@mui/material";
import { Edit, Add, Close } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Helmet } from "react-helmet";
import MainLayout from "../../layouts/MainLayout";

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

export default function BusinessManagement() {
  const { currentUser } = useSelector((state) => state.user);
    const user = currentUser?.user;
    const token = currentUser?.token;

  const title = "Business Management";
  const [totalItems, setTotalItems] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "All" });
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    address: "",
    contact: "",
    status: "Active",
  });

  const getBusinesses = async () => {
    try {
      const res = await api.get(
        `api/v1/businesses?page=${pageNumber}&limit=${pageSize}`
      );
      const data = res.data.data;
      setBusinesses(data);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editingBusiness) {
      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === editingBusiness.id
            ? { ...business, ...form }
            : business
        )
      );
    } else {
      setBusinesses((prev) => [
        ...prev,
        { ...form, id: prev.length + 1, type: "Company" },
      ]);
    }
    setOpen(false);
    setForm({
      name: "",
      tagline: "",
      description: "",
      address: "",
      contact: "",
      status: "Active",
    });
    setEditingBusiness(null);
  };

  const handleDelete = () => {
    setBusinesses((prev) =>
      prev.filter((business) => business.id !== deleteId)
    );
    setConfirmOpen(false);
  };

  const filteredBusinesses = businesses.filter(
    ({ name, status }) =>
      (filters.status === "All" || status === filters.status) &&
      name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Typography variant="h5" fontWeight="bold">
          Welcome to {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Business
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          sx={{ width: 150 }}
        >
          {["All", "Active", "Inactive"].map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {[
                "ID",
                "Company / Brand Name",
                "Tagline",
                "Description",
                "Address",
                "Contact",
                "Status",
                "Actions",
              ].map((head) => (
                <TableCell key={head}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusinesses.map(
              ({
                id,
                name,
                tagline,
                description,
                address,
                contact,
                status,
              }) => (
                <TableRow key={id}>
                  {[
                    id,
                    name,
                    tagline,
                    description,
                    address,
                    contact,
                    <Chip
                      label={status}
                      color={status === "Active" ? "success" : "default"}
                      size="small"
                    />,
                  ].map((item, i) => (
                    <TableCell key={i}>{item}</TableCell>
                  ))}
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => {
                          setEditingBusiness({
                            id,
                            name,
                            tagline,
                            description,
                            address,
                            contact,
                            status,
                          });
                          setForm({
                            id,
                            name,
                            tagline,
                            description,
                            address,
                            contact,
                            status,
                          });
                          setOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteId(id);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingBusiness ? "Edit Business" : "Add Business"}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {[
            "name",
            "tagline",
            "description",
            "address",
            "contact",
            "status",
          ].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              {...(field === "status" && {
                select: true,
                children: ["Active", "Inactive"].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                )),
              })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingBusiness ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
    </MainLayout>
  );
}
