// Initialize hotel rooms with Map for O(1) lookups
const initializeRooms = () => {
  const rooms = new Map();
  // Floors 1-9: 10 rooms each
  for (let floor = 1; floor <= 9; floor++) {
    for (let room = 1; room <= 10; room++) {
      const number = floor * 100 + room;
      rooms.set(number, { number, floor, position: room, available: true });
    }
  }
  // Floor 10: 7 rooms
  for (let room = 1; room <= 7; room++) {
    const number = 1000 + room;
    rooms.set(number, { number, floor: 10, position: room, available: true });
  }
  return rooms;
};

// In-memory storage
let hotelRooms = initializeRooms();
let bookings = [];
let availableRoomsCache = null;

const roomModel = {
  getAllRooms: () => Array.from(hotelRooms.values()),
  
  getAvailableRooms: () => {
    if (!availableRoomsCache) {
      availableRoomsCache = Array.from(hotelRooms.values()).filter(room => room.available);
    }
    return availableRoomsCache;
  },
  
  bookRoom: (roomNumber) => {
    const room = hotelRooms.get(roomNumber);
    if (room && room.available) {
      room.available = false;
      availableRoomsCache = null; // Invalidate cache
      return true;
    }
    return false;
  },
  
  resetRooms: () => {
    hotelRooms = initializeRooms();
    availableRoomsCache = null;
  }
};

const bookingModel = {
  getAllBookings: () => bookings,
  
  addBooking: (booking) => {
    bookings.push(booking);
    return booking;
  },
  
  clearBookings: () => {
    bookings = [];
  }
};

module.exports = {
  roomModel,
  bookingModel
};