import React from 'react';
import { Box, Typography, Button } from '@mui/material';

// It's generally better to import images locally if possible
// import heroImage from './path/to/your/image.jpg'; // Example of local import

const HeroSection = () => {
  // Placeholder function for button click
  const handleButtonClick = () => {
    console.log("Button clicked! Implement navigation or action here.");
    // Example: navigate('/destinations'); or open a modal, etc.
  };

  return (
    <Box
      sx={{
        position: 'relative',
        // Consider using minHeight instead of height for better responsiveness on different screen sizes
        minHeight: '70vh', // Example: Using minHeight
        // height: '80vh', // Original height
        display: 'flex',
        // Adjust alignment if needed, e.g., 'flex-start' for top alignment
        alignItems: 'center',
        // Adjust justification if needed, e.g., 'flex-start' for left alignment
        justifyContent: 'center', // Centers the content container horizontally
        textAlign: 'center', // Default text align for the container (overridden below for content)
        color: '#fff',
        // Using a locally imported image is often more reliable
        // backgroundImage: `url(${heroImage})`,
        backgroundImage: 'url(https://i.pinimg.com/736x/86/39/93/8639931b444f3608df252f45dabe8eed.jpg)', // Original URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Optional: Creates a parallax-like effect on scroll
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed (0.5 = 50%)
          top: 0,
          left: 0,
          zIndex: 1, // Ensures overlay is above background but below content
        }}
      />
      {/* Content Container */}
      <Box sx={{
          position: 'relative', // Ensures content stays above the overlay
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          py: 4, // Add some vertical padding too
          maxWidth: 'md', // Constrain max width for better readability on large screens
          textAlign: { xs: 'center', md: 'left' }, // Center on small screens, left-align on medium+
          width: '100%', // Ensure it takes up available width within constraints
        }}
       >
        <Typography
          variant="h2" // Adjusted variant for potentially larger impact
          component="h1" // Better semantic HTML (usually one h1 per page)
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' } }} // Responsive font size
         >
          Travel Without Limits
        </Typography>
        <Typography
          variant="h6" // Adjusted variant for better hierarchy
          component="p" // Use <p> tag
          mb={4}
          sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }} // Responsive font size
        >
          Create lifetime memories in unforgettable locations around the world.
        </Typography>
        <Button
          variant="contained"
          size="large" // Make button larger
          onClick={handleButtonClick} // Added onClick handler
          sx={{
            // Consider using theme colors for consistency
            // bgcolor: 'primary.main', // Example using theme primary color
            bgcolor: '#a283dc', // Original color
            color: '#fff',
            '&:hover': {
              bgcolor: '#8e70c7', // Slightly darker purple on hover
            },
            px: 4, // Add more horizontal padding
            py: 1.5, // Add vertical padding
            fontSize: '1rem', // Adjust font size if needed
          }}
        >
          Explore Destinations {/* Changed Button Text */}
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;