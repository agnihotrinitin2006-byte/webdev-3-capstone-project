import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Authenticating user session..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember where the user came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify user role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user's actual role
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'hotel_manager') return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/guest/dashboard" replace />;
  }

  return children;
}
