import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import protectedRoute from '@/components/protectedRoute';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

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
    Swal.fire({
      title: 'Delete Shipping Method',
      text: 'Are you sure you want to delete this shipping method?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
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
            Toast.fire({
              icon: 'success',
              title: 'Shipping method deleted successfully',
            });
          } else {
            throw new Error('Failed to delete shipping method');
          }
        } catch (error) {
          console.error('Error deleting shipping method:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete shipping method',
          });
        }
      }
    });
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
        Toast.fire({
          icon: 'success',
          title: 'Shipping status updated successfully',
        });
      } else {
        throw new Error('Failed to update shipping status');
      }
    } catch (error) {
      console.error('Error updating shipping status:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to update shipping status',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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

            {/* Shipping Methods Tab */}
            {activeTab === 'methods' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
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

                <div className="table-responsive shadow-sm bg-white">
                  <table className="table table-hover table-bordered border-secondary">
                    <thead className="bg-dark text-light text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Cost</th>
                        <th scope="col">Delivery Estimate</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingMethods.map((method, idx) => (
                        <tr key={method.id} className="align-middle text-center">
                          <td>{idx + 1}</td>
                          <td className="fw-semibold">{method.name}</td>
                          <td>${method.cost}</td>
                          <td>{method.deliveryEstimate}</td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => router.push({
                                  pathname: '/shipping/methods/edit',
                                  query: { method: JSON.stringify(method) }
                                })}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteShippingMethod(method.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Order Shippings Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted">
                    Total Shipments: {orderShippings.length}
                  </span>
                </div>

                <div className="table-responsive shadow-sm bg-white">
                  <table className="table table-hover table-bordered border-secondary">
                    <thead className="bg-dark text-light text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order</th>
                        <th scope="col">Tracking Number</th>
                        <th scope="col">Carrier</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderShippings.map((shipping, idx) => (
                        <tr key={shipping.id} className="align-middle text-center">
                          <td>{idx + 1}</td>
                          <td>
                            {shipping.Order ? (
                              <div>
                                <div className="fw-bold">{shipping.Order.orderNumber}</div>
                                <small className="text-muted">${shipping.Order.totalPrice}</small>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{shipping.trackingNumber}</td>
                          <td>{shipping.carrier}</td>
                          <td>
                            <span className={`badge ${
                              shipping.status === 'DELIVERED' ? 'bg-success' :
                              shipping.status === 'SHIPPED' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {shipping.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={shipping.status}
                              onChange={(e) => handleUpdateShippingStatus(shipping.id, e.target.value)}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(ShippingPage);
