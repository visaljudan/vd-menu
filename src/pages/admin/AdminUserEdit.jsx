import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;
  const title = `Admin Form`;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!id) return;
    if (id !== "0") {
      getUser(id);
    }
  }, [id]);

  // Fetch user details
  const getUser = async (id) => {
    try {
      const response = await api.get(`/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    if (id !== "0") {
      save();
      return;
    }
    add();
  };

  const save = async () => {
    try {
      await api.patch(`/v1/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User updated successfully!");
      navigate("/admin/user-management");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const add = async () => {
    console.log(formData);
    try {
      await api.post("/v1/auth/signup", formData);
      toast.success("User created successfully!");
      navigate("/admin/user-management");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Grid item sx={{ p: 3 }}>
      <Grid container direction="row" justifyContent="center" spacing={3}>
        <Grid item xs={12}>
          <Card style={{ position: "relative" }}>
            <CardHeader
              action={
                <Box>
                  <Button variant="contained" onClick={onSubmit}>
                    {id === "0" ? "Add" : "Save"}
                  </Button>
                </Box>
              }
              title={title}
            />
            <Divider />
            <CardContent>
              <Box
                component="form"
                sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  required
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  required
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {/* Password Field */}
                <TextField
                  required
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdminUserEdit;
