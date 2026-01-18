const { roomModel, bookingModel } = require('../models/hotelModel');
const { findOptimalRooms, calculateTravelTime } = require('../helpers/roomHelpers');

const roomService = {
  getAllRooms: () => {
    return roomModel.getAllRooms();
  },

  bookRooms: (guestName, numRooms) => {
    if (numRooms > 5) {
      throw new Error('Maximum 5 rooms per booking');
    }

    const availableRooms = roomModel.getAvailableRooms();
    const optimalRooms = findOptimalRooms(availableRooms, numRooms);
    
    if (!optimalRooms) {
      throw new Error('Not enough rooms available');
    }

    // Book the rooms
    optimalRooms.forEach(room => {
      roomModel.bookRoom(room.number);
    });

    // Create booking record
    const booking = {
      id: Date.now(),
      guestName,
      rooms: optimalRooms.map(r => r.number),
      travelTime: calculateTravelTime(optimalRooms[0], optimalRooms[optimalRooms.length - 1]),
      timestamp: new Date()
    };

    return bookingModel.addBooking(booking);
  },

  generateRandomOccupancy: () => {
    const allRooms = roomModel.getAllRooms();
    const occupancyRate = Math.random() * 0.7 + 0.1; // 10-80% occupancy
    const roomsToBook = Math.floor(allRooms.length * occupancyRate);
    
    // Reset first
    roomModel.resetRooms();
    bookingModel.clearBookings();
    
    // Randomly book rooms
    const availableRooms = [...allRooms];
    for (let i = 0; i < roomsToBook; i++) {
      const randomIndex = Math.floor(Math.random() * availableRooms.length);
      const room = availableRooms.splice(randomIndex, 1)[0];
      roomModel.bookRoom(room.number);
    }
    
    return { message: `Generated ${Math.round(occupancyRate * 100)}% occupancy (${roomsToBook} rooms booked)` };
  },

  resetAllBookings: () => {
    roomModel.resetRooms();
    bookingModel.clearBookings();
    return { message: 'All bookings reset successfully' };
  }
};

const bookingService = {
  getAllBookings: () => {
    return bookingModel.getAllBookings();
  }
};

module.exports = {
  roomService,
  bookingService
};