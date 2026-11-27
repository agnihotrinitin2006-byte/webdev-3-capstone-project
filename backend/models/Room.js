const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Room must belong to a hotel'],
      index: true
    },
    roomType: {
      type: String,
      required: [true, 'Please specify room type'],
      trim: true
    },
    description: {
      type: String,
      default: 'Spacious and well-appointed room equipped with modern amenities for a comfortable stay.'
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide room price per night'],
      min: [0, 'Room price cannot be negative']
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide guest capacity'],
      min: [1, 'Capacity must be at least 1 person'],
      default: 2
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Please provide total quantity of rooms available'],
      min: [1, 'Quantity must be at least 1 room'],
      default: 1
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Flat Screen TV', 'Air Conditioning', 'Private Bathroom', 'Mini Fridge']
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    bedType: {
      type: String,
      default: 'King Bed',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', roomSchema);
