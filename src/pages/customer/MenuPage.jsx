import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Container,
  Alert,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api/axiosConfig";
import Loading from "../../components/Loading";

const MenuPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.user;
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [business, setBusiness] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  const fetchBusiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/v1/businesses/${id}`);
      setBusiness(response.data.data || []);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError(`Failed to fetch businesses: ${err.response?.data?.message || err.message || "Please try again."}`);
      setBusiness([]);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/v1/categories?businessId=${id}`);
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(`Failed to fetch categories: ${err.response?.data?.message || err.message || "Please try again."}`);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/v1/items?userId=${user._id}`);
      setItems(response.data.data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError(`Failed to fetch items: ${err.response?.data?.message || err.message || "Please try again."}`);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (id) {
      fetchBusiness();
      fetchCategories();
      fetchItems();
    }
  }, [id, fetchBusiness, fetchCategories, fetchItems]);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoryId._id === selectedCategory)
    : items;

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(cartItem => cartItem._id === item._id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Loading />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
        <Box sx={{ position: "relative" }}>
          <img
            src={business?.image}
            alt="cover"
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
          <Avatar
            src={business?.logo}
            alt="logo"
            sx={{
              width: 100,
              height: 100,
              position: "absolute",
              left: "50%",
              bottom: -50,
              transform: "translateX(-50%)",
              border: "4px solid white",
              backgroundColor: "white",
              zIndex: 10,
            }}
          />
        </Box>
        <Typography variant="h5" sx={{ mt: 8, fontWeight: "bold" }}>
          {business?.name}
        </Typography>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mb: 4 }}>
          <Chip
            label="All"
            clickable
            onClick={() => setSelectedCategory(null)}
            color={selectedCategory === null ? "primary" : "default"}
          />
          {categories.data?.map((cat) => (
            <Chip
              key={cat._id}
              label={cat.name}
              clickable
              onClick={() => setSelectedCategory(cat._id)}
              color={selectedCategory === cat._id ? "primary" : "default"}
            />
          ))}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          {filteredItems?.length === 0 ? (
            <Typography align="center" variant="h6" sx={{ mt: 4 }}>
              No items found in this category.
            </Typography>
          ) : (
            filteredItems.data?.map((item) => (
              <Grid key={item._id} item xs={12} sm={6} md={5}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        component={Link}
                        to={`/item/${item._id}`}
                      >
                        View Item
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* === Show Cart Items Here === */}
        {cart.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>🛒 Your Cart</Typography>
            {cart.map((cartItem) => (
              <Box 
                key={cartItem._id} 
                sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  p: 1, 
                  borderBottom: "1px solid #ccc" 
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{cartItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {cartItem.quantity}
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  ${(cartItem.price * cartItem.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MenuPage;
