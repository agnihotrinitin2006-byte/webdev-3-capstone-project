import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import AlertMessage from '../components/common/AlertMessage';
import { ShieldCheck, Calendar, Bed, Users, Building, ArrowLeft, CheckCircle } from 'lucide-react';

export default function BookingConfirmationPage() {
  const { user } = useAuth();
  const { bookingDraft, clearDraft } = useBooking();
  const navigate = useNavigate();

  const { hotel, room, checkInDate, checkOutDate, nights } = bookingDraft;

  const [quantity, setQuantity] = useState(bookingDraft.roomQuantity || 1);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!hotel || !room) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>No Active Room Reservation Selected</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
          Please browse our hotel listings and select a room to begin reservation.
        </p>
        <Link to="/hotels" className="btn btn-primary">
          Explore Hotels
        </Link>
      </div>
    );
  }

  const roomPrice = room.pricePerNight || 0;
  const totalAmount = nights * roomPrice * quantity;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      return setError('Please provide guest name, email, and contact phone number.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await bookingService.createBooking({
        hotelId: hotel._id,
        roomId: room._id,
        checkInDate,
        checkOutDate,
        roomQuantity: quantity,
        guestDetails: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          specialRequests
        }
      });

      if (res.success) {
        setBookingSuccess(res.data);
        clearDraft();
      }
    } catch (err) {
      setError(err.message || 'Booking failed. Double booking or inventory conflict occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="container" style={{ padding: '60px 24px', maxWidth: '640px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your reservation has been confirmed with guaranteed room allocation.
          </p>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '28px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Booking Reference:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{bookingSuccess.bookingId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hotel:</span>
              <strong>{bookingSuccess.hotel?.name || hotel.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Room:</span>
              <strong>{bookingSuccess.room?.roomType || room.roomType} ({bookingSuccess.roomQuantity} unit)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dates:</span>
              <strong>{new Date(bookingSuccess.checkInDate).toLocaleDateString()} to {new Date(bookingSuccess.checkOutDate).toLocaleDateString()} ({bookingSuccess.nights} nights)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ fontWeight: 700 }}>Total Paid / Due:</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>${bookingSuccess.totalAmount}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/my-bookings" className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to={`/bookings/${bookingSuccess._id}`} className="btn btn-secondary">
              Booking Receipt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '28px' }}>Confirm Your Reservation</h1>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '36px', alignItems: 'flex-start' }}>
        {/* Guest Details Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Primary Guest Information</h2>

          <form onSubmit={handleConfirmBooking}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests (Optional)</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Quiet room, late arrival, extra towels"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', margin: '24px 0', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                <ShieldCheck size={18} /> Zero Double-Booking Protection
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Your room quantity is atomically checked against confirmed bookings to prevent overlaps.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Confirming Reservation...' : `Book Now – Total $${totalAmount}`}
            </button>
          </form>
        </div>

        {/* Booking Summary Sidebar Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Reservation Summary</h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <img
              src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
              alt={hotel.name}
              style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{hotel.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hotel.city}, {hotel.country}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{room.roomType}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
              <span><Users size={14} style={{ verticalAlign: 'middle' }} /> Up to {room.capacity} guests</span>
              <span><Bed size={14} style={{ verticalAlign: 'middle' }} /> {room.bedType || 'King Bed'}</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Check-in:</span>
              <strong>{checkInDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Check-out:</span>
              <strong>{checkOutDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Length of Stay:</span>
              <strong>{nights} Night{nights > 1 ? 's' : ''}</strong>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Number of Rooms</label>
            <select
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Room{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span>${roomPrice} × {nights} nights × {quantity} room(s)</span>
              <span>${totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', color: 'var(--primary)' }}>
              <span>Total Price:</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
