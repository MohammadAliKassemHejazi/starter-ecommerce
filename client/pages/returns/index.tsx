import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import ProtectedRoute from '@/components/protectedRoute';
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

interface ReturnRequest {
  id: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  refundAmount: number;
  resolutionNote?: string;
  Order?: {
    id: string;
    orderNumber: string;
    totalPrice: number;
  };
  User?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ReturnsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    userId: ''
  });

    const fetchReturns = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.userId) {
        queryParams.append('userId', filters.userId);
      }

      const response = await fetch(`/api/returns?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReturns(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to load returns',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);


  useEffect(() => {
    fetchReturns();
  }, [filters, fetchReturns]);


  const handleStatusUpdate = async (id: string, status: string, resolutionNote?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/returns/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, resolutionNote }),
      });

      if (response.ok) {
        setReturns(returns.map(returnReq => 
          returnReq.id === id ? { ...returnReq, status: status as any, resolutionNote } : returnReq
        ));
        Toast.fire({
          icon: 'success',
          title: 'Return status updated successfully',
        });
      } else {
        throw new Error('Failed to update return status');
      }
    } catch (error) {
      console.error('Error updating return status:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to update return status',
      });
    }
  };

  const handleDeleteReturn = async (id: string) => {
    Swal.fire({
      title: 'Delete Return Request',
      text: 'Are you sure you want to delete this return request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/returns/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setReturns(returns.filter(returnReq => returnReq.id !== id));
            Toast.fire({
              icon: 'success',
              title: 'Return request deleted successfully',
            });
          } else {
            throw new Error('Failed to delete return request');
          }
        } catch (error) {
          console.error('Error deleting return request:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete return request',
          });
        }
      }
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
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
            <h1 className="mb-4 text-center fw-bold">Return Management</h1>
            
            {/* Filters */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="PROCESSED">Processed</option>
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => {
                        setFilters({ status: '', userId: '' });
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns Table */}
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Refund Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((returnReq, idx) => (
                    <tr key={returnReq.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td>
                        {returnReq.Order ? (
                          <div>
                            <div className="fw-bold">{returnReq.Order.orderNumber}</div>
                            <small className="text-muted">${returnReq.Order.totalPrice}</small>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {returnReq.User ? (
                          <div>
                            <div className="fw-bold">{returnReq.User.name}</div>
                            <small className="text-muted">{returnReq.User.email}</small>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {returnReq.reason}
                      </td>
                      <td>${returnReq.refundAmount}</td>
                      <td>
                        <span className={`badge ${
                          returnReq.status === 'APPROVED' ? 'bg-success' :
                          returnReq.status === 'REJECTED' ? 'bg-danger' :
                          returnReq.status === 'PROCESSED' ? 'bg-info' : 'bg-warning'
                        }`}>
                          {returnReq.status}
                        </span>
                      </td>
                      <td>{new Date(returnReq.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group">
                          <select
                            className="form-select form-select-sm"
                            value={returnReq.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus !== returnReq.status) {
                                Swal.fire({
                                  title: 'Update Status',
                                  text: `Change status to ${newStatus}?`,
                                  input: 'textarea',
                                  inputLabel: 'Resolution Note (optional)',
                                  inputPlaceholder: 'Enter resolution note...',
                                  showCancelButton: true,
                                  confirmButtonText: 'Update',
                                  cancelButtonText: 'Cancel'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    handleStatusUpdate(returnReq.id, newStatus, result.value);
                                  }
                                });
                              }
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="PROCESSED">Processed</option>
                          </select>
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => handleDeleteReturn(returnReq.id)}
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

            {returns.length === 0 && (
              <div className="text-center py-5">
                <h3 className="text-muted">No return requests found</h3>
                <p className="text-muted">Return requests will appear here when customers submit them.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedReturnsPage() {
  return (
    <ProtectedRoute>
      <ReturnsPage />
    </ProtectedRoute>
  );
}
