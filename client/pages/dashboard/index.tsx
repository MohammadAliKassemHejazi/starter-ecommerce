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
import { PackageLimits } from '@/components/Package/PackageLimits';
import { PackageManager } from '@/components/Package/PackageManager';
import { PageLayout } from '@/components/UI/PageComponents';
import ProtectedRoute from '@/components/protectedRoute';
import { usePageData } from '@/hooks/usePageData';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const salesData = useSelector(selectSalesData);
  const inventoryAlerts = useSelector(selectInventoryAlerts);
  const orderStatuses = useSelector(selectOrderStatuses);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const { isSuperAdmin } = usePageData({ loadUserPackage: true });

  useEffect(() => {
    dispatch(fetchSalesData());
    dispatch(fetchInventoryAlerts());
    dispatch(fetchOrderStatuses());
  }, [dispatch]);

  if (loading) {
    return (
      <PageLayout title="Vendor Dashboard" protected={true}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Vendor Dashboard" protected={true}>
        <div className="alert alert-danger">
          <h5>Error Loading Dashboard</h5>
          <p>Error: {error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Vendor Dashboard" protected={true}>
      {/* Package Information */}
      <div className="mb-6">
        <PackageLimits />
      </div>

      {/* Super Admin Package Management */}
      {isSuperAdmin && (
        <div className="mb-6">
          <PackageManager isSuperAdmin={isSuperAdmin} />
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <SalesAnalytics salesData={salesData} />
        </div>
        <div className="col-md-6 mb-4">
          <InventoryAlerts alerts={inventoryAlerts} />
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <OrderFulfillmentStatus orders={orderStatuses} />
        </div>
      </div>
    </PageLayout>
  );
};

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}