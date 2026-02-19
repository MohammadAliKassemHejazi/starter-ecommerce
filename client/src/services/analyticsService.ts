import httpClient from '../utils/httpClient';

export const trackEvent = async (eventType: string, eventData: any) => {
  let sessionId = '';
  let pageUrl = '';

  if (typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('analytics_session_id') || '';
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    pageUrl = window.location.pathname + window.location.search;
  }

  return httpClient.post('/analytics/track', {
    eventType,
    eventData,
    sessionId,
    pageUrl
  });
};

export const getAnalytics = async (params: any) => {
  const queryParams = new URLSearchParams();

  if (params.eventType) {
    queryParams.append('eventType', params.eventType);
  }
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  return httpClient.get(`/analytics?${queryParams.toString()}`);
};

export const getAnalyticsStats = async (params: any) => {
  const queryParams = new URLSearchParams();

  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }

  return httpClient.get(`/analytics/stats?${queryParams.toString()}`);
};
