const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueReport,
  getOccupancyReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Report routes restricted to Hotel Manager and Admin
router.use(protect);
router.use(authorize('hotel_manager', 'admin'));

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueReport);
router.get('/occupancy', getOccupancyReport);

module.exports = router;
