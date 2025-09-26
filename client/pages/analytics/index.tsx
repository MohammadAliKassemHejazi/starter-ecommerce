import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { PageLayout, FilterCard, StatsGrid } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';

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
  const { isAuthenticated } = usePageData();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: '',
    startDate: '',
    endDate: ''
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.eventType) {
        queryParams.append('eventType', filters.eventType);
      }
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }

      const response = await fetch(`/api/analytics?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showToast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }

      const response = await fetch(`/api/analytics/stats?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchAnalytics();
    fetchStats();
  }, [filters, fetchAnalytics, fetchStats]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Table columns for analytics events
  const eventColumns = [
    {
      key: 'eventType',
      label: 'Event Type',
      render: (value: string) => (
        <span className="badge bg-primary text-capitalize">
          {value.replace('_', ' ')}
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
        <small className="text-muted">
          {JSON.stringify(value).substring(0, 50)}...
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
  const statsCards = stats.map((stat) => ({
    title: stat.eventType.replace('_', ' '),
    value: stat.count,
    icon: 'bi bi-graph-up',
    color: 'primary' as const
  }));

  // Filters component
  const AnalyticsFilters = () => (
    <FilterCard
      title="Filter Analytics"
      onClear={() => setFilters({ eventType: '', startDate: '', endDate: '' })}
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

  if (loading) {
    return (
      <PageLayout title={t('admin.analytics')} protected={true}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('admin.analytics')} protected={true}>
      <AnalyticsFilters />
      
      {/* Statistics Cards */}
      {statsCards.length > 0 && (
        <StatsGrid stats={statsCards} className="mb-4" />
      )}

      {/* Events Table */}
      <div className="card">
        <div className="card-header">
          <h5>Recent Events</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>User</th>
                  <th>Data</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <span className="badge bg-primary text-capitalize">
                        {event.eventType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {event.User ? (
                        <div>
                          <div className="fw-bold">{event.User.name}</div>
                          <small className="text-muted">{event.User.email}</small>
                        </div>
                      ) : (
                        'Anonymous'
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {JSON.stringify(event.eventData).substring(0, 50)}...
                      </small>
                    </td>
                    <td>
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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