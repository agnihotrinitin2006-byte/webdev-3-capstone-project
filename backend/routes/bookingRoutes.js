const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(protect);

// Specific routes before /:id
router.get('/my-bookings', getMyBookings);
router.get('/', authorize('hotel_manager', 'admin'), getAllBookings);
router.post('/', createBooking);

router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
