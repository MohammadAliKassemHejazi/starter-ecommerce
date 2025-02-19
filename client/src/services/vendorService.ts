import httpClient from '../utils/httpClient';

// Get Sales Data
export const getSalesData = async () => {
  return httpClient.get('/api/sales');
};

// Get Inventory Alerts
export const getInventoryAlerts = async () => {
  return httpClient.get('/api/inventory/alerts');
};

// Get Order Statuses
export const getOrderStatuses = async () => {
  return httpClient.get('/api/orders/status');
};