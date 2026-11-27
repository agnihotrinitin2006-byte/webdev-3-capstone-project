import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { Calendar, CheckCircle2, XCircle, DollarSign, ArrowRight, Eye } from 'lucide-react';

export default function GuestDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then((res) => {
        if (res.success) {
          setBookings(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load guest stats'))
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Guest Portal</h1>
          <p className="page-description">Welcome back, {user?.name}! Here is your travel overview.</p>
        </div>
        <Link to="/hotels" className="btn btn-primary">
          <span>Find Hotels</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Loading guest account statistics..." />
      ) : (
        <>
          {/* Key Stat Cards */}
          <div className="stats-grid">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              icon={Calendar}
              color="blue"
              subtitle="All reservations"
            />
            <StatCard
              title="Confirmed Stays"
              value={confirmedBookings}
              icon={CheckCircle2}
              color="green"
              subtitle="Upcoming & completed"
            />
            <StatCard
              title="Cancelled"
              value={cancelledBookings}
              icon={XCircle}
              color="yellow"
              subtitle="Cancelled reservations"
            />
            <StatCard
              title="Total Expenditure"
              value={`$${totalSpent}`}
              icon={DollarSign}
              color="purple"
              subtitle="Confirmed stays"
            />
          </div>

          {/* Recent Reservations Table */}
          <div style={{ marginTop: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Reservations</h2>
              <Link to="/my-bookings" className="btn btn-secondary btn-sm">
                View All Bookings
              </Link>
            </div>

            {bookings.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Hotel</th>
                      <th>Room Type</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b._id}>
                        <td>
                          <strong>{b.bookingId}</strong>
                        </td>
                        <td>{b.hotel?.name || 'Hotel'}</td>
                        <td>{b.room?.roomType}</td>
                        <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                        <td>
                          <strong style={{ color: 'var(--primary)' }}>${b.totalAmount}</strong>
                        </td>
                        <td>
                          <span className={`badge badge-${b.status}`}>{b.status}</span>
                        </td>
                        <td>
                          <Link to={`/bookings/${b._id}`} className="btn btn-secondary btn-sm">
                            <Eye size={14} /> Receipt
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No bookings yet. Explore our top luxury hotels to reserve your first room!</p>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
