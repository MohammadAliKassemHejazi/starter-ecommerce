import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import Layout from '@/components/Layouts/Layout';
import protectedRoute from '@/components/protectedRoute';
import router from 'next/router';
import Swal from 'sweetalert2';
import DataTable from '@/components/UI/DataTable';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ConfirmationModal from '@/components/UI/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../src/contexts/ToastContext';

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

interface Promotion {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minCartValue: number;
  validFrom: string;
  validTo: string;
}

const PromotionsPage = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    promotion: Promotion | null;
  }>({ show: false, promotion: null });
  
  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/promotions');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.data || []);
      } else {
        throw new Error('Failed to fetch promotions');
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      showError('Failed to load promotions', 'Please try again later');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);



  const handleDeletePromotion = (promotion: Promotion) => {
    setDeleteModal({ show: true, promotion });
  };

  const confirmDelete = async () => {
    if (!deleteModal.promotion) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/promotions/${deleteModal.promotion.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPromotions(promotions.filter(promo => promo.id !== deleteModal.promotion!.id));
        showSuccess('Promotion deleted successfully');
      } else {
        throw new Error('Failed to delete promotion');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      showError('Failed to delete promotion', 'Please try again later');
    } finally {
      setDeleteModal({ show: false, promotion: null });
    }
  };

  const isPromotionActive = (validFrom: string, validTo: string) => {
    const now = new Date();
    const from = new Date(validFrom);
    const to = new Date(validTo);
    return now >= from && now <= to;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value: string) => (
        <code className="bg-light px-2 py-1 rounded">{value}</code>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <span className={`badge ${value === 'PERCENTAGE' ? 'bg-info' : 'bg-success'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'value',
      label: 'Value',
      render: (value: number, row: Promotion) => (
        <span className="fw-semibold">
          {row.type === 'PERCENTAGE' ? `${value}%` : `$${value}`}
        </span>
      )
    },
    {
      key: 'minCartValue',
      label: 'Min Cart Value',
      render: (value: number) => `$${value}`
    },
    {
      key: 'validFrom',
      label: 'Valid From',
      sortable: true,
      render: (value: string) => formatDate(value)
    },
    {
      key: 'validTo',
      label: 'Valid To',
      sortable: true,
      render: (value: string) => formatDate(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any, row: Promotion) => {
        const isActive = isPromotionActive(row.validFrom, row.validTo);
        return (
          <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    }
  ];

  const actions = (row: Promotion) => (
    <div className="btn-group" role="group">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          router.push({
            pathname: '/promotions/edit',
            query: { promotion: JSON.stringify(row) }
          });
        }}
        title="Edit Promotion"
      >
        <i className="bi bi-pencil"></i>
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePromotion(row);
        }}
        title="Delete Promotion"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <LoadingSpinner text="Loading promotions..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <h1 className="mb-4 text-center fw-bold">Promotions</h1>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Total Promotions: {promotions.length}
              </span>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/promotions/create')}
              >
                New Promotion
              </button>
            </div>
            
            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Code</th>
                    <th scope="col">Type</th>
                    <th scope="col">Value</th>
                    <th scope="col">Min Cart Value</th>
                    <th scope="col">Valid From</th>
                    <th scope="col">Valid To</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion, idx) => (
                    <tr key={promotion.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">
                        <code>{promotion.code}</code>
                      </td>
                      <td>
                        <span className={`badge ${
                          promotion.type === 'PERCENTAGE' ? 'bg-info' : 'bg-success'
                        }`}>
                          {promotion.type}
                        </span>
                      </td>
                      <td>
                        {promotion.type === 'PERCENTAGE' 
                          ? `${promotion.value}%` 
                          : `$${promotion.value}`
                        }
                      </td>
                      <td>${promotion.minCartValue}</td>
                      <td>{formatDate(promotion.validFrom)}</td>
                      <td>{formatDate(promotion.validTo)}</td>
                      <td>
                        <span className={`badge ${
                          isPromotionActive(promotion.validFrom, promotion.validTo)
                            ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {isPromotionActive(promotion.validFrom, promotion.validTo)
                            ? 'Active' : 'Inactive'
                          }
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => router.push({
                              pathname: '/promotions/edit',
                              query: { promotion: JSON.stringify(promotion) }
                            })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePromotion(promotion)}
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

            {promotions.length === 0 && (
              <div className="text-center py-5">
                <h3 className="text-muted">No promotions found</h3>
                <p className="text-muted">Create your first promotion to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/promotions/create')}
                >
                  Create Promotion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={deleteModal.show}
          onHide={() => setDeleteModal({ show: false, promotion: null })}
          onConfirm={confirmDelete}
          title="Delete Promotion"
          message={`Are you sure you want to delete "${deleteModal.promotion?.code}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default protectedRoute(PromotionsPage);
