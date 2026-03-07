import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import ProtectedRoute from '@/components/protectedRoute';
import router from 'next/router';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../src/contexts/ToastContext';
import ConfirmationModal from '@/components/UI/ConfirmationModal';

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
  const { isAuthenticated } = usePageData();
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

  const handleEditPromotion = (promotion: Promotion) => {
    router.push({
      pathname: '/promotions/edit',
      query: { promotion: JSON.stringify(promotion) }
    });
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

  // Table columns for promotions
  const promotionColumns = [
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

  return (
    <>
      <TablePage
        title="Promotions"
        subtitle="Manage discount codes and promotional offers"
        data={promotions}
        columns={promotionColumns}
        loading={loading}
        searchPlaceholder="Search promotions..."
        emptyMessage="No promotions found. Create your first promotion to get started!"
        addButton={{ href: '/promotions/create', label: 'New Promotion' }}
        editPath="/promotions/edit"
        deleteAction={async (id) => {
          const promotion = promotions.find(p => p.id === id);
          if (promotion) { handleDeletePromotion(promotion); }
        }}
        exportButton={{ onClick: () => console.log('Export promotions') }}
        filterButton={{ onClick: () => console.log('Filter promotions') }}
        customActions={[
          {
            key: 'edit',
            label: 'Edit',
            icon: 'bi bi-pencil',
            variant: 'primary',
            onClick: handleEditPromotion
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'bi bi-trash',
            variant: 'danger',
            onClick: (promotion) => handleDeletePromotion(promotion)
          }
        ]}
        headerActions={
          <div className="d-flex align-items-center gap-3">
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
        }
      />

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
    </>
  );
};

export default function ProtectedPromotionsPage() {
  return (
    <ProtectedRoute>
      <PromotionsPage />
    </ProtectedRoute>
  );
}