import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../api/axiosConfig";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Grid,
  Avatar,
  CircularProgress,
  MenuItem
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LockReset as LockResetIcon
} from "@mui/icons-material";

const SettingPage = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // role: "",
    avatar: ""
  });
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", severity: "" });
  const [errors, setErrors] = useState({});

  // Fetch user data and available roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, rolesResponse] = await Promise.all([
          api.get("/api/v1/users"),
        ]);
        
        setUser({
          ...userResponse.data.data,
          password: "",
          confirmPassword: ""
        });
        setRoles(rolesResponse.data);
        setIsLoading(false);
      } catch (error) {
        setMessage({
          text: "Failed to load user data",
          severity: "error"
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = "Name is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }
    if (user.password && user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Prepare payload - don't send confirmPassword and empty password
      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.password && { password: user.password })
      };

      const response = await api.put("/api/v1/users/me", payload);
      
      setUser(prev => ({
        ...response.data,
        password: "",
        confirmPassword: ""
      }));
      setMessage({
        text: "Profile updated successfully!",
        severity: "success"
      });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to update profile",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isEditing) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Settings
        </Typography>

        {message.text && (
          <Alert severity={message.severity} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                src={user.avatar || "/static/images/avatar/default.jpg"}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              {isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<LockResetIcon />}
                  sx={{ mt: 2 }}
                >
                  Change Avatar
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Username"
                    name="username"
                    value={user.username}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isLoading}
                  />
                  <TextField
                    select
                    label="Role"
                    name="role"
                    value={user.role}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={isLoading}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password || "Leave blank to keep current"}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isLoading}
                  />

                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Full Name</Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Username</Typography>
                    <Typography variant="body1">{user.username}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Role</Typography>
                    <Typography variant="body1">
                      {roles.find(r => r._id === user.role)?.name || "N/A"}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default SettingPage;