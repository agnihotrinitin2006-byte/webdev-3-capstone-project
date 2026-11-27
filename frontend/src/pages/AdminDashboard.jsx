import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import {
  ShieldAlert,
  Building,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Users,
  BarChart3,
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
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
      .catch((err) => setError(err.message || 'Failed to load administrative overview'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Console</h1>
          <p className="page-description">
            Complete platform monitoring, user management, and system-wide revenue governance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/users" className="btn btn-primary">
            <Users size={16} /> Manage Users
          </Link>
          <Link to="/reports" className="btn btn-secondary">
            <BarChart3 size={16} /> Reports & Analytics
          </Link>
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Aggregating platform metrics from MongoDB..." />
      ) : stats ? (
        <>
          <div className="stats-grid">
            <StatCard
              title="System Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              subtitle="All confirmed stays"
            />
            <StatCard
              title="Total Hotels"
              value={stats.totalHotels}
              icon={Building}
              color="blue"
              subtitle="Across all cities"
            />
            <StatCard
              title="Room Inventory"
              value={stats.totalInventoryUnits}
              icon={Layers}
              color="purple"
              subtitle={`${stats.totalRooms} room types`}
            />
            <StatCard
              title="Avg Occupancy"
              value={`${stats.occupancyRate}%`}
              icon={TrendingUp}
              color="yellow"
              subtitle="Estimated 30-day rate"
            />
          </div>

          {/* Quick Admin Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', margin: '32px 0' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Users size={20} color="#be185d" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>User Management</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                View, filter, promote, block, or delete registered Guests, Hotel Managers, and Admins.
              </p>
              <Link to="/admin/users" className="btn btn-secondary btn-sm">
                Open User Manager &rarr;
              </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Building size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hotel Directory</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Inspect and manage all listed hotels, modify details, or remove properties.
              </p>
              <Link to="/manager/hotels" className="btn btn-secondary btn-sm">
                Manage All Hotels &rarr;
              </Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <BarChart3 size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reports & Analytics</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                MongoDB aggregation reports for monthly revenue, hotel breakdown, and popularity.
              </p>
              <Link to="/reports" className="btn btn-secondary btn-sm">
                Explore Analytics &rarr;
              </Link>
            </div>
          </div>

          {/* System Recent Bookings */}
          <div style={{ marginTop: '36px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Latest Platform Bookings
            </h2>

            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Hotel Property</th>
                      <th>Room Type</th>
                      <th>Guest Details</th>
                      <th>Reservation Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td><strong>{b.bookingId}</strong></td>
                        <td>{b.hotel?.name} ({b.hotel?.city})</td>
                        <td>{b.room?.roomType}</td>
                        <td>
                          <div>{b.guestDetails?.name || b.user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {b.guestDetails?.email || b.user?.email}
                          </div>
                        </td>
                        <td>
                          {new Date(b.checkInDate).toLocaleDateString()} &rarr; {new Date(b.checkOutDate).toLocaleDateString()}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary)' }}>${b.totalAmount}</strong>
                        </td>
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
                <p style={{ color: 'var(--text-muted)' }}>No bookings recorded yet.</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
}
