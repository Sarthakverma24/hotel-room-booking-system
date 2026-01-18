const express = require('express');
const hotelController = require('../controllers/hotelController');

const router = express.Router();

router.get('/rooms', hotelController.getRooms);
router.post('/book', hotelController.bookRooms);
router.get('/bookings', hotelController.getBookings);
router.post('/generate-occupancy', hotelController.generateRandomOccupancy);
router.post('/reset-bookings', hotelController.resetAllBookings);

module.exports = router;