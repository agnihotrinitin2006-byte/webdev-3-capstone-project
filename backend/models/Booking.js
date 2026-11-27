const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
      index: true
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
      index: true
    },
    nights: {
      type: Number,
      required: true,
      min: [1, 'Booking must be for at least 1 night']
    },
    roomQuantity: {
      type: Number,
      required: true,
      min: [1, 'Room quantity must be at least 1'],
      default: 1
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Total amount cannot be negative']
    },
    guestDetails: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      specialRequests: {
        type: String,
        default: '',
        trim: true
      }
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast overlap querying
bookingSchema.index({ room: 1, status: 1, checkInDate: 1, checkOutDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
