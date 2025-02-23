import React, { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Container,
  Grid,
  Box,
  Link,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../app/user/userSlice";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../../components/GoogleButton";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const defaultTheme = createTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(signInStart());
      const response = await api.post("/v1/auth/signin", formData);
      const data = response.data;
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      dispatch(signInFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            {/* Left Side: Image */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: {
                  xs: "none", // Hide on extra small and small screens
                  md: "block", // Show on medium screens and up
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  p: 2,
                }}
              >
                <img
                  src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg?semt=ais_hybrid"
                  alt="Sign In Illustration"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </Box>
            </Grid>

            {/* Right Side: Form */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="contain">
                  Sign In
                </Typography>

                <Box
                  component="form"
                  noValidate
                  sx={{ mt: 3 }}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="usernameOrEmail"
                        label="Username or Email"
                        name="usernameOrEmail"
                        autoComplete="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={handleInput}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleInput}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handlePasswordToggle}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Link
                      href="/forgot-password"
                      variant="body2"
                      sx={{ ml: 1 }}
                    >
                      Forgot Password
                    </Link>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={
                      !formData.usernameOrEmail ||
                      !formData.password ||
                      errors.usernameOrEmail ||
                      errors.password
                    }
                  >
                    {loading ? "Signing In ..." : "Sign In"}
                  </Button>

                  {/* <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ mt: 1 }}
                  >
                    Login with Google
                  </Button> */}
                  <GoogleButton />
                  <Grid container justifyContent="flex-end" marginTop={"16px"}>
                    <Grid item>
                      <Typography variant="body2" component="span">
                        Don't have account?
                      </Typography>
                      <Link href="/signup" variant="body2" sx={{ ml: 1 }}>
                        Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignInPage;
