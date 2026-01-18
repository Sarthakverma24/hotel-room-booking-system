import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Alert, CircularProgress
} from '@mui/material';
import { Shuffle, RestartAlt } from '@mui/icons-material';
import { roomService } from '../services/api';

const AdminControls = ({ onDataChange }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateOccupancy = async () => {
    setLoading(true);
    try {
      const result = await roomService.generateRandomOccupancy();
      setMessage(result.message);
      onDataChange();
    } catch (error) {
      setMessage('Failed to generate occupancy');
    }
    setLoading(false);
  };

  const handleResetBookings = async () => {
    setLoading(true);
    try {
      const result = await roomService.resetAllBookings();
      setMessage(result.message);
      onDataChange();
    } catch (error) {
      setMessage('Failed to reset bookings');
    }
    setLoading(false);
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Admin Controls
        </Typography>
        
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <Shuffle />}
            onClick={handleGenerateOccupancy}
            disabled={loading}
            sx={{ 
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
              }
            }}
          >
            Generate Random Occupancy
          </Button>
          
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={16} /> : <RestartAlt />}
            onClick={handleResetBookings}
            disabled={loading}
            sx={{ 
              background: 'linear-gradient(45deg, #f44336, #ff9800)',
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f, #f57c00)',
              }
            }}
          >
            Reset All Bookings
          </Button>
        </Box>
        
        {message && (
          <Alert severity="info" sx={{ mt: 1 }}>
            {message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminControls;