import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        backgroundImage: 'url(https://i.pinimg.com/736x/86/39/93/8639931b444f3608df252f45dabe8eed.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.5)',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <Box sx={{ zIndex: 2, px: 2 ,textAlign: 'left'}}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Travel without limits
        </Typography>
        <Typography variant="subtitle1" mb={4}>
          Create lifetime memories in unforgettable locations around the world
        </Typography>
        <Button variant="contained" sx={{ bgcolor: '#a283dc', color: '#fff' }}>
         yes i love u 
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
