import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { PageLayout, FilterCard, StatsGrid } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '@/components/protectedRoute';
import { ModernTable, TableColumn } from '@/components/UI/ModernTable';
import {
  fetchAnalytics,
  fetchAnalyticsStats,
  setFilters,
  setPage,
  clearFilters,
  selectAnalyticsEvents,
  selectAnalyticsStats,
  selectAnalyticsLoading,
  selectAnalyticsFilters,
  selectAnalyticsPagination
} from '@/store/slices/analyticsSlice';

interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: any;
  userId: string;
  createdAt: string;
  User?: {
    id: string;
    name: string;
    email: string;
  };
}

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAuthenticating } = usePageData();

  const events = useSelector(selectAnalyticsEvents);
  const stats = useSelector(selectAnalyticsStats);
  const loading = useSelector(selectAnalyticsLoading);
  const filters = useSelector(selectAnalyticsFilters);
  const pagination = useSelector(selectAnalyticsPagination);

  // Fetch data when filters or page changes
  useEffect(() => {
    if (isAuthenticated && !isAuthenticating) {
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      dispatch(fetchAnalytics(queryParams));
      dispatch(fetchAnalyticsStats({ startDate: filters.startDate, endDate: filters.endDate }));
    }
  }, [isAuthenticated, isAuthenticating, filters, pagination.page, pagination.limit, dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch(setFilters({ [e.target.name]: e.target.value }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Table columns
  const columns: TableColumn<AnalyticsEvent>[] = [
    {
      key: 'eventType',
      label: 'Event Type',
      render: (value: string) => (
        <span className="badge bg-primary text-capitalize">
          {value ? value.replace('_', ' ') : 'N/A'}
        </span>
      )
    },
    {
      key: 'User',
      label: 'User',
      render: (value: any) => value ? (
        <div>
          <div className="fw-bold">{value.name}</div>
          <small className="text-muted">{value.email}</small>
        </div>
      ) : 'Anonymous'
    },
    {
      key: 'eventData',
      label: 'Data',
      render: (value: any) => (
        <small className="text-muted" title={JSON.stringify(value)}>
          {value ? JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '') : '-'}
        </small>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString()
    }
  ];

  // Statistics cards data
  const statsCards = stats.map((stat: any) => ({
    title: stat.eventType ? stat.eventType.replace('_', ' ') : 'Unknown',
    value: stat.count,
    icon: 'bi bi-graph-up',
    color: 'primary' as const
  }));

  // Filters component
  const AnalyticsFilters = () => (
    <FilterCard
      title="Filter Analytics"
      onClear={handleClearFilters}
    >
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Event Type</label>
          <select
            className="form-select"
            name="eventType"
            value={filters.eventType}
            onChange={handleFilterChange}
          >
            <option value="">All Events</option>
            <option value="page_view">Page View</option>
            <option value="product_view">Product View</option>
            <option value="add_to_cart">Add to Cart</option>
            <option value="purchase">Purchase</option>
            <option value="search">Search</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </FilterCard>
  );

  return (
    <PageLayout title={t('admin.analytics')} protected={true}>
      <AnalyticsFilters />
      
      {/* Statistics Cards */}
      {statsCards.length > 0 && (
        <StatsGrid stats={statsCards} className="mb-4" />
      )}

      {/* Events Table */}
      <div className="card">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Recent Events</h5>
        </div>
        <div className="card-body p-0">
          <ModernTable
            data={events || []}
            columns={columns}
            loading={loading}
            pagination={true}
            pageSize={pagination.limit}
            currentPage={pagination.page}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            emptyMessage="No analytics events found"
            searchable={false} // We have external filters
            className="border-0"
            tableClassName="mb-0"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default function ProtectedAnalytics() {
  return (
    <ProtectedRoute>
      <AnalyticsPage />
    </ProtectedRoute>
  );
}
