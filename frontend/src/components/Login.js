import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert,
  InputAdornment, IconButton
} from '@mui/material';
import { Hotel, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      if (data.success) {
        onLogin();
        setMessage('Login successful!');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Login failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.light', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Hotel sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Hotel Booking System
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage room bookings
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            placeholder="Enter username (admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter password (password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {message && (
          <Alert 
            severity={message.includes('successful') ? 'success' : 'error'} 
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }} color="text.secondary">
          Demo credentials: admin / password
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;