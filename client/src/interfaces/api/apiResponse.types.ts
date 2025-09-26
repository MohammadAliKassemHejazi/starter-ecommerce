// Base API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

// Paginated API Response
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Success Response
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

// Generic API Response Type
export type ApiResult<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
