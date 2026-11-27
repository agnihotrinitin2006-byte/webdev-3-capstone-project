import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportService.getDashboardStats(),
      reportService.getRevenueReport(),
      reportService.getOccupancyReport()
    ])
      .then(([dashRes, revRes, occRes]) => {
        if (dashRes.success) setDashboardStats(dashRes.data);
        if (revRes.success) setRevenueData(revRes.data);
        if (occRes.success) setOccupancyData(occRes.data);
      })
      .catch((err) => setError(err.message || 'Failed to aggregate analytics reports'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-description">
            Live business intelligence computed via MongoDB aggregation pipelines.
          </p>
        </div>
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Running MongoDB aggregation pipelines across bookings & revenue..." />
      ) : (
        <>
          {/* Main Aggregation Stats Cards */}
          {dashboardStats && (
            <div className="stats-grid">
              <StatCard
                title="Total Gross Revenue"
                value={`$${dashboardStats.totalRevenue?.toLocaleString() || 0}`}
                icon={DollarSign}
                color="green"
                subtitle="Confirmed reservations"
              />
              <StatCard
                title="Occupancy Rate"
                value={`${dashboardStats.occupancyRate || 0}%`}
                icon={TrendingUp}
                color="yellow"
                subtitle="Calculated on active units"
              />
              <StatCard
                title="Confirmed Stays"
                value={dashboardStats.confirmedBookings || 0}
                icon={CheckCircle}
                color="blue"
                subtitle={`${dashboardStats.totalBookings || 0} total bookings`}
              />
              <StatCard
                title="Cancelled Bookings"
                value={dashboardStats.cancelledBookings || 0}
                icon={XCircle}
                color="purple"
                subtitle="Restored to inventory"
              />
            </div>
          )}

          {/* Section 1: Hotel-Wise Revenue Aggregation */}
          <div style={{ marginTop: '36px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>
              Hotel-Wise Revenue & Bookings (MongoDB Aggregation)
            </h2>

            {revenueData?.hotelRevenue && revenueData.hotelRevenue.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Hotel Property</th>
                      <th>Location</th>
                      <th>Confirmed Bookings</th>
                      <th>Gross Revenue</th>
                      <th>Revenue Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.hotelRevenue.map((item) => {
                      const totalRev = dashboardStats?.totalRevenue || 1;
                      const sharePercent = Math.round((item.totalRevenue / (totalRev || 1)) * 100);

                      return (
                        <tr key={item._id}>
                          <td><strong>{item.hotelName}</strong></td>
                          <td>{item.city}</td>
                          <td>{item.totalBookings} reservation{item.totalBookings > 1 ? 's' : ''}</td>
                          <td>
                            <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                              ${item.totalRevenue.toLocaleString()}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                  style={{
                                    width: `${sharePercent}%`,
                                    height: '100%',
                                    backgroundColor: 'var(--primary)'
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, width: '36px' }}>
                                {sharePercent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No hotel revenue records generated yet.</p>
              </div>
            )}
          </div>

          {/* Section 2: Monthly Revenue & Most Popular Hotels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginTop: '36px' }}>
            {/* Monthly Revenue Breakdown */}
            <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Calendar size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Monthly Revenue</h3>
              </div>

              {revenueData?.monthlyRevenue && revenueData.monthlyRevenue.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {revenueData.monthlyRevenue.map((m, idx) => (
                    <div key={idx} style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700 }}>
                          {monthNames[m.month]} {m.year}
                        </span>
                        <strong style={{ color: 'var(--primary)' }}>${m.revenue.toLocaleString()}</strong>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {m.bookingsCount} confirmed stay{m.bookingsCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No monthly booking data available yet.</p>
              )}
            </div>

            {/* Most Popular Hotels */}
            <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Award size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Most Popular Hotels</h3>
              </div>

              {occupancyData?.popularHotels && occupancyData.popularHotels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {occupancyData.popularHotels.map((item, index) => (
                    <div
                      key={item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: index === 0 ? '#fef3c7' : 'var(--bg-subtle)',
                            color: index === 0 ? '#b45309' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem'
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.city} &bull; ★ {item.rating}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.bookingCount} Stays</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${item.totalRevenue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No popularity data recorded yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
