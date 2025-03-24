import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../api/axiosConfig";

function AdminUserEdit() {
  // const navigate = useNavigate();
  const { id } = useParams();
  const title = `Admin Form`;
  const [user, setUser] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    roleId: '', 
  });

  // useEffect(() => {
  //   if (!id) return;
  //   if (id !== '0') {
  //     getItem(id);
  //   }
  // }, [id]);

  useEffect(() => {
    if (!id) return;
    if (id) {
      getItem(id);
    }
  }, [id]);

  // const getuers = async () => {
  //   const res = await api.get('/v1/users');
  //   setUser(res);
  // };
  // console.log(res);
  
  const getItem = async (id) => {
    const res = await api.get(`/v1/users/${id}`);
    setFormData(res.data.data);
  };
console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = () => {
    if (id !== '0') {
      save();
      return;
    }
    add();
  };

  // const save = async () => {
  //   await api.patch(`/v1/users/${id}`, formData);
  //   navigate(`?refresh=true`);
  // };

  const save = async () => {
    await http.put(`/v1/users/${id}`, formData);
    const path = getBackRoute(router);
    await router.push(`${path}?refresh=true`);
  };

  // const add = async () => {
  //   await api.post(`Admin`, formData);
  //   navigate(`?refresh=true`);
  // };

  return (
    <Grid item sx={{ p: 3 }}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card style={{ position: 'relative' }}>
            <CardHeader
              action={<Box><Button variant="contained" onClick={onSubmit}>{id === '0' ? 'Add' : 'Save'}</Button></Box>}
              title={title}
            />
            <Divider />
            <CardContent>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    required
                    label="name"
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
                   <TextField
                    required
                    label="RoleId"
                    name="roleid"
                    value={formData.roleId}
                    onChange={handleChange}
                  />
                  {/* <TextField
                    required
                    label="PhoneNumber"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                  /> */}
                  {/* <TextField
                    required
                    select
                    label="Hospital"
                    name="hospitalId"
                    // value={formData.hospitalId}
                    // onChange={handleChange}
                  >
                    {hospitals.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField> */}
                </Box>
              </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdminUserEdit;
