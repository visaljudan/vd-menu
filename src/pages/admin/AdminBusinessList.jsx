import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  TablePagination,
  Chip,
} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const mockBusinesses = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `Business ${i + 1}`,
  owner: `Owner ${i + 1}`,
  category: ["Retail", "Services", "Food", "Tech"][i % 4],
  items: Math.floor(Math.random() * 50) + 1,
  status: i % 3 === 0 ? "Suspended" : "Active",
}));

const AdminBusinessList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const filteredBusinesses = mockBusinesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Businesses List
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Search Businesses"
            value={search}
            onChange={handleSearchChange}
          />
        </Paper>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBusinesses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((b, index) => (
                  <TableRow key={b.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.owner}</TableCell>
                    <TableCell>{b.category}</TableCell>
                    <TableCell>{b.items}</TableCell>
                    <TableCell>
                      <Chip
                        label={b.status}
                        color={b.status === "Active" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredBusinesses.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default AdminBusinessList;
