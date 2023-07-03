import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Paper from '@mui/material/Paper';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../App/api/agent';
import { toast } from 'react-toastify';



export default function Register() {
    const history = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors, isValid },
    } = useForm({
        mode: 'all',
    });

    function handleApiErrors(errors) {
        if (errors) {
            errors.forEach((error) => {
                if (error.includes('Password')) {
                    setError('password', { message: error });
                } else if (error.includes('Email')) {
                    setError('email', { message: error });
                } else if (error.includes('Username')) {
                    setError('username', { message: error });
                }
            });
        }
    }

    const [loading] = React.useState(false); // Added loading state

    return (

            <Container
                component={Paper}
                maxWidth="sm"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit((data) => agent.account.register(data).then(()=>{
                    toast.success('registration successful - you can now login')
                    history('/login');
                }).catch((error) => handleApiErrors(error)))} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="username"
                        autoComplete="email"
                        autoFocus
                        {...register('username', { required: 'username is required' })}
                        error={!!errors.username}
                        helperText={errors?.username?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password', {
                            required: 'password is required',
                            pattern: {
                                //using regex for validation
                                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                message:"password does not meet complexity requirements"
                            }

                        })}
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email address"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: 'not a valid email address'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                    />
                    <LoadingButton
                        disabled={!isValid || isSubmitting} // Disable button when form is not valid or already submitting
                        loading={loading} // Use the loading state from useState
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </LoadingButton>
                    <Grid container>
                        <Grid item>
                            <Link to="/login">{"Already have an account? Sign in"}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

    );
}
