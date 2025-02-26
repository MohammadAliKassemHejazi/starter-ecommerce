import httpClient from '../utils/httpClient';

// Get Sales Data
export const getSalesData = async () => {
  return httpClient.get('/inventory/sales');
};

// Get Inventory Alerts
export const getInventoryAlerts = async () => {
  return httpClient.get('/inventory/alerts');
};

// Get Order Statuses
export const getOrderStatuses = async () => {
  return httpClient.get('/inventory/orders/status');
};