const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  checkRoomAvailability,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRooms);
router.get('/:id/availability', checkRoomAvailability);
router.get('/:id', getRoomById);

// Protected routes (Hotel Manager & Admin)
router.post('/', protect, authorize('hotel_manager', 'admin'), createRoom);
router.put('/:id', protect, authorize('hotel_manager', 'admin'), updateRoom);
router.delete('/:id', protect, authorize('hotel_manager', 'admin'), deleteRoom);

module.exports = router;
