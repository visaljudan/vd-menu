import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';

const ItemDetailPage = () => {
  const menuItems = {
    burgers: [
      {
        name: "Texas Burger",
        description: "beef, lamb's lettuce, mozzarella, green pesto, onion, mushrooms, jalap...",
        price: "$4.50"
      },
      {
        name: "California Burger",
        description: "tomato, arugula, sauce",
        price: "$5.00"
      }
    ],
    salads: [],
    desserts: [],
    beverages: []
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Menu
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2 }}>
        BURGERS
      </Typography>
      
      <Grid container spacing={3}>
        {menuItems.burgers.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {item.price}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button variant="contained" size="small">
                  + ORDER NOW
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* You can add other sections similarly */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2, mt: 4 }}>
        SALADS
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2, mt: 4 }}>
        DESSERTS
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #ddd', pb: 1, mb: 2, mt: 4 }}>
        BEVERAGES
      </Typography>
    </Box>
  );
};

export default ItemDetailPage;