import { apiRequest } from './api';

export const reportService = {
  // Get main dashboard KPI metrics
  getDashboardStats: () => {
    return apiRequest('/reports/dashboard', {
      method: 'GET'
    });
  },

  // Get monthly and hotel revenue
  getRevenueReport: () => {
    return apiRequest('/reports/revenue', {
      method: 'GET'
    });
  },

  // Get occupancy rate and popular hotel breakdown
  getOccupancyReport: () => {
    return apiRequest('/reports/occupancy', {
      method: 'GET'
    });
  }
};
