import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hotelService } from '../services/hotelService';
import { useBooking } from '../context/BookingContext';
import RoomCard from '../components/hotel/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { MapPin, Star, Phone, Mail, Check, Calendar, ArrowRight } from 'lucide-react';

export default function HotelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, updateSearch, setDraft } = useBooking();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date selection for live checking
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(searchParams.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || tomorrowStr);

  useEffect(() => {
    setLoading(true);
    hotelService
      .getHotelById(id)
      .then((res) => {
        if (res.success) {
          setHotel(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Hotel details could not be loaded'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDatesUpdate = (e) => {
    e.preventDefault();
    updateSearch({ checkIn, checkOut });
  };

  const handleSelectRoom = (room) => {
    // Calculate nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    setDraft({
      hotel,
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights: diffDays,
      roomQuantity: 1,
      totalAmount: diffDays * room.pricePerNight
    });

    navigate('/booking/confirm');
  };

  if (loading) return <LoadingSpinner text="Loading luxury hotel details and rooms..." />;
  if (error) return <div className="container" style={{ padding: '60px 24px' }}><AlertMessage type="danger" message={error} /></div>;
  if (!hotel) return null;

  const defaultImg =
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const mainImage = hotel.images && hotel.images.length > 0 ? hotel.images[0] : defaultImg;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.92rem' }}>
            <MapPin size={16} color="#0284c7" />
            <span>{hotel.address}, {hotel.city}, {hotel.country || 'USA'}</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{hotel.name}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{hotel.rating || 4.8}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', borderRadius: '16px', overflow: 'hidden', height: '420px', marginBottom: '36px' }}>
        <img
          src={mainImage}
          alt={hotel.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px', height: '100%' }}>
          <img
            src={hotel.images?.[1] || hotel.images?.[0] || defaultImg}
            alt="View"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <img
            src={hotel.images?.[2] || hotel.images?.[0] || defaultImg}
            alt="Interior"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Hotel Description & Amenities */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '40px', marginBottom: '50px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>About the Property</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '28px' }}>
            {hotel.description}
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '14px' }}>Property Amenities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {hotel.amenities?.map((amenity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                <Check size={16} color="#10b981" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selector Box */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', alignSelf: 'flex-start' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>Check Room Availability</h3>
          <form onSubmit={handleDatesUpdate}>
            <div className="form-group">
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                min={todayStr}
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-out Date</label>
              <input
                type="date"
                min={checkIn || todayStr}
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-block btn-sm">
              <Calendar size={16} /> Update Check Dates
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> {hotel.phone || '+1 (555) 019-4821'}</div>
            <div style={{ marginTop: '6px' }}><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> {hotel.email || 'reservations@stayeasy.com'}</div>
          </div>
        </div>
      </div>

      {/* Available Rooms Section */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Available Room Types</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Select your preferred room type for dates: <strong>{checkIn}</strong> to <strong>{checkOut}</strong>
          </p>
        </div>

        {hotel.rooms && hotel.rooms.length > 0 ? (
          <div>
            {hotel.rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectRoom={handleSelectRoom}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No rooms currently configured for this hotel.</p>
          </div>
        )}
      </section>
    </div>
  );
}
