const { roomService, bookingService } = require('../services/hotelService');

const hotelController = {
  getRooms: (req, res) => {
    try {
      const rooms = roomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  bookRooms: (req, res) => {
    try {
      const { guestName, numRooms } = req.body;
      const booking = roomService.bookRooms(guestName, numRooms);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getBookings: (req, res) => {
    try {
      const bookings = bookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  generateRandomOccupancy: (req, res) => {
    try {
      const result = roomService.generateRandomOccupancy();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetAllBookings: (req, res) => {
    try {
      const result = roomService.resetAllBookings();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = hotelController;