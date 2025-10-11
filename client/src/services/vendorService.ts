import httpClient from '../utils/httpClient';

// Get Sales Data
export const getSalesData = async () => {
  const { data: response } = await httpClient.get('/admin/inventory/sales');
  console.log(response , "sales data");
  return response;
};

// Get Inventory Alerts
export const getInventoryAlerts = async () => {
   const { data: response } = await httpClient.get('/admin/inventory/alerts');
  return response;
};

// Get Order Statuses
export const getOrderStatuses = async () => {
  const { data: response } = await httpClient.get('/admin/inventory/orders/status');
  return response;
};