import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  CardMedia,
  IconButton,
  Paper,
  Divider,
  Avatar,
  Chip,
  TextField,
  Snackbar,
  Alert,
  Badge
} from "@mui/material";
import { useCart } from "../../contexts/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TelegramIcon from "@mui/icons-material/Telegram";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [clientContact, setClientContact] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1);
      } else {
        removeFromCart(itemId);
      }
    }
  };

  const sendToTelegram = async () => {
    if (!clientContact) {
      setSnackbar({
        open: true,
        message: "Please enter client contact information",
        severity: "error"
      });
      return;
    }

    try {
      const TELEGRAM_BOT_TOKEN = "8024094916:AAGbPgoaBeYlMboDf_PEDyUAprmSmBTIPIs";
      const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      // Create message using HTML formatting
      const cartItemsText = cartItems.map(item => {
        return `<b>${item.name}</b> - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
      }).join('\n');
      
      const message = `
<b>📋 New Order</b>
-------------------------
${cartItemsText}
-------------------------
<b>Total: $${totalPrice.toFixed(2)}</b>

<b>Client:</b> ${clientContact}
`;
      
      const chatId = clientContact.startsWith('@') ? clientContact : clientContact;
      
      const response = await fetch(TELEGRAM_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setSnackbar({
          open: true,
          message: "Order sent to client successfully!",
          severity: "success"
        });
        clearCart();
        setClientContact("");
      } else {
        throw new Error(data.description || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      setSnackbar({
        open: true,
        message: `Failed to send: ${error.message}`,
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          background: "linear-gradient(145deg, #f9f9f9 0%, #f3f3f3 100%)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.05)"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ 
              mr: 2,
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.03)",
              }
            }}
            onClick={() => window.history.back()}
          >
            Continue Shopping
          </Button>
          <Typography variant="h4" fontWeight="700" color="primary" sx={{ flexGrow: 1 }}>
            Your Cart
          </Typography>
          <Badge badgeContent={cartItems.length} color="primary" sx={{ mr: 1 }}>
            <ShoppingCartIcon color="primary" />
          </Badge>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {cartItems.length === 0 ? (
          <Box sx={{ 
            textAlign: "center", 
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3
          }}>
            <Avatar sx={{ width: 80, height: 80, backgroundColor: "rgba(25, 118, 210, 0.1)" }}>
              <ShoppingCartIcon sx={{ fontSize: 40, color: "primary.main" }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary">
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: { xs: "none", md: "flex" }, mb: 2, px: 2 }}>
              <Grid container>
                <Grid item md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Product</Typography>
                </Grid>
                <Grid item md={2} sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold">Price</Typography>
                </Grid>
                <Grid item md={2} sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold">Quantity</Typography>
                </Grid>
                <Grid item md={2} sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                </Grid>
              </Grid>
            </Box>

            <Paper 
              elevation={0}
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              {cartItems.map((item, index) => (
                <React.Fragment key={item._id}>
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              overflow: "hidden",
                              mr: 2,
                              flexShrink: 0,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="80"
                              image={item.image || "https://via.placeholder.com/80"}
                              alt={item.name}
                              sx={{ objectFit: "cover", height: "100%" }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Chip 
                              label="In Stock" 
                              size="small" 
                              sx={{ 
                                height: 24, 
                                backgroundColor: "success.light",
                                color: "success.dark",
                                fontWeight: 500,
                                fontSize: "0.75rem"
                              }} 
                            />
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={4} md={2} sx={{ textAlign: { xs: "left", md: "center" } }}>
                        <Typography sx={{ color: "text.secondary", display: { xs: "block", md: "none" } }}>
                          Price:
                        </Typography>
                        <Typography fontWeight="medium">${item.price.toFixed(2)}</Typography>
                      </Grid>
                      
                      <Grid item xs={4} md={2} sx={{ textAlign: { xs: "left", md: "center" } }}>
                        <Typography sx={{ color: "text.secondary", display: { xs: "block", md: "none" }, mb: 1 }}>
                          Quantity:
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", md: "center" } }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDecreaseQuantity(item._id)}
                            disabled={item.quantity <= 1}
                            sx={{ 
                              p: 0.5,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '4px 0 0 4px'
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ 
                            px: 2, 
                            py: 1, 
                            minWidth: 36, 
                            textAlign: 'center',
                            borderTop: '1px solid',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleIncreaseQuantity(item._id)}
                            sx={{ 
                              p: 0.5,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: '0 4px 4px 0'
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={4} md={2} sx={{ textAlign: { xs: "left", md: "right" } }}>
                        <Typography sx={{ color: "text.secondary", display: { xs: "block", md: "none" } }}>
                          Total:
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: { xs: "space-between", md: "flex-end" }, alignItems: "center" }}>
                          <Typography fontWeight="bold" color="primary.main">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeFromCart(item._id)}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Paper>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 4,
                mt: 4,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Client Information
                </Typography>
                <TextField
                  fullWidth
                  label="Client Telegram Username or Chat ID"
                  placeholder="@username or chat ID"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="Enter client's Telegram username (e.g., @client) or chat ID"
                  error={snackbar.severity === "error" && snackbar.message.includes("client contact")}
                />
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Free shipping on orders over $50
                  </Typography>
                </Box>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                  border: "1px solid",
                  borderColor: "primary.light",
                  width: { xs: "100%", md: "320px" },
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Order Summary
                </Typography>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="medium">${totalPrice.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight="medium">Free</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<TelegramIcon />}
                  onClick={sendToTelegram}
                  disabled={cartItems.length === 0 || !clientContact.trim()}
                  sx={{ 
                    mb: 2,
                    py: 1.5,
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                    }
                  }}
                >
                  Send to Client via Telegram
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={clearCart}
                  disabled={cartItems.length === 0}
                  sx={{ fontWeight: "medium" }}
                >
                  Clear Cart
                </Button>
              </Paper>
            </Box>
          </>
        )}
      </Paper>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;