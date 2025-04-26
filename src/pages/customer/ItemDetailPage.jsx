import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Rating,
  Container,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  ArrowBack
} from '@mui/icons-material';
import api from "../../api/axiosConfig";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/items/${id}`);
        setItem(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details");
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="error">
          {error}
        </Typography>
        <Button 
          startIcon={<ArrowBack />} 
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Back to products
        </Button>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Item not found
        </Typography>
        <Button 
          startIcon={<ArrowBack />} 
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Back to products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        sx={{ mb: 2 }}
        onClick={() => window.history.back()}
      >
        Back to products
      </Button>
      
      <Card elevation={0} sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          {/* Image section */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              alt={item.name}
              image={item.image}
              sx={{ 
                borderRadius: 1,
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'cover'
              }}
            />
          </Grid>
          
          {/* Details section */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {item.name}
                </Typography>
                <IconButton 
                  aria-label="add to favorites"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>
              
              {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={item.rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({item.reviews} reviews)
                </Typography>
              </Box> */}
              
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                ${item.price.toFixed(2)}
              </Typography>
              
              {/* <Chip 
                label={item.inStock ? 'In Stock' : 'Out of Stock'} 
                color={item.inStock ? 'success' : 'error'} 
                size="small" 
                sx={{ mb: 3 }}
              /> */}
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {item.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {item.colors && item.colors.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Colors:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {item.colors.map(color => (
                      <Chip 
                        key={color} 
                        label={color} 
                        variant="outlined" 
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {item.features && item.features.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {item.features.map((feature, index) => (
                      <li key={index}>
                        <Typography variant="body2">{feature}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<ShoppingCart />}
                  disabled={!item.inStock}
                  sx={{ flexGrow: 1 }}
                >
                  Add to Cart
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      
      {/* Additional information section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>
        {item.category && (
          <Typography variant="body2" color="text.secondary" paragraph>
            Category: {item.category}
          </Typography>
        )}
        {item.additionalDetails && (
          <Typography variant="body2" color="text.secondary">
            {item.additionalDetails}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ItemDetailPage;