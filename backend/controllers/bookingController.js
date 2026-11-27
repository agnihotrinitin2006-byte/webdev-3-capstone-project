const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { calculateNights, generateBookingId } = require('../utils/calculateBooking');

// @desc    Create a new booking with overlap prevention
// @route   POST /api/bookings
// @access  Private (Guest, Hotel Manager, Admin)
const createBooking = async (req, res, next) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, roomQuantity = 1, guestDetails } = req.body;

    if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide hotelId, roomId, checkInDate, and checkOutDate'
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format'
      });
    }

    const nights = calculateNights(checkIn, checkOut);
    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be at least one day after check-in date'
      });
    }

    // Verify hotel and room exist
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const requestedQty = Number(roomQuantity) || 1;
    if (requestedQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Room quantity must be at least 1'
      });
    }

    // Overlap prevention logic:
    // Existing booking check-in < New check-out AND Existing booking check-out > New check-in
    // Only confirmed bookings occupy inventory
    const overlappingBookings = await Booking.find({
      room: room._id,
      status: 'confirmed',
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn }
    });

    const alreadyBookedCount = overlappingBookings.reduce(
      (sum, b) => sum + b.roomQuantity,
      0
    );

    const availableQuantity = room.totalQuantity - alreadyBookedCount;

    if (availableQuantity < requestedQty) {
      return res.status(400).json({
        success: false,
        message: `Double booking prevented! Only ${Math.max(0, availableQuantity)} unit(s) available for the selected dates, but ${requestedQty} requested.`
      });
    }

    // Calculate total price: nights * pricePerNight * roomQuantity
    const totalAmount = nights * room.pricePerNight * requestedQty;

    // Use logged in user details if guestDetails not explicitly supplied
    const finalGuestDetails = {
      name: (guestDetails && guestDetails.name) || req.user.name,
      email: (guestDetails && guestDetails.email) || req.user.email,
      phone: (guestDetails && guestDetails.phone) || req.user.phone || 'N/A',
      specialRequests: (guestDetails && guestDetails.specialRequests) || ''
    };

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      hotel: hotel._id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      roomQuantity: requestedQty,
      totalAmount,
      guestDetails: finalGuestDetails,
      status: 'confirmed'
    });

    // Populate references before sending response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel', 'name address city images rating')
      .populate('room', 'roomType pricePerNight capacity bedType');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Guest, Hotel Manager, Admin)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name address city images rating phone')
      .populate('room', 'roomType pricePerNight capacity bedType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or bookingId
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    let booking;
    // Check if query is by MongoDB _id or human readable bookingId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(req.params.id)
        .populate('hotel')
        .populate('room')
        .populate('user', 'name email phone');
    } else {
      booking = await Booking.findOne({ bookingId: req.params.id })
        .populate('hotel')
        .populate('room')
        .populate('user', 'name email phone');
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Role check: Guest can only view their own booking; Manager can view bookings for their hotel; Admin can view all
    const isOwner = booking.user && booking.user._id.toString() === req.user._id.toString();
    const isHotelManager =
      req.user.role === 'hotel_manager' &&
      booking.hotel &&
      booking.hotel.manager &&
      booking.hotel.manager.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isHotelManager && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin sees all; Hotel Manager sees bookings for their hotels)
// @route   GET /api/bookings
// @access  Private (Hotel Manager, Admin)
const getAllBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'hotel_manager') {
      // Find all hotels owned by this manager
      const managerHotels = await Hotel.find({ manager: req.user._id }).select('_id');
      const hotelIds = managerHotels.map((h) => h._id);
      query.hotel = { $in: hotelIds };
    }

    // Optional status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Optional hotel filter
    if (req.query.hotelId) {
      query.hotel = req.query.hotelId;
    }

    const bookings = await Booking.find(query)
      .populate('hotel', 'name city address')
      .populate('room', 'roomType pricePerNight')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Guest who booked, Hotel Manager who owns hotel, Admin)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Authorization check
    const isOwner = booking.user.toString() === req.user._id.toString();
    const isHotelManager =
      req.user.role === 'hotel_manager' &&
      booking.hotel &&
      booking.hotel.manager.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isHotelManager && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Room inventory has been restored.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  cancelBooking
};
