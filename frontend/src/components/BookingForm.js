import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, Paper, Chip, Divider, LinearProgress
} from '@mui/material';
import { Person, AccessTime, CheckCircle, Error, Hotel } from '@mui/icons-material';
import { roomService } from '../services/api';

const BookingForm = ({ selectedRooms, calculatedTime, onBookingSuccess, onNumRoomsChange }) => {
  const [guestName, setGuestName] = useState('');
  const [numRooms, setNumRooms] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, ok } = await roomService.bookRooms(guestName, parseInt(numRooms));
      if (ok) {
        setMessage(`Booking successful! Rooms: ${data.rooms.join(', ')} | Travel Time: ${data.travelTime} minutes`);
        setGuestName('');
        setNumRooms(1);
        onBookingSuccess();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Booking failed');
    }
    setLoading(false);
  };

  const handleNumRoomsChange = (e) => {
    const value = e.target.value;
    setNumRooms(value);
    onNumRoomsChange(value);
  };

  const isSuccess = message.includes('successful');

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider',
        overflow: 'hidden'
      }}
    >
      {loading && <LinearProgress color="primary" />}
      
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Hotel color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
            Book Your Stay
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleBooking}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
            <TextField
              fullWidth
              label="Guest Name"
              variant="outlined"
              placeholder="e.g. John Doe"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                sx: { borderRadius: 2 }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Number of Rooms</InputLabel>
              <Select
                value={numRooms}
                label="Number of Rooms"
                onChange={handleNumRoomsChange}
                sx={{ borderRadius: 2 }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <MenuItem key={n} value={n}>{n} {n > 1 ? 'Rooms' : 'Room'}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Booking Preview Section */}
          {selectedRooms.length > 0 && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: 'grey.50', 
                borderStyle: 'dashed',
                mb: 3 
              }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight="700">
                Reservation Summary
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
                {selectedRooms.map(room => (
                  <Chip 
                    key={room} 
                    label={`Room ${room}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ bgcolor: 'white', fontWeight: 600 }} 
                  />
                ))}
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" color="text.secondary">
                  <AccessTime sx={{ mr: 0.5, fontSize: 18 }} />
                  <Typography variant="body2" fontWeight="500">Travel Distance</Typography>
                </Box>
                <Typography variant="body2" fontWeight="700" color="primary.main">
                  {calculatedTime} mins
                </Typography>
              </Box>
            </Paper>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            size="large"
            disabled={loading || !guestName}
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              textTransform: 'none', 
              fontSize: '1rem', 
              fontWeight: 700 
            }}
          >
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </Button>
        </Box>

        {message && (
          <Alert 
            severity={isSuccess ? 'success' : 'error'} 
            sx={{ mt: 3, borderRadius: 2, fontWeight: 500 }}
            variant="filled"
            icon={isSuccess ? <CheckCircle fontSize="inherit" /> : <Error fontSize="inherit" />}
          >
            {message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingForm;