import React, { useState } from 'react';
import {
  Typography, Box, Chip, Divider, TextField, Avatar
} from '@mui/material';
import { AccessTime, Person, History, MeetingRoom, Search } from '@mui/icons-material';

const BookingList = ({ bookings }) => {
  const [searchRoom, setSearchRoom] = useState('');
  
  const filteredBookings = bookings.filter(booking => 
    searchRoom === '' || booking.rooms.some(room => room.toString().includes(searchRoom))
  );

  const getTravelTimeRange = (rooms) => {
    if (rooms.length === 1) return '1';
    const minFloor = Math.floor(Math.min(...rooms) / 100);
    const maxFloor = Math.floor(Math.max(...rooms) / 100);
    const floorDiff = Math.abs(maxFloor - minFloor);
    const baseTime = 1;
    const maxTime = baseTime + floorDiff + (rooms.length - 1);
    return rooms.length === 1 ? baseTime.toString() : `${baseTime}-${maxTime}`;
  };

  return (
    <div style={{ 
      borderRadius: '16px', 
      border: '1px solid #e0e0e0',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2.5, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <History color="primary" />
        <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
          Recent Activity
        </Typography>
      </Box>
      
      <Box sx={{ px: 2.5, pb: 1 }}>
        <TextField
          size="small"
          placeholder="Search by room number..."
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ width: '100%' }}
        />
      </Box>

      <div style={{ padding: '0 8px', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredBookings.length === 0 ? (
            <Box 
              textAlign="center" 
              py={4} 
              sx={{ bgcolor: 'grey.50', m: 2, borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}
            >
              <Person sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                No active bookings found
              </Typography>
            </Box>
          ) : (
            filteredBookings.map((booking, index) => (
              <React.Fragment key={booking.id}>
                <div 
                  style={{
                    padding: '16px',
                    margin: '8px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold' }}>
                      {booking.guestName.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box flexGrow={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight="700">
                          {booking.guestName}
                        </Typography>
                        <Box display="flex" alignItems="center" color="text.secondary">
                          <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption" fontWeight="600">
                            {getTravelTimeRange(booking.rooms)}m
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                        {booking.rooms.map((room) => (
                          <Chip 
                            key={room}
                            icon={<MeetingRoom sx={{ fontSize: '12px !important' }} />}
                            label={`Room ${room}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem', 
                              fontWeight: 600,
                              bgcolor: 'white'
                            }} 
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </div>
                {index < filteredBookings.length - 1 && <Divider sx={{ mx: 2, opacity: 0.6 }} />}
              </React.Fragment>
            ))
          )}
      </div>
    </div>
  );
};

export default BookingList;