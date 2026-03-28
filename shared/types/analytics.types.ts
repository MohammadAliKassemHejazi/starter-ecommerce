import { PaginatedApiResponse, ApiResponse } from './apiResponse.types';

export interface IAnalyticsUser {
  id: string;
  name: string;
  email: string;
}

export interface IAnalyticsEvent {
  id: string;
  eventType: string;
  eventData: any;
  userId: string;
  createdAt: string;
  user?: IAnalyticsUser;
}

export interface IAnalyticsStats {
  eventType: string;
  count: number;
}

export type AnalyticsListResponse = PaginatedApiResponse<IAnalyticsEvent>;
export type AnalyticsStatsResponse = ApiResponse<IAnalyticsStats[]>;
