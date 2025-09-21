import React, { useEffect, useState } from 'react';
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

interface Size {
  id: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

interface SizeItem {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  Product?: {
    id: string;
    name: string;
  };
  Size?: {
    id: string;
    size: string;
  };
  createdAt: string;
}

const SizesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sizes, setSizes] = useState<Size[]>([]);
  const [sizeItems, setSizeItems] = useState<SizeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sizes' | 'items'>('sizes');

  useEffect(() => {
    fetchSizes();
    fetchSizeItems();
  }, []);

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (response.ok) {
        const data = await response.json();
        setSizes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchSizeItems = async () => {
    try {
      const response = await fetch('/api/sizes/items');
      if (response.ok) {
        const data = await response.json();
        setSizeItems(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching size items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSize = async (id: string) => {
    Swal.fire({
      title: 'Delete Size',
      text: 'Are you sure you want to delete this size?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/sizes/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setSizes(sizes.filter(size => size.id !== id));
            Toast.fire({
              icon: 'success',
              title: 'Size deleted successfully',
            });
          } else {
            throw new Error('Failed to delete size');
          }
        } catch (error) {
          console.error('Error deleting size:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete size',
          });
        }
      }
    });
  };

  const handleDeleteSizeItem = async (id: string) => {
    Swal.fire({
      title: 'Delete Size Item',
      text: 'Are you sure you want to delete this size item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/sizes/items/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setSizeItems(sizeItems.filter(item => item.id !== id));
            Toast.fire({
              icon: 'success',
              title: 'Size item deleted successfully',
            });
          } else {
            throw new Error('Failed to delete size item');
          }
        } catch (error) {
          console.error('Error deleting size item:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete size item',
          });
        }
      }
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
            <h1 className="mb-4 text-center fw-bold">Size Management</h1>
            
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'sizes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sizes')}
                >
                  Sizes
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'items' ? 'active' : ''}`}
                  onClick={() => setActiveTab('items')}
                >
                  Size Items
                </button>
              </li>
            </ul>

            {/* Sizes Tab */}
            {activeTab === 'sizes' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted">
                    Total Sizes: {sizes.length}
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push('/sizes/create')}
                  >
                    New Size
                  </button>
                </div>

                <div className="table-responsive shadow-sm bg-white">
                  <table className="table table-hover table-bordered border-secondary">
                    <thead className="bg-dark text-light text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Size</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((size, idx) => (
                        <tr key={size.id} className="align-middle text-center">
                          <td>{idx + 1}</td>
                          <td className="fw-semibold">{size.size}</td>
                          <td>{new Date(size.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => router.push({
                                  pathname: '/sizes/edit',
                                  query: { size: JSON.stringify(size) }
                                })}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteSize(size.id)}
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

            {/* Size Items Tab */}
            {activeTab === 'items' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="text-muted">
                    Total Size Items: {sizeItems.length}
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => router.push('/sizes/items/create')}
                  >
                    New Size Item
                  </button>
                </div>

                <div className="table-responsive shadow-sm bg-white">
                  <table className="table table-hover table-bordered border-secondary">
                    <thead className="bg-dark text-light text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Size</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeItems.map((item, idx) => (
                        <tr key={item.id} className="align-middle text-center">
                          <td>{idx + 1}</td>
                          <td>
                            {item.Product ? item.Product.name : 'N/A'}
                          </td>
                          <td>
                            {item.Size ? item.Size.size : 'N/A'}
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            <div className="btn-group">
                              <button 
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => router.push({
                                  pathname: '/sizes/items/edit',
                                  query: { item: JSON.stringify(item) }
                                })}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteSizeItem(item.id)}
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedSizesPage() {
  return (
    <ProtectedRoute>
      <SizesPage />
    </ProtectedRoute>
  );
}
