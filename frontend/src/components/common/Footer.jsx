import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Building2 size={28} color="#38bdf8" />
              <h3 style={{ margin: 0 }}>StayEasy</h3>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Next-generation hotel booking system. Seamless reservations, instant confirmation, real-time inventory tracking, and smart room management.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/hotels">Browse Hotels</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>User Portals</h4>
            <ul>
              <li><Link to="/guest/dashboard">Guest Portal</Link></li>
              <li><Link to="/manager/dashboard">Manager Portal</Link></li>
              <li><Link to="/admin/dashboard">Admin Console</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Support</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '8px' }}>
              Have questions or need assistance?
            </p>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>
              support@stayeasy.com
            </p>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>
              +1 (800) 555-STAY (7829)
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StayEasy – Hotel Room Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
