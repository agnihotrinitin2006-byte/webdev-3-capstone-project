const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

/**
 * Helper to build hotel match query based on user role
 */
const getHotelFilter = async (user) => {
  if (user.role === 'hotel_manager') {
    const hotels = await Hotel.find({ manager: user._id }).select('_id');
    const hotelIds = hotels.map((h) => h._id);
    return { hotel: { $in: hotelIds } };
  }
  return {};
};

// @desc    Get dashboard summary statistics
// @route   GET /api/reports/dashboard
// @access  Private (Hotel Manager, Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const filter = await getHotelFilter(req.user);

    // Filter for hotels
    const hotelQuery = req.user.role === 'hotel_manager' ? { manager: req.user._id } : {};
    const totalHotels = await Hotel.countDocuments(hotelQuery);

    // Total rooms
    let roomQuery = {};
    if (req.user.role === 'hotel_manager') {
      const hotels = await Hotel.find({ manager: req.user._id }).select('_id');
      roomQuery = { hotel: { $in: hotels.map((h) => h._id) } };
    }
    const totalRooms = await Room.countDocuments(roomQuery);
    const rooms = await Room.find(roomQuery);
    const totalInventoryUnits = rooms.reduce((sum, r) => sum + r.totalQuantity, 0);

    // Aggregations on Bookings
    const bookingStats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0] }
          },
          totalNightsBooked: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, { $multiply: ['$nights', '$roomQuantity'] }, 0] }
          }
        }
      }
    ]);

    const stats = bookingStats.length > 0 ? bookingStats[0] : {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      totalNightsBooked: 0
    };

    // Calculate estimated occupancy rate (over a 30-day period)
    const monthlyCapacityUnits = (totalInventoryUnits || 1) * 30;
    const occupancyRate = Math.min(
      100,
      Math.round(((stats.totalNightsBooked || 0) / (monthlyCapacityUnits || 1)) * 100)
    );

    // Recent 5 bookings
    const recentBookings = await Booking.find(filter)
      .populate('hotel', 'name city')
      .populate('room', 'roomType pricePerNight')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalHotels,
        totalRooms,
        totalInventoryUnits,
        totalBookings: stats.totalBookings,
        confirmedBookings: stats.confirmedBookings,
        cancelledBookings: stats.cancelledBookings,
        totalRevenue: stats.totalRevenue,
        occupancyRate,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly and hotel-wise revenue reports
// @route   GET /api/reports/revenue
// @access  Private (Hotel Manager, Admin)
const getRevenueReport = async (req, res, next) => {
  try {
    const baseFilter = await getHotelFilter(req.user);
    const confirmedFilter = { ...baseFilter, status: 'confirmed' };

    // Monthly revenue pipeline
    const monthlyRevenue = await Booking.aggregate([
      { $match: confirmedFilter },
      {
        $group: {
          _id: {
            year: { $year: '$checkInDate' },
            month: { $month: '$checkInDate' }
          },
          revenue: { $sum: '$totalAmount' },
          bookingsCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          bookingsCount: 1
        }
      }
    ]);

    // Hotel-wise revenue pipeline
    const hotelRevenue = await Booking.aggregate([
      { $match: confirmedFilter },
      {
        $group: {
          _id: '$hotel',
          totalRevenue: { $sum: '$totalAmount' },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelInfo'
        }
      },
      { $unwind: '$hotelInfo' },
      {
        $project: {
          _id: 1,
          hotelName: '$hotelInfo.name',
          city: '$hotelInfo.city',
          totalRevenue: 1,
          totalBookings: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue,
        hotelRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get occupancy rate and popular hotels analytics
// @route   GET /api/reports/occupancy
// @access  Private (Hotel Manager, Admin)
const getOccupancyReport = async (req, res, next) => {
  try {
    const baseFilter = await getHotelFilter(req.user);

    // Most popular hotels by bookings count
    const popularHotels = await Booking.aggregate([
      { $match: { ...baseFilter, status: 'confirmed' } },
      {
        $group: {
          _id: '$hotel',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalNights: { $sum: '$nights' }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotel'
        }
      },
      { $unwind: '$hotel' },
      {
        $project: {
          _id: '$hotel._id',
          name: '$hotel.name',
          city: '$hotel.city',
          rating: '$hotel.rating',
          bookingCount: 1,
          totalRevenue: 1,
          totalNights: 1
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // Booking status distribution (confirmed vs cancelled)
    const statusDistribution = await Booking.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        popularHotels,
        statusDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRevenueReport,
  getOccupancyReport
};
