import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Container, Button, Box } from "@mui/material";
import { Helmet } from "react-helmet";

// Replace with the actual Mocko API endpoint
const apiUrl = "https://list.free.mockoapp.net/card";

const CartPage = () => {
  const title = " Products ";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the products data from the Mocko API
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setProducts(data); // Assuming the response is an array of products
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Logic for adding to cart (can be integrated with state or Redux)
    console.log(`Added ${product.name} to the cart`);
  };

  if (loading) {
    return <Typography variant="h6">Loading products...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Helmet>
              <title>{title}</title>
            </Helmet>
            <Typography variant="h5" fontWeight="bold">
              Welcome to {title}
            </Typography>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                <CardMedia component="img" height="200" image={product.image} alt={product.name} />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
