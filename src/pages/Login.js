import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Auth/contextAuth';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1>SMIT JOB PORTAL</h1>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Box display="flex" justifyContent="center">
            <Typography variant="body2">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
