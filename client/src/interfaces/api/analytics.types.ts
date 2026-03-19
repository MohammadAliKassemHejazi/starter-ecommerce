import { PaginatedApiResponse, ApiResponse } from './apiResponse.types';

export interface AnalyticsUser {
  id: string;
  name: string;
  email: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: any;
  userId: string;
  createdAt: string;
  user?: AnalyticsUser;
}

export interface AnalyticsStats {
  eventType: string;
  count: number;
}

export type AnalyticsListResponse = PaginatedApiResponse<AnalyticsEvent>;
export type AnalyticsStatsResponse = ApiResponse<AnalyticsStats[]>;
