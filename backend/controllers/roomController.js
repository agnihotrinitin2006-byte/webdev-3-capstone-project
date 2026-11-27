const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Create a new room for a hotel
// @route   POST /api/rooms
// @access  Private (Hotel Manager who owns the hotel, Admin)
const createRoom = async (req, res, next) => {
  try {
    const { hotel, roomType, description, pricePerNight, capacity, totalQuantity, amenities, images, bedType } = req.body;

    const hotelObj = await Hotel.findById(hotel);
    if (!hotelObj) {
      return res.status(404).json({
        success: false,
        message: 'Associated hotel not found'
      });
    }

    // Role check: Hotel manager must own this hotel
    if (req.user.role !== 'admin' && hotelObj.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add rooms to this hotel'
      });
    }

    const room = await Room.create({
      hotel,
      roomType,
      description,
      pricePerNight,
      capacity,
      totalQuantity,
      amenities,
      images,
      bedType
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rooms (optionally filtered by hotel ID)
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.hotelId) {
      query.hotel = req.query.hotelId;
    }

    const rooms = await Room.find(query).populate('hotel', 'name city address');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name city address phone email');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for given dates
// @route   GET /api/rooms/:id/availability
// @access  Public
const checkRoomAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut, quantity = 1 } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both checkIn and checkOut dates'
      });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Overlap condition:
    // Existing checkIn < New checkOut AND Existing checkOut > New checkIn
    const overlappingBookings = await Booking.find({
      room: room._id,
      status: 'confirmed',
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate }
    });

    const bookedUnits = overlappingBookings.reduce((sum, b) => sum + b.roomQuantity, 0);
    const availableUnits = room.totalQuantity - bookedUnits;
    const requested = Number(quantity);

    res.status(200).json({
      success: true,
      data: {
        roomId: room._id,
        roomType: room.roomType,
        totalQuantity: room.totalQuantity,
        bookedUnits,
        availableUnits: Math.max(0, availableUnits),
        isAvailable: availableUnits >= requested,
        requestedQuantity: requested
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Hotel Manager who owns the hotel, Admin)
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Role check
    if (req.user.role !== 'admin' && room.hotel.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this room'
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Hotel Manager who owns the hotel, Admin)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Role check
    if (req.user.role !== 'admin' && room.hotel.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this room'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  checkRoomAvailability,
  updateRoom,
  deleteRoom
};
