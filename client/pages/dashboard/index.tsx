import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from "@/store/store";
import {
  fetchSalesData,
  fetchInventoryAlerts,
  fetchOrderStatuses,
  selectSalesData,
  selectInventoryAlerts,
  selectOrderStatuses,
  selectLoading,
  selectError,
} from '@/store/slices/vendorDashboardSlice';
import SalesAnalytics from '@/components/Vendor/SalesAnalytics';
import InventoryAlerts from '@/components/Vendor/InventoryAlerts';
import OrderFulfillmentStatus from '@/components/Vendor/OrderFulfillmentStatus';
import Layout from '@/components/Layouts/Layout';
import ProtectedRoute from '@/components/protectedRoute';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const salesData = useSelector(selectSalesData);
  const inventoryAlerts = useSelector(selectInventoryAlerts);
  const orderStatuses = useSelector(selectOrderStatuses);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchSalesData());
    dispatch(fetchInventoryAlerts());
    dispatch(fetchOrderStatuses());
  }, [dispatch]);

    if (loading) { return <p>Loading...</p> };
    if (error) { return <p>Error: {error}</p> };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SalesAnalytics salesData={salesData} />
        <InventoryAlerts alerts={inventoryAlerts} />
      </div>
      <OrderFulfillmentStatus orders={orderStatuses} />
    </Layout>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}