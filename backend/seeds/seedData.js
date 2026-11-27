const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stayeasy_db';
    await mongoose.connect(mongoUri);
    console.log('[StayEasy Seed] Connected to MongoDB...');

    // Clear existing collections
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await Hotel.deleteMany({});
    await User.deleteMany({});
    console.log('[StayEasy Seed] Cleared old database collections.');

    // 1. Create Users for all 3 roles
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@stayeasy.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 019-2831'
    });

    const manager = await User.create({
      name: 'Sarah Jenkins',
      email: 'manager@stayeasy.com',
      password: 'password123',
      role: 'hotel_manager',
      phone: '+1 (555) 014-9982'
    });

    const guest = await User.create({
      name: 'Alex Johnson',
      email: 'guest@stayeasy.com',
      password: 'password123',
      role: 'guest',
      phone: '+1 (555) 018-4421'
    });

    console.log('[StayEasy Seed] Created Users: Admin, Hotel Manager, Guest');

    // 2. Create Hotels
    const hotel1 = await Hotel.create({
      name: 'The Grand Azure Resort & Spa',
      description: 'Experience luxury at its finest with panoramic ocean views, award-winning dining, infinity pools, and world-class spa facilities in the heart of Miami.',
      address: '1240 Ocean Drive, South Beach',
      city: 'Miami',
      country: 'United States',
      manager: manager._id,
      rating: 4.8,
      phone: '+1 (305) 555-0143',
      email: 'concierge@grandazure.com',
      amenities: ['Ocean View', 'Infinity Pool', 'Luxury Spa', 'Free Wi-Fi', 'Fine Dining', 'Fitness Center', 'Valet Parking'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
      ]
    });

    const hotel2 = await Hotel.create({
      name: 'Metropolitan Skyline Hotel',
      description: 'Sophisticated metropolitan living towering over Manhattan. Steps away from Central Park, luxury boutique shopping, Broadway theaters, and Michelin-starred restaurants.',
      address: '550 5th Avenue, Midtown',
      city: 'New York',
      country: 'United States',
      manager: manager._id,
      rating: 4.7,
      phone: '+1 (212) 555-0188',
      email: 'info@metropolitanskyline.com',
      amenities: ['City View', 'Rooftop Bar', 'High-Speed Wi-Fi', '24/7 Room Service', 'Business Lounge', 'Airport Shuttle'],
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
      ]
    });

    const hotel3 = await Hotel.create({
      name: 'Pacific Bay Boutique Haven',
      description: 'A tranquil sanctuary overlooking the sparkling San Francisco bay. Blends contemporary architecture with warm coastal hospitality and bespoke organic breakfast.',
      address: '88 Embarcadero Way',
      city: 'San Francisco',
      country: 'United States',
      manager: manager._id,
      rating: 4.6,
      phone: '+1 (415) 555-0122',
      email: 'stay@pacificbayhaven.com',
      amenities: ['Bay View', 'Heated Pool', 'Free Wi-Fi', 'Complimentary Breakfast', 'Pet Friendly', 'Bicycle Rental'],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
      ]
    });

    console.log('[StayEasy Seed] Created Hotels.');

    // 3. Create Rooms
    const room1 = await Room.create({
      hotel: hotel1._id,
      roomType: 'Deluxe Ocean View Room',
      description: 'King bed with expansive floor-to-ceiling windows overlooking South Beach and the Atlantic Ocean.',
      pricePerNight: 280,
      capacity: 2,
      totalQuantity: 5,
      bedType: '1 King Bed',
      amenities: ['Private Balcony', 'Ocean View', 'Mini Bar', 'Espresso Machine', 'Marble Bathroom', 'Wi-Fi'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80']
    });

    const room2 = await Room.create({
      hotel: hotel1._id,
      roomType: 'Executive Royal Suite',
      description: 'Opulent multi-room suite with private terrace, personal jacuzzi, dedicated butler, and panoramic coastal views.',
      pricePerNight: 550,
      capacity: 4,
      totalQuantity: 2,
      bedType: '2 King Beds',
      amenities: ['Private Jacuzzi', 'Terrace', 'Living Room', 'Free Champagne', 'Butler Service', 'High-Speed Wi-Fi'],
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80']
    });

    const room3 = await Room.create({
      hotel: hotel2._id,
      roomType: 'Skyline Superior Double',
      description: 'Contemporary double room with stunning Manhattan skyline vistas and luxury feather bedding.',
      pricePerNight: 220,
      capacity: 2,
      totalQuantity: 8,
      bedType: '1 Queen Bed',
      amenities: ['City View', 'Work Desk', 'Smart 4K TV', 'Rain Shower', 'Free Wi-Fi'],
      images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80']
    });

    const room4 = await Room.create({
      hotel: hotel2._id,
      roomType: 'Penthouse Panorama Suite',
      description: 'Spectacular penthouse with 360-degree glass views of Manhattan, walk-in closet, and designer soaking tub.',
      pricePerNight: 650,
      capacity: 3,
      totalQuantity: 2,
      bedType: '1 King Bed + 1 Sofa Bed',
      amenities: ['Panoramic View', 'Soaking Tub', 'Designer Amenities', 'Complimentary Minibar', 'VIP Lounge Access'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80']
    });

    const room5 = await Room.create({
      hotel: hotel3._id,
      roomType: 'Coastal Comfort King',
      description: 'Serene guestroom with artisan wood furnishings, plush linens, and a cozy private reading nook.',
      pricePerNight: 195,
      capacity: 2,
      totalQuantity: 6,
      bedType: '1 King Bed',
      amenities: ['Balcony', 'Espresso Maker', 'Organic Toiletries', 'Wi-Fi', 'Smart TV'],
      images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80']
    });

    console.log('[StayEasy Seed] Created Rooms.');

    // 4. Create Sample Bookings for reports and history
    const today = new Date();
    
    // Future Confirmed Booking for Guest
    const checkInFuture = new Date(today);
    checkInFuture.setDate(today.getDate() + 5);
    const checkOutFuture = new Date(today);
    checkOutFuture.setDate(today.getDate() + 8);

    await Booking.create({
      bookingId: 'SE-882194',
      user: guest._id,
      hotel: hotel1._id,
      room: room1._id,
      checkInDate: checkInFuture,
      checkOutDate: checkOutFuture,
      nights: 3,
      roomQuantity: 1,
      totalAmount: 3 * 280,
      guestDetails: {
        name: 'Alex Johnson',
        email: 'guest@stayeasy.com',
        phone: '+1 (555) 018-4421',
        specialRequests: 'Quiet room on a high floor please.'
      },
      status: 'confirmed'
    });

    // Past completed booking for Guest
    const checkInPast = new Date(today);
    checkInPast.setDate(today.getDate() - 14);
    const checkOutPast = new Date(today);
    checkOutPast.setDate(today.getDate() - 11);

    await Booking.create({
      bookingId: 'SE-743120',
      user: guest._id,
      hotel: hotel2._id,
      room: room3._id,
      checkInDate: checkInPast,
      checkOutDate: checkOutPast,
      nights: 3,
      roomQuantity: 1,
      totalAmount: 3 * 220,
      guestDetails: {
        name: 'Alex Johnson',
        email: 'guest@stayeasy.com',
        phone: '+1 (555) 018-4421',
        specialRequests: 'Late check-in at 8 PM.'
      },
      status: 'confirmed'
    });

    // Sample Cancelled Booking
    const checkInCancelled = new Date(today);
    checkInCancelled.setDate(today.getDate() + 20);
    const checkOutCancelled = new Date(today);
    checkOutCancelled.setDate(today.getDate() + 22);

    await Booking.create({
      bookingId: 'SE-109348',
      user: guest._id,
      hotel: hotel3._id,
      room: room5._id,
      checkInDate: checkInCancelled,
      checkOutDate: checkOutCancelled,
      nights: 2,
      roomQuantity: 1,
      totalAmount: 2 * 195,
      guestDetails: {
        name: 'Alex Johnson',
        email: 'guest@stayeasy.com',
        phone: '+1 (555) 018-4421',
        specialRequests: ''
      },
      status: 'cancelled',
      cancellationReason: 'Trip rescheduled due to meeting changes.',
      cancelledAt: new Date()
    });

    console.log('[StayEasy Seed] Created Sample Bookings.');
    console.log('\n=============================================');
    console.log(' StayEasy Database Seeded Successfully! ');
    console.log('=============================================');
    console.log('Login credentials:');
    console.log(' - Admin:    admin@stayeasy.com   / password123');
    console.log(' - Manager:  manager@stayeasy.com / password123');
    console.log(' - Guest:    guest@stayeasy.com   / password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[StayEasy Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
