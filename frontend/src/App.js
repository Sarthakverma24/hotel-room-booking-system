import React, { useState, useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';
import Login from './components/Login';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import HotelLayout from './components/HotelLayout';
import AdminControls from './components/AdminControls';
import { roomService, bookingService } from './services/api';
import { findOptimalRooms } from './helpers/roomHelpers';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [calculatedTime, setCalculatedTime] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRooms();
      fetchBookings();
    }
  }, [isLoggedIn]);

  const fetchRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleNumRoomsChange = (numRooms) => {
    if (rooms.length > 0) {
      const optimal = findOptimalRooms(rooms, parseInt(numRooms));
      if (optimal) {
        setSelectedRooms(optimal.rooms.map(r => r.number));
        setCalculatedTime(optimal.travelTime);
      } else {
        setSelectedRooms([]);
        setCalculatedTime(0);
      }
    }
  };

  const handleBookingSuccess = () => {
    fetchRooms();
    fetchBookings();
    setSelectedRooms([]);
    setCalculatedTime(0);
  };

  const handleDataChange = () => {
    fetchRooms();
    fetchBookings();
    setSelectedRooms([]);
    setCalculatedTime(0);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Header onLogout={handleLogout} />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AdminControls onDataChange={handleDataChange} />
            <BookingForm
              selectedRooms={selectedRooms}
              calculatedTime={calculatedTime}
              onBookingSuccess={handleBookingSuccess}
              onNumRoomsChange={handleNumRoomsChange}
            />
            <BookingList bookings={bookings} />
          </Grid>
          <Grid item xs={12} md={6}>
            <HotelLayout rooms={rooms} selectedRooms={selectedRooms} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;