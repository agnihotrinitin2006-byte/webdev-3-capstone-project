import { apiRequest } from './api';

export const userService = {
  // Get all users (Admin only)
  getAllUsers: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.role) searchParams.append('role', params.role);
    if (params.search) searchParams.append('search', params.search);
    const queryString = searchParams.toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET'
    });
  },

  // Get user by ID
  getUserById: (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'GET'
    });
  },

  // Update user
  updateUser: (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Delete user
  deleteUser: (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};
