import { apiRequest } from './api';

export const hotelService = {
  // Get all hotels with query parameters (city, search, minPrice, maxPrice, capacity, checkIn, checkOut)
  getHotels: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(`/hotels${queryString ? `?${queryString}` : ''}`, {
      method: 'GET'
    });
  },

  // Get single hotel by ID
  getHotelById: (id) => {
    return apiRequest(`/hotels/${id}`, {
      method: 'GET'
    });
  },

  // Get hotels owned by logged in hotel manager
  getMyHotels: () => {
    return apiRequest('/hotels/manager/my-hotels', {
      method: 'GET'
    });
  },

  // Create new hotel
  createHotel: (hotelData) => {
    return apiRequest('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData)
    });
  },

  // Update hotel
  updateHotel: (id, hotelData) => {
    return apiRequest(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData)
    });
  },

  // Delete hotel
  deleteHotel: (id) => {
    return apiRequest(`/hotels/${id}`, {
      method: 'DELETE'
    });
  }
};
