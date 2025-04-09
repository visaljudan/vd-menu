import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        py: 3,
        mt: 4, // Add some margin top to separate from the main content
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" align="left">
              &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link color="inherit" href="/privacy">
                Privacy Policy
              </Link>
              <Link color="inherit" href="/terms">
                Terms of Service
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary" align="right">
              Follow us on:
              <Link color="inherit" href="https://facebook.com" sx={{ ml: 1 }}>
                Facebook
              </Link>
              <Link color="inherit" href="https://twitter.com" sx={{ ml: 1 }}>
                Twitter
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;