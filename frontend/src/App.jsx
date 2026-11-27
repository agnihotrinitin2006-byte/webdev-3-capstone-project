import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// 18 Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HotelListingPage from './pages/HotelListingPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import RoomSelectionPage from './pages/RoomSelectionPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import GuestDashboard from './pages/GuestDashboard';
import HotelManagerDashboard from './pages/HotelManagerDashboard';
import AddHotelPage from './pages/AddHotelPage';
import ManageHotelsPage from './pages/ManageHotelsPage';
import ManageRoomsPage from './pages/ManageRoomsPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsersPage from './pages/ManageUsersPage';
import ReportsAnalyticsPage from './pages/ReportsAnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/hotels" element={<HotelListingPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/hotels/:hotelId/rooms" element={<RoomSelectionPage />} />

          {/* Protected Guest / User Routes */}
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['guest', 'hotel_manager', 'admin']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={['guest', 'hotel_manager', 'admin']}>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest/dashboard"
            element={
              <ProtectedRoute allowedRoles={['guest']}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Hotel Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['hotel_manager', 'admin']}>
                <HotelManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/hotels/add"
            element={
              <ProtectedRoute allowedRoles={['hotel_manager', 'admin']}>
                <AddHotelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/hotels"
            element={
              <ProtectedRoute allowedRoles={['hotel_manager', 'admin']}>
                <ManageHotelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/rooms"
            element={
              <ProtectedRoute allowedRoles={['hotel_manager', 'admin']}>
                <ManageRoomsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Shared Analytics Reports Route (Manager & Admin) */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['hotel_manager', 'admin']}>
                <ReportsAnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
