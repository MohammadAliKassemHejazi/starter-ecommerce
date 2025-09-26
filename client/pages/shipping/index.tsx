import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  deliveryEstimate: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderShipping {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  Order?: {
    id: string;
    orderNumber: string;
    totalPrice: number;
  };
  ShippingMethod?: {
    id: string;
    name: string;
    cost: number;
  };
  createdAt: string;
}

const ShippingPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [orderShippings, setOrderShippings] = useState<OrderShipping[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'methods' | 'orders'>('methods');

  useEffect(() => {
    fetchShippingMethods();
    fetchOrderShippings();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await fetch('/api/shipping/methods');
      if (response.ok) {
        const data = await response.json();
        setShippingMethods(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    }
  };

  const fetchOrderShippings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shipping/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrderShippings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching order shippings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShippingMethod = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Shipping Method',
      text: 'Are you sure you want to delete this shipping method?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/shipping/methods/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setShippingMethods(shippingMethods.filter(method => method.id !== id));
          showToast.success('Shipping method deleted successfully');
        } else {
          throw new Error('Failed to delete shipping method');
        }
      } catch (error) {
        console.error('Error deleting shipping method:', error);
        showToast.error('Failed to delete shipping method');
      }
    }
  };

  const handleUpdateShippingStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shipping/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrderShippings(orderShippings.map(shipping => 
          shipping.id === id ? { ...shipping, status: status as any } : shipping
        ));
        showToast.success('Shipping status updated successfully');
      } else {
        throw new Error('Failed to update shipping status');
      }
    } catch (error) {
      console.error('Error updating shipping status:', error);
      showToast.error('Failed to update shipping status');
    }
  };

  const handleEditShippingMethod = (method: ShippingMethod) => {
    router.push({
      pathname: '/shipping/methods/edit',
      query: { method: JSON.stringify(method) }
    });
  };

  // Table columns for shipping methods
  const shippingMethodColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'cost',
      label: 'Cost',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'deliveryEstimate',
      label: 'Delivery Estimate',
      render: (value: string) => value
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  // Table columns for order shippings
  const orderShippingColumns = [
    {
      key: 'Order',
      label: 'Order',
      render: (value: any) => value ? (
        <div>
          <div className="fw-bold">{value.orderNumber}</div>
          <small className="text-muted">${value.totalPrice}</small>
        </div>
      ) : 'N/A'
    },
    {
      key: 'trackingNumber',
      label: 'Tracking Number',
      render: (value: string) => <code className="bg-light px-2 py-1 rounded">{value}</code>
    },
    {
      key: 'carrier',
      label: 'Carrier',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge ${
          value === 'DELIVERED' ? 'bg-success' :
          value === 'SHIPPED' ? 'bg-warning' : 'bg-secondary'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'statusUpdate',
      label: 'Update Status',
      render: (value: any, row: OrderShipping) => (
        <select
          className="form-select form-select-sm"
          value={row.status}
          onChange={(e) => handleUpdateShippingStatus(row.id, e.target.value)}
        >
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      )
    }
  ];

  const ShippingMethodsTab = () => (
    <TablePage
      title="Shipping Methods"
      subtitle="Manage available shipping options"
      data={shippingMethods}
      columns={shippingMethodColumns}
      loading={loading}
      searchPlaceholder="Search shipping methods..."
      emptyMessage="No shipping methods found. Create your first shipping method to get started!"
      addButton={{ href: '/shipping/methods/create', label: 'New Shipping Method' }}
      editPath="/shipping/methods/edit"
      deleteAction={handleDeleteShippingMethod}
      exportButton={{ onClick: () => console.log('Export shipping methods') }}
      filterButton={{ onClick: () => console.log('Filter shipping methods') }}
      customActions={[
        {
          key: 'edit',
          label: 'Edit',
          icon: 'bi bi-pencil',
          variant: 'primary',
          onClick: handleEditShippingMethod
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: 'bi bi-trash',
          variant: 'danger',
          onClick: (method) => handleDeleteShippingMethod(method.id)
        }
      ]}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Methods: {shippingMethods.length}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/shipping/methods/create')}
          >
            New Shipping Method
          </button>
        </div>
      }
    />
  );

  const OrderShippingsTab = () => (
    <TablePage
      title="Order Shippings"
      subtitle="Track and manage order shipments"
      data={orderShippings}
      columns={orderShippingColumns}
      loading={loading}
      searchPlaceholder="Search shipments..."
      emptyMessage="No shipments found. Orders will appear here when they are shipped."
      exportButton={{ onClick: () => console.log('Export shipments') }}
      filterButton={{ onClick: () => console.log('Filter shipments') }}
      headerActions={
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">
            Total Shipments: {orderShippings.length}
          </span>
        </div>
      }
    />
  );

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4 text-center fw-bold">Shipping Management</h1>
          
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'methods' ? 'active' : ''}`}
                onClick={() => setActiveTab('methods')}
              >
                Shipping Methods
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Order Shippings
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          {activeTab === 'methods' && <ShippingMethodsTab />}
          {activeTab === 'orders' && <OrderShippingsTab />}
        </div>
      </div>
    </div>
  );
};

export default function ProtectedShippingPage() {
  return (
    <ProtectedRoute>
      <ShippingPage />
    </ProtectedRoute>
  );
}