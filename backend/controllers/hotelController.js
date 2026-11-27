const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private (Hotel Manager, Admin)
const createHotel = async (req, res, next) => {
  try {
    const { name, description, address, city, country, images, amenities, rating, phone, email } = req.body;

    // Set manager to current authenticated user unless admin explicitly specifies another manager
    let managerId = req.user._id;
    if (req.user.role === 'admin' && req.body.manager) {
      managerId = req.body.manager;
    }

    const hotel = await Hotel.create({
      name,
      description,
      address,
      city,
      country: country || 'United States',
      images: images && images.length > 0 ? images : undefined,
      amenities: amenities && amenities.length > 0 ? amenities : undefined,
      rating: rating || 4.5,
      phone: phone || '',
      email: email || '',
      manager: managerId
    });

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hotels with optional filtering, search, and date-availability
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const { city, search, minPrice, maxPrice, capacity, checkIn, checkOut } = req.query;

    const query = {};

    if (city && city.trim() !== '') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    let hotels = await Hotel.find(query)
      .populate('manager', 'name email phone')
      .populate('rooms')
      .sort({ createdAt: -1 });

    // Filter by date availability and price/capacity if specified
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find overlapping confirmed bookings
      const overlappingBookings = await Booking.find({
        status: 'confirmed',
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate }
      });

      // Map roomId -> bookedCount
      const bookedCounts = {};
      overlappingBookings.forEach((b) => {
        const roomIdStr = b.room.toString();
        bookedCounts[roomIdStr] = (bookedCounts[roomIdStr] || 0) + b.roomQuantity;
      });

      // Filter hotels that have at least one room available
      hotels = hotels.filter((hotel) => {
        if (!hotel.rooms || hotel.rooms.length === 0) return false;

        const availableRooms = hotel.rooms.filter((room) => {
          const booked = bookedCounts[room._id.toString()] || 0;
          const availableQty = room.totalQuantity - booked;
          let fitsCapacity = true;
          if (capacity) {
            fitsCapacity = room.capacity >= Number(capacity);
          }
          return availableQty > 0 && fitsCapacity;
        });

        return availableRooms.length > 0;
      });
    }

    // Filter by min/max price if rooms are populated
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      hotels = hotels.filter((hotel) => {
        if (!hotel.rooms || hotel.rooms.length === 0) return false;
        return hotel.rooms.some((r) => r.pricePerNight >= min && r.pricePerNight <= max);
      });
    }

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID with rooms
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('manager', 'name email phone')
      .populate('rooms');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hotels owned by logged-in manager
// @route   GET /api/hotels/manager/my-hotels
// @access  Private (Hotel Manager, Admin)
const getMyHotels = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'hotel_manager') {
      query.manager = req.user._id;
    }
    // If admin calls this, they can see all hotels or their own

    const hotels = await Hotel.find(query)
      .populate('rooms')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Hotel Manager who owns it, Admin)
const updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Role check: Hotel manager must own this hotel
    if (req.user.role !== 'admin' && hotel.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Hotel Manager who owns it, Admin)
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Role check: Hotel manager must own this hotel
    if (req.user.role !== 'admin' && hotel.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this hotel'
      });
    }

    // Cascade delete rooms associated with this hotel
    await Room.deleteMany({ hotel: hotel._id });

    // Delete the hotel
    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hotel and associated rooms removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  getMyHotels,
  updateHotel,
  deleteHotel
};
