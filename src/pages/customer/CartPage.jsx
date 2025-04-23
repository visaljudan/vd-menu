import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import api from "../../api/axiosConfig";

const ItemCard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/api/v1/items');
        setItems(response.data.data);
         // Assuming the data is in response.data.data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'Left', mb: 4 }}>
          Menu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2 }}>
          Category
        </Typography>
      
        <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2 }}>
          Business
        </Typography>
    </Box>
    <Box display="flex" flexWrap="wrap" gap={3} p={2}>
      {items.data.map((item) => (  // Changed from items.data.map to items.map
        <Card key={item.id} sx={{ maxWidth: 200, width: '100%' }}>
          <CardMedia
            component="img"
            height="190"
            image={item.image || '/placeholder-image.jpg'}
            alt={item.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h3">
              {item.name}
            </Typography>
            <Typography  variant="body2" color="text.secondary" gutterBottom>
              {item.description}
            </Typography>
            
            {/* <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Category: {item.categoryId.name || item.category_Id || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Business: {item.business?.name || item.business_Id || 'N/A'}
              </Typography>
            </Box> */}
            
            {/* <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">
                ${item.price?.toFixed(2)}
              </Typography>
              <Chip
                label={item.status}
                color={
                  item.status === 'active' ? 'success' : 
                  item.status === 'pending' ? 'warning' : 'error'
                }
                size="small"
              />
            </Box> */}
            <Box sx={{ p: 3, textAlign: 'center',  }}>
                <Button variant="contained" size="small">
                  + ORDER NOW
                </Button>
              </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
    </Box>
  );
};

export default ItemCard;