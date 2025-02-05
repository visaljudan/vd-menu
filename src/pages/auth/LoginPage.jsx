import { Box, Button, Grid, ThemeProvider ,CssBaseline , Avatar,Typography, Checkbox, FormControlLabel,  } from '@mui/material';
import React, {  ReactElement  } from 'react';
// import BaseLayout from 'src/layouts/BaseLayout';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
// import { HttpClient } from '@/services/http-client';
// import { AppKey } from '@/constant/key';
// import { useRouter } from 'next/router';
// import { SnackbarContext } from '@/contexts/SnackbarContext';
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme } from '@mui/material/styles';
// import { Email } from '@mui/icons-material';

// const OverviewWrapper = styled(Box)(
//   ({ theme }) => `
//     overflow: auto;
//     background: ${theme.palette.common.white};
//     flex: 1;
//     overflow-x: hidden;
// `
// );

const LoginPage = () => {
  // const { showSnackbar } = useContext(SnackbarContext);
  // const router = useRouter();
  // const httpClient = new HttpClient();
  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: ''
  // });

  // const handleInput = (e: any) => {
  //   const fieldName = e.target.name;
  //   const fieldValue = e.target.value;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [fieldName]: fieldValue
  //   }));
  // };

  // const submitForm = async (e: FormEvent) => {
  //   // We don't want the page to refresh
  //   e.preventDefault();

  //   const response = await httpClient.post('api/login', formData);

  //   if (typeof response === 'string') {
  //     showSnackbar({ type: 'error', message: response });
  //     return;
  //   }
  //   // localStorage.setItem(AppKey.accessToken, response.accessToken);
  //   // localStorage.setItem(AppKey.refreshToken, response.refreshToken);
  //   // localStorage.setItem(AppKey.role, response.role);
  //   // localStorage.setItem(AppKey.email, response.username);
  //   showSnackbar({ type: 'success', message: 'Successfully logged in!' });
  //   const role = response.data.user.role;
  //   await router.push(`/dashboards/dashboard/user`);
  //   console.log(role);
  // };

  // useEffect(() => {
  // }, []);

  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://i.pinimg.com/originals/20/72/a7/2072a7edce1bb689c4997f48ee1cdc57.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
                  margin="normal"
                  fullWidth
                  required
                  id="outlined-required"
                  label="Email"
                  name="email"
                  // onChange={handleInput}
                />

               <TextField
                  margin="normal"
                  fullWidth
                  required
                  id="outlined-required"
                  label="Password"
                  name="password"
                  // onChange={handleInput}
                />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgotpassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginPage;
