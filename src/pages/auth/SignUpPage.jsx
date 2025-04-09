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
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../../app/user/userSlice";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../../components/GoogleButton";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData };
    let updatedErrors = { ...errors };

    if (name === "username") {
      const regex = /^[a-z0-9]*$/;
      if (!regex.test(value)) {
        updatedErrors.username =
          "Username must be lowercase and contain only letters and numbers.";
      } else {
        updatedErrors.username = "";
      }
      updatedForm.username = value;
    } else if (name === "name") {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(value)) {
        updatedErrors.name = "Name can only contain letters and spaces.";
      } else {
        updatedErrors.name = "";
      }
      updatedForm.name = value;
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        updatedErrors.email = "Please enter a valid email address.";
      } else {
        updatedErrors.email = "";
      }
      updatedForm.email = value;
    } else if (name === "password") {
      if (value.length < 8) {
        updatedErrors.password = "Password must be at least 8 characters long.";
      } else {
        updatedErrors.password = "";
      }
      updatedForm.password = value;
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        updatedErrors.confirmPassword = "Passwords must match.";
      } else {
        updatedErrors.confirmPassword = "";
      }
      updatedForm.confirmPassword = value;
    }

    setFormData(updatedForm);
    setErrors(updatedErrors);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const defaultTheme = createTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(signUpStart());
      const response = await api.post("api/v1/auth/signup", formData);
      const data = response.data;
      dispatch(signUpSuccess(data));
      navigate("/");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";
      // setErrors({
      //   ...errors,
      //   form: errorMessage,
      // });
      toast.error(errorMessage);
      dispatch(signUpFailure(errorMessage));
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
                  xs: "none",
                  md: "block",
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
                  src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
                  alt="Sign Up Illustration"
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
                  Sign up
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
                        id="name"
                        label="Fullname"
                        name="name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleInput}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleInput}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInput}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
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
                        error={Boolean(errors.password)}
                        helperText={errors.password}
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
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleInput}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleConfirmPasswordToggle}
                                edge="end"
                              >
                                {showConfirmPassword ? (
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={
                      !formData.name ||
                      !formData.username ||
                      !formData.email ||
                      !formData.password ||
                      !formData.confirmPassword ||
                      errors.name ||
                      errors.username ||
                      errors.email ||
                      errors.password ||
                      errors.confirmPassword
                    }
                  >
                    {loading ? "Singing up..." : "Sign Up"}
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
                        Already have an account?
                      </Typography>
                      <Link href="/signin" variant="body2" sx={{ ml: 1 }}>
                        Sign in
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

export default SignUpPage;
