import React from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TablePagination,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Sample data - replace with your actual data source
const menuItems = [
  {
    id: 1,
    categoryId: 101,
    businessId: 1001,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://source.unsplash.com/random/300x200/?pizza'
  },
  {
    id: 2,
    categoryId: 101,
    businessId: 1001,
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza with spicy pepperoni and mozzarella',
    price: 14.99,
    image: 'https://source.unsplash.com/random/300x200/?pepperoni,pizza'
  },
  {
    id: 3,
    categoryId: 102,
    businessId: 1001,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons and parmesan',
    price: 8.99,
    image: 'https://source.unsplash.com/random/300x200/?salad'
  },
  {
    id: 4,
    categoryId: 103,
    businessId: 1001,
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 6.99,
    image: 'https://source.unsplash.com/random/300x200/?brownie'
  },
  {
    id: 5,
    categoryId: 101,
    businessId: 1002,
    name: 'Vegetarian Pizza',
    description: 'Pizza with assorted vegetables and mozzarella',
    price: 13.99,
    image: 'https://source.unsplash.com/random/300x200/?vegetarian,pizza'
  },
  {
    id: 6,
    categoryId: 102,
    businessId: 1002,
    name: 'Greek Salad',
    description: 'Salad with tomatoes, cucumber, olives, and feta cheese',
    price: 9.99,
    image: 'https://source.unsplash.com/random/300x200/?greek,salad'
  },
];

// Styled component for the price cell
const PriceTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.success.main,
}));

const MenuTablePage = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Menu Items
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search menu items"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>
      
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="menu items table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Business</TableCell>
              <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                    {item.name}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`Category ${item.categoryId}`} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`Business ${item.businessId}`} 
                      size="small" 
                      variant="outlined" 
                      color="secondary"
                    />
                  </TableCell>
                  <PriceTableCell align="right">
                    ${item.price.toFixed(2)}
                  </PriceTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default MenuTablePage;