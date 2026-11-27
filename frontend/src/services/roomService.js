import { apiRequest } from './api';

export const roomService = {
  // Get rooms (optionally by hotelId)
  getRooms: (hotelId) => {
    return apiRequest(`/rooms${hotelId ? `?hotelId=${hotelId}` : ''}`, {
      method: 'GET'
    });
  },

  // Get single room by ID
  getRoomById: (id) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'GET'
    });
  },

  // Check room availability for specific dates
  checkAvailability: (roomId, checkIn, checkOut, quantity = 1) => {
    return apiRequest(`/rooms/${roomId}/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&quantity=${quantity}`, {
      method: 'GET'
    });
  },

  // Create room
  createRoom: (roomData) => {
    return apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });
  },

  // Update room
  updateRoom: (id, roomData) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData)
    });
  },

  // Delete room
  deleteRoom: (id) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'DELETE'
    });
  }
};
