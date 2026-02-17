import httpClient from '../utils/httpClient';

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
