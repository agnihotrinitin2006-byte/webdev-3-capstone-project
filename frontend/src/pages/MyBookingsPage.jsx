import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import Modal from '../components/common/Modal';
import { Calendar, MapPin, AlertCircle, FileText, XCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tab filter: 'all', 'confirmed', 'cancelled'
  const [statusFilter, setStatusFilter] = useState('all');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    bookingService
      .getMyBookings()
      .then((res) => {
        if (res.success) {
          setBookings(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setCancelling(true);
    try {
      const res = await bookingService.cancelBooking(
        selectedBooking._id,
        cancelReason || 'Requested by guest'
      );
      if (res.success) {
        setSuccessMsg(`Booking ${selectedBooking.bookingId} cancelled. Room inventory is restored.`);
        setCancelModalOpen(false);
        fetchBookings();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Bookings History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review, track, and manage your hotel reservations and cancellations.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {['all', 'confirmed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {successMsg && <AlertMessage type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      {loading ? (
        <LoadingSpinner text="Loading your reservations..." />
      ) : filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr auto',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              {/* Hotel & ID Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {b.bookingId}
                  </span>
                  <span className={`badge badge-${b.status}`}>
                    {b.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
                  {b.hotel?.name || 'Hotel'}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#0284c7" />
                  {b.hotel?.city}, {b.hotel?.address}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {b.room?.roomType} ({b.roomQuantity} Room{b.roomQuantity > 1 ? 's' : ''})
                </div>
              </div>

              {/* Dates */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Reservation Dates
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>
                  {new Date(b.checkInDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>to</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  {new Date(b.checkOutDate).toLocaleDateString()} ({b.nights} nights)
                </div>
              </div>

              {/* Price */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Amount
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  ${b.totalAmount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to={`/bookings/${b._id}`} className="btn btn-secondary btn-sm">
                  <FileText size={14} /> Receipt
                </Link>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleOpenCancel(b)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Calendar size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No bookings found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {statusFilter === 'all'
              ? 'You have not made any room reservations yet.'
              : `You have no ${statusFilter} bookings.`}
          </p>
          <Link to="/hotels" className="btn btn-primary">
            Find Your Next Stay
          </Link>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Booking Cancellation"
      >
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Are you sure you want to cancel booking <strong>{selectedBooking?.bookingId}</strong> at{' '}
          <strong>{selectedBooking?.hotel?.name}</strong>?
        </p>

        <form onSubmit={handleConfirmCancel}>
          <div className="form-group">
            <label className="form-label">Reason for Cancellation (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Schedule change, personal reasons"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="btn btn-secondary"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
