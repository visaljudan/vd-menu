import * as React from 'react';
import {ReactElement, useState, FormEvent, useContext } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from "@mui/icons-material/Google";
// import SidebarLayout from '@/layouts/SidebarLayout';

// const OverviewWrapper = styled(Box)(
//   ({ theme }) => `
//     overflow: auto;
//     background: ${theme.palette.common.white};
//     flex: 1;
//     overflow-x: hidden;
// `
// );

const SignUpPage = () =>{
  // const { showSnackbar } = useContext(SnackbarContext);
  // const router = useRouter();
  // const httpClient = new HttpClient();
  // const [formData, setFormData] = useState({
  //   username: '',
  //   email: '',
  //   password: ''
  // });

  // const handleInput = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // };

  // const submitForm = async (e: FormEvent) => {
  //   // We don't want the page to refresh
  //   e.preventDefault();
  //   if (formData.email.length === 0 || formData.password.length === 0 || formData.username.length === 0 ) {
  //     // Handle error message
  //     showSnackbar({ type: 'error', message: "All field is requried" })
  //     return; 
  //   };

  //   const response = await httpClient.post('api/register', formData);
  //   console.log(formData);
  //   if (typeof response === "string") {
  //     // Handle error message
  //     showSnackbar({ type: 'error', message: response });
  //   } else {
  //     // Assuming successful signup message
  //     showSnackbar({
  //       type: 'success',
  //       message: 'Successfully signed up! Please login with your email or username.'
  //     });
  //     await router.push('/');
  //   }
  // };

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate  sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  // onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone"
                  name="phone"
                  autoComplete="phone"
                  // onChange={handleInput}
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
                  // onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  // onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm password"
                  label="Confirm Password"
                  type="confirm password"
                  id="confirm password"
                  autoComplete="confirm password"
                  // onChange={handleInput}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            // onClick={handleGoogleLogin}
            sx={{ mt: 1 }}
          >
            Login with Google
          </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
// Overview.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default SignUpPage;
