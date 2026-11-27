import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import {
  Building2,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  PlusCircle,
  BedDouble,
  BarChart2
} from 'lucide-react';

export default function HotelManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    reportService
      .getDashboardStats()
      .then((res) => {
        if (res.success) {
          setStats(res.data);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load manager dashboard metrics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hotel Manager Hub</h1>
          <p className="page-description">
            Oversee properties, inventory, guest reservations, and revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/manager/hotels/add" className="btn btn-primary">
            <PlusCircle size={16} /> Add Hotel
          </Link>
          <Link to="/reports" className="btn btn-secondary">
            <BarChart2 size={16} /> Reports
          </Link>
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Computing hotel metrics and inventory occupancy..." />
      ) : stats ? (
        <>
          {/* KPI Stat Cards */}
          <div className="stats-grid">
            <StatCard
              title="Hotels Managed"
              value={stats.totalHotels}
              icon={Building2}
              color="blue"
              subtitle="Registered properties"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              subtitle="Confirmed stays"
            />
            <StatCard
              title="Confirmed Bookings"
              value={stats.confirmedBookings}
              icon={CalendarCheck}
              color="purple"
              subtitle={`${stats.totalBookings} total`}
            />
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              icon={TrendingUp}
              color="yellow"
              subtitle={`${stats.totalInventoryUnits} room units`}
            />
          </div>

          {/* Quick Management Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '32px 0' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Properties Portfolio</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Update hotel profiles, addresses, contact details, and marketing amenities.
              </p>
              <Link to="/manager/hotels" className="btn btn-secondary btn-sm">
                Manage Hotels &rarr;
              </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Room Inventory</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Set room capacities, pricing per night, and total unit quantity for bookings.
              </p>
              <Link to="/manager/rooms" className="btn btn-secondary btn-sm">
                Manage Rooms &rarr;
              </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Revenue & Occupancy</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Run MongoDB aggregation pipelines for monthly income and hotel occupancy.
              </p>
              <Link to="/reports" className="btn btn-secondary btn-sm">
                View Analytics &rarr;
              </Link>
            </div>
          </div>

          {/* Recent Hotel Bookings */}
          <div style={{ marginTop: '36px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Recent Property Bookings
            </h2>

            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Hotel</th>
                      <th>Room</th>
                      <th>Guest Name</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td><strong>{b.bookingId}</strong></td>
                        <td>{b.hotel?.name}</td>
                        <td>{b.room?.roomType}</td>
                        <td>{b.guestDetails?.name || b.user?.name}</td>
                        <td>
                          {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                        </td>
                        <td><strong style={{ color: 'var(--primary)' }}>${b.totalAmount}</strong></td>
                        <td>
                          <span className={`badge badge-${b.status}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No bookings received for your properties yet.</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
}
