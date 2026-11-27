import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, User, LogOut, Calendar, ShieldCheck, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'hotel_manager') return '/manager/dashboard';
    return '/guest/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <Building2 size={24} />
          </div>
          <span>StayEasy</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/hotels" className="nav-link">
              Explore Hotels
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to={getDashboardPath()} className="nav-link">
                  Dashboard
                </Link>
              </li>
              {user?.role === 'guest' && (
                <li>
                  <Link to="/my-bookings" className="nav-link">
                    My Bookings
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link
                to={getDashboardPath()}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {user?.role === 'admin' && <ShieldCheck size={16} color="#be185d" />}
                {user?.role === 'hotel_manager' && <Briefcase size={16} color="#b45309" />}
                {user?.role === 'guest' && <User size={16} color="#0284c7" />}
                <span>{user?.name?.split(' ')[0]}</span>
                <span className={`badge badge-${user?.role === 'hotel_manager' ? 'manager' : user?.role}`}>
                  {user?.role === 'hotel_manager' ? 'Manager' : user?.role}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
