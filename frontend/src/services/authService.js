import { apiRequest } from './api';

export const authService = {
  // Register a new user
  register: (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login existing user
  login: (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Fetch current authenticated user
  getMe: () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  // Update profile
  updateProfile: (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};
