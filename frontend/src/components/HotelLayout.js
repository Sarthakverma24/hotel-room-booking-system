import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Paper, TextField, 
  Button, Chip, InputAdornment, IconButton, Divider, Grid
} from '@mui/material';
import { Business, Search, Clear, FilterList } from '@mui/icons-material';
import { getRoomsByFloor } from '../helpers/roomHelpers';

const HotelLayout = ({ rooms, selectedRooms }) => {
  const [searchFloor, setSearchFloor] = useState('');
  const [showEmptyOnly, setShowEmptyOnly] = useState(false);
  const floorRooms = getRoomsByFloor(rooms);

  const handleSearch = () => {
    if (searchFloor) setShowEmptyOnly(true);
  };

  const handleClear = () => {
    setSearchFloor('');
    setShowEmptyOnly(false);
  };

  const getEmptyRoomsOnFloor = (floor) => {
    if (!floorRooms[floor]) return [];
    return floorRooms[floor].filter(room => room.available);
  };

  const shouldShowFloor = (floor) => {
    if (!showEmptyOnly || !searchFloor) return true;
    return floor.toString() === searchFloor.toString();
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Sticky Header Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Business color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight="800">Hotel Infrastructure</Typography>
            </Box>
            {showEmptyOnly && (
              <Chip 
                label="Filtering Floor View" 
                size="small" 
                color="primary" 
                onDelete={handleClear}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

          <Box display="flex" gap={1}>
            <TextField
              size="small"
              placeholder="Jump to Floor..."
              value={searchFloor}
              onChange={(e) => setSearchFloor(e.target.value)}
              type="number"
              sx={{ 
                flex: 1, 
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchFloor && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch} 
              disabled={!searchFloor}
              disableElevation
              sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
            >
              Filter
            </Button>
          </Box>
        </Box>

        {/* Scrollable Layout Content */}
        <Box sx={{ p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
          {Object.keys(floorRooms).sort((a, b) => b - a).map(floor => {
            if (!shouldShowFloor(floor)) return null;

            const roomsToShow = showEmptyOnly && searchFloor === floor.toString()
              ? getEmptyRoomsOnFloor(floor)
              : floorRooms[floor].sort((a, b) => a.position - b.position);

            return (
              <Box key={floor} sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ color: 'text.secondary', minWidth: '60px' }}>
                    FLOOR {floor}
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>
                
                <Grid container spacing={1}>
                  {roomsToShow.map(room => {
                    const isSelected = selectedRooms.includes(room.number);
                    const statusColor = room.available 
                      ? (isSelected ? 'warning.main' : 'success.main')
                      : 'error.main';
                    
                    return (
                      <Grid item key={room.number}>
                        <Paper
                          elevation={0}
                          sx={{
                            width: 50,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            border: '1.5px solid',
                            borderColor: isSelected ? 'warning.main' : 'divider',
                            bgcolor: room.available 
                              ? (isSelected ? 'warning.light' : 'success.light')
                              : 'grey.100',
                            color: room.available 
                              ? (isSelected ? 'warning.contrastText' : 'success.contrastText') 
                              : 'text.disabled',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: room.available ? 'primary.main' : 'divider',
                              transform: room.available ? 'translateY(-2px)' : 'none'
                            }
                          }}
                        >
                          {room.number}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            );
          })}
        </Box>

        {/* Legend Footer */}
        <Divider />
        <Box display="flex" gap={4} p={2.5} justifyContent="center" bgcolor="grey.50">
          <LegendItem color="success.main" label="Available" />
          <LegendItem color="grey.400" label="Booked" />
          <LegendItem color="warning.main" label="Selected" />
        </Box>
      </CardContent>
    </Card>
  );
};

const LegendItem = ({ color, label }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
    <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </Typography>
  </Box>
);

export default HotelLayout;