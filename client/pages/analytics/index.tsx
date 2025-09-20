import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
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
      Toast.fire({
        icon: 'error',
        title: 'Failed to load analytics',
      });
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
            <h1 className="mb-4 text-center fw-bold">{t('admin.analytics')}</h1>
            
            {/* Filters */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
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
                  <div className="col-md-3 d-flex align-items-end">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ eventType: '', startDate: '', endDate: '' });
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="col-md-3 mb-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title text-capitalize">{stat.eventType.replace('_', ' ')}</h5>
                      <h2 className="text-primary">{stat.count}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(AnalyticsPage);
