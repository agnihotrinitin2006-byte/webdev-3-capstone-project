const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hotel name'],
      trim: true,
      maxlength: [100, 'Hotel name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide hotel description']
    },
    address: {
      type: String,
      required: [true, 'Please provide hotel address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      index: true
    },
    country: {
      type: String,
      default: 'United States',
      trim: true
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Air Conditioning', 'Swimming Pool', 'Restaurant', 'Parking', '24/7 Front Desk']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field to populate rooms for a hotel
hotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotel',
  justOne: false
});

module.exports = mongoose.model('Hotel', hotelSchema);
