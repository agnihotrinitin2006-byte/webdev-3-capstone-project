const express = require('express');
const router = express.Router();
const {
  createHotel,
  getHotels,
  getHotelById,
  getMyHotels,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getHotels);

// Manager specific route (Must be defined before /:id)
router.get('/manager/my-hotels', protect, authorize('hotel_manager', 'admin'), getMyHotels);

// Single hotel
router.get('/:id', getHotelById);

// Protected routes (Hotel Manager & Admin)
router.post('/', protect, authorize('hotel_manager', 'admin'), createHotel);
router.put('/:id', protect, authorize('hotel_manager', 'admin'), updateHotel);
router.delete('/:id', protect, authorize('hotel_manager', 'admin'), deleteHotel);

module.exports = router;
