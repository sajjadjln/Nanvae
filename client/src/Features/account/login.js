import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Paper from '@mui/material/Paper';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { signInUser } from './accountSlice';



//! not returning unauthorized toast when entering wrong password for login
//! the basket error on the console
//! navigating from checkout to login still wont work
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {register, handleSubmit,formState:{isSubmitted,errors,isValid}} = useForm({
    mode:'all',
  });

  async function submitForm(values){
    dispatch(signInUser(values));
    navigate(location.state?.from || '/catalog');

  }
  return (
      <Container component={Paper} maxWidth="sm" sx={{display:'flex' , flexDirection:'column', alignItems:'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="username"
              autoComplete="email"
              autoFocus
              {...register('username', {required:'username is required'})}
              error={!!errors.username}
              helperText={errors?.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              {...register('password', {required:'password is required'})}
              error={!!errors.password}
              helperText={errors?.password?.message}
            />
            <LoadingButton
              disabled={!isValid}
              loading={isSubmitted}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item>
                <Link to='/register'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}