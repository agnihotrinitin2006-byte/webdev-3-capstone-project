import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { hotelService } from '../services/hotelService';
import { useBooking } from '../context/BookingContext';
import RoomCard from '../components/hotel/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { ArrowLeft } from 'lucide-react';

export default function RoomSelectionPage() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setDraft } = useBooking();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    setLoading(true);
    hotelService
      .getHotelById(hotelId)
      .then((res) => {
        if (res.success) {
          setHotel(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load hotel rooms'))
      .finally(() => setLoading(false));
  }, [hotelId]);

  const handleSelect = (room) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    setDraft({
      hotel,
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      roomQuantity: 1,
      totalAmount: nights * room.pricePerNight
    });

    navigate('/booking/confirm');
  };

  if (loading) return <LoadingSpinner text="Loading available rooms..." />;
  if (error) return <div className="container" style={{ padding: '60px 24px' }}><AlertMessage type="danger" message={error} /></div>;
  if (!hotel) return null;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <button
        onClick={() => navigate(`/hotels/${hotelId}`)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back to {hotel.name}
      </button>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Choose Your Room at {hotel.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Selected Dates: <strong>{checkIn}</strong> to <strong>{checkOut}</strong> ({hotel.city})
        </p>
      </div>

      <div>
        {hotel.rooms?.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelectRoom={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
