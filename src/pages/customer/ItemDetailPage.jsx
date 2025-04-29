import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Container,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  ArrowBack,
  Info,
  LocalOffer,
} from "@mui/icons-material";
import api from "../../api/axiosConfig";
import { useCart } from "../../contexts/CartContext";
import CartSummaryBar from "../../components/CartSummaryBar";

const ItemDetailPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`api/v1/items/${id}`);
        const itemData = response.data.data;
        setItem(itemData);

        // // Fetch category name if categoryId exists
        // if (itemData.categoryId) {
        //   try {
        //     const categoryResponse = await api.get(`/api/v1/items/${itemData.categoryId}`);
        //     setCategoryName(categoryResponse.data.data.name || '');
        //   } catch (categoryError) {
        //     console.error("Error fetching category:", categoryError);
        //   }
        // }

        // // Fetch business name if businessId exists
        // if (itemData.businessId) {
        //   try {
        //     const businessResponse = await api.get(`api/v1/items/${itemData.businessId}`);
        //     setBusinessName(businessResponse.data.data.name || '');
        //   } catch (businessError) {
        //     console.error("Error fetching business:", businessError);
        //   }
        // }

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
      <Container
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
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

  // Determine status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      active: { text: "In Stock", color: "success" },
      inactive: { text: "Out of Stock", color: "error" },
      discontinued: { text: "Discontinued", color: "warning" },
      preorder: { text: "Pre-Order", color: "info" },
    };
    return (
      statusMap[status.toLowerCase()] || { text: "Unknown", color: "default" }
    );
  };

  const statusInfo = getStatusDisplay(item.status);

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
                width: "100%",
                height: "auto",
                maxHeight: 500,
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Details section */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
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

              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                ${item.price.toFixed(2)}
              </Typography>

              <Chip
                label={statusInfo.text}
                color={statusInfo.color}
                size="small"
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {item.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Tags section */}
              {item.tags && item.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocalOffer fontSize="small" /> Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {item.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Additional info from meta */}
              {item.meta?.additionalInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Info fontSize="small" /> Additional Information
                  </Typography>
                  <Typography variant="body2">
                    {item.meta.additionalInfo}
                  </Typography>
                </Box>
              )}

              {/* Category and Business info */}
              <Box sx={{ mb: 3 }}>
                {categoryName && (
                  <Typography variant="body2" paragraph>
                    <strong>Category:</strong> {categoryName}
                  </Typography>
                )}
                {businessName && (
                  <Typography variant="body2">
                    <strong>Business:</strong> {businessName}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  disabled={item.status !== "active"}
                  sx={{ flexGrow: 1 }}
                  onClick={() => addToCart(item)}
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
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Status:</strong> {item.status}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Business ID:</strong> {item.businessId.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <strong>Category ID:</strong> {item.categoryId.name}
        </Typography>
      </Box>
      <Box sx={{ mt: 10 }}>
        <CartSummaryBar />
      </Box>
    </Container>
  );
};

export default ItemDetailPage;
