import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box
} from '@mui/material';
import { Hotel, ExitToApp } from '@mui/icons-material';

const Header = ({ onLogout }) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Hotel sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h6" component="div">
              Hotel Room Booking System
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Room Management Dashboard
            </Typography>
          </Box>
        </Box>
        
        <Button color="inherit" onClick={onLogout} startIcon={<ExitToApp />}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;