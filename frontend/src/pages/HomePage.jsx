import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/hotel/SearchBar';
import HotelCard from '../components/hotel/HotelCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { hotelService } from '../services/hotelService';
import { ShieldCheck, Zap, RefreshCw, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelService
      .getHotels()
      .then((res) => {
        if (res.success) {
          setFeaturedHotels(res.data.slice(0, 6));
        }
      })
      .catch((err) => console.error('Failed to fetch hotels:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Find & Reserve Your Ideal Stay, Effortlessly.
          </h1>
          <p className="hero-subtitle">
            Experience hand-picked hotels, real-time room availability, guaranteed zero-conflict booking, and transparent pricing.
          </p>
        </div>
      </section>

      {/* Interactive Search Bar */}
      <div className="container">
        <SearchBar />
      </div>

      {/* Featured Hotels */}
      <section className="container" style={{ padding: '40px 24px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '1px' }}>
              Handpicked Accommodations
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Luxury Hotels</h2>
          </div>
          <Link to="/hotels" className="btn btn-outline btn-sm">
            <span>View All Hotels</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Discovering top destinations..." />
        ) : featuredHotels.length > 0 ? (
          <div className="hotels-grid">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No hotels listed yet. Add hotels from the Manager portal!</p>
          </div>
        )}
      </section>

      {/* Features & Value Props */}
      <section style={{ backgroundColor: 'white', padding: '70px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Why Choose StayEasy?
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Built from the ground up for seamless travel planning, total booking confidence, and hotelier operational control.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            <div style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Instant Real-Time Confirmation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Every reservation locks instantly in MongoDB with immediate booking ID generation and zero lag.
              </p>
            </div>

            <div style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Zero Double-Booking Guarantee</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Strict atomic overlap checks safeguard every room inventory unit across active check-in/out dates.
              </p>
            </div>

            <div style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RefreshCw size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Effortless Cancellation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Change of plans? Guests can cancel eligible bookings with 1-click, automatically releasing room availability.
              </p>
            </div>

            <div style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Verified Quality Accommodations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Explore authentic high-resolution photos, verified amenities, guest capacities, and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
