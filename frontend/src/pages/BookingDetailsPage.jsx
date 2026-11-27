import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { Building2, Calendar, MapPin, Printer, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    bookingService
      .getBookingById(id)
      .then((res) => {
        if (res.success) {
          setBooking(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Booking receipt could not be loaded'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving booking receipt..." />;
  if (error) return <div className="container" style={{ padding: '60px 24px' }}><AlertMessage type="danger" message={error} /></div>;
  if (!booking) return null;

  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm">
          <Printer size={16} /> Print Receipt
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Receipt Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.4rem' }}>
              <Building2 size={24} /> StayEasy
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Official Reservation Receipt & Voucher
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge badge-${booking.status}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {booking.status}
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>
              {booking.bookingId}
            </div>
          </div>
        </div>

        {/* Property & Stay Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Hotel Property
            </h3>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{booking.hotel?.name}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {booking.hotel?.address}, {booking.hotel?.city}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Phone: {booking.hotel?.phone || 'Front desk available 24/7'}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Guest Details
            </h3>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.guestDetails?.name}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Email: {booking.guestDetails?.email}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Phone: {booking.guestDetails?.phone}
            </div>
          </div>
        </div>

        {/* Booking Timeline */}
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-In</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
                {new Date(booking.checkInDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From 3:00 PM</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                {booking.nights} Night{booking.nights > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.roomQuantity} Room Unit(s)</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-Out</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px' }}>
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Until 11:00 AM</div>
            </div>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Payment Summary
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
            <span>Room Type:</span>
            <strong>{booking.room?.roomType}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
            <span>Rate per Night:</span>
            <span>${booking.room?.pricePerNight}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
            <span>Calculated ({booking.nights} nights × {booking.roomQuantity} room):</span>
            <span>${booking.totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
            <span>Total Paid / Reserved:</span>
            <span>${booking.totalAmount}</span>
          </div>
        </div>

        {booking.status === 'cancelled' && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--danger-light)', borderRadius: '10px', color: '#991b1b', fontSize: '0.9rem' }}>
            <div style={{ fontWeight: 700 }}>Reservation Cancelled</div>
            <div>Reason: {booking.cancellationReason || 'Cancelled by guest'}</div>
            {booking.cancelledAt && <div>Cancelled on: {new Date(booking.cancelledAt).toLocaleString()}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
