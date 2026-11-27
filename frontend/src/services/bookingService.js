import { apiRequest } from './api';

export const bookingService = {
  // Create booking
  createBooking: (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  // Get current user's bookings
  getMyBookings: () => {
    return apiRequest('/bookings/my-bookings', {
      method: 'GET'
    });
  },

  // Get booking details by ID
  getBookingById: (id) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'GET'
    });
  },

  // Get all bookings (Manager/Admin)
  getAllBookings: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) searchParams.append(key, params[key]);
    });
    const queryString = searchParams.toString();
    return apiRequest(`/bookings${queryString ? `?${queryString}` : ''}`, {
      method: 'GET'
    });
  },

  // Cancel booking
  cancelBooking: (id, reason) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason })
    });
  }
};
