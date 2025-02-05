import React from "react";
import { Typography, Button, Container, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar"

const HomePage = () => {
  return (
    <>
     <Navbar />
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Our Platform
        </Typography>
        <Typography variant="body1" gutterBottom>
          Discover amazing features and services tailored just for you.
        </Typography>
        <NavLink to="/categorymanagement">
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "1rem" }}
          >
            Get Started
          </Button>
        </NavLink>
      </Box>
    </Container>
    </>
  );
};

export default HomePage;
