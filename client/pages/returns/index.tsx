import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { TablePage, FilterCard } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';

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
  user?: {
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
  const { isAuthenticated } = usePageData();
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
      showToast.error('Failed to load returns');
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
        showToast.success('Return status updated successfully');
      } else {
        throw new Error('Failed to update return status');
      }
    } catch (error) {
      console.error('Error updating return status:', error);
      showToast.error('Failed to update return status');
    }
  };

  const handleDeleteReturn = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Return Request',
      text: 'Are you sure you want to delete this return request?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

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
          showToast.success('Return request deleted successfully');
        } else {
          throw new Error('Failed to delete return request');
        }
      } catch (error) {
        console.error('Error deleting return request:', error);
        showToast.error('Failed to delete return request');
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Table columns for returns
  const returnColumns = [
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
      key: 'user',
      label: 'Customer',
      render: (value: any) => value ? (
        <div>
          <div className="fw-bold">{value.name}</div>
          <small className="text-muted">{value.email}</small>
        </div>
      ) : 'N/A'
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value: string) => (
        <div className="text-truncate" style={{ maxWidth: "200px" }} title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'refundAmount',
      label: 'Refund Amount',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`badge ${
          value === 'APPROVED' ? 'bg-success' :
          value === 'REJECTED' ? 'bg-danger' :
          value === 'PROCESSED' ? 'bg-info' : 'bg-warning'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'statusUpdate',
      label: 'Update Status',
      render: (value: any, row: ReturnRequest) => (
        <select
          className="form-select form-select-sm"
          value={row.status}
          onChange={(e) => {
            const newStatus = e.target.value;
            if (newStatus !== row.status) {
              showConfirm({
                title: 'Update Status',
                text: `Change status to ${newStatus}?`,
                confirmText: 'Update',
                cancelText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  handleStatusUpdate(row.id, newStatus, '');
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
      )
    }
  ];

  // Filters component
  const ReturnFilters = () => (
    <FilterCard
      title="Filter Returns"
      onClear={() => setFilters({ status: '', userId: '' })}
    >
      <div className="row g-3">
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
      </div>
    </FilterCard>
  );

  return (
    <>
      <ReturnFilters />
      
      <TablePage
        title="Return Management"
        subtitle="Manage customer return requests and refunds"
        data={returns}
        columns={returnColumns}
        loading={loading}
        searchPlaceholder="Search returns..."
        emptyMessage="No return requests found. Return requests will appear here when customers submit them."
        deleteAction={handleDeleteReturn}
        exportButton={{ onClick: () => console.log('Export returns') }}
        filterButton={{ onClick: () => console.log('Filter returns') }}
        customActions={[
          {
            key: 'delete',
            label: 'Delete',
            icon: 'bi bi-trash',
            variant: 'danger',
            onClick: (returnReq) => handleDeleteReturn(returnReq.id)
          }
        ]}
        headerActions={
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              Total Returns: {returns.length}
            </span>
          </div>
        }
      />
    </>
  );
};

export default function ProtectedReturnsPage() {
  return (
    <ProtectedRoute>
      <ReturnsPage />
    </ProtectedRoute>
  );
}