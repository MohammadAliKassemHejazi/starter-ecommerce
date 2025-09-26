import { ApiResponse, ApiErrorResponse, ApiSuccessResponse } from '@/interfaces/api/apiResponse.types';

// Type guard to check if response is an error
export const isApiError = (response: any): response is ApiErrorResponse => {
  return response && response.success === false;
};

// Type guard to check if response is successful
export const isApiSuccess = <T>(response: any): response is ApiSuccessResponse<T> => {
  return response && response.success === true;
};

// Extract data from API response safely
export const extractApiData = <T>(response: ApiResponse<T>): T => {
  if (isApiError(response)) {
    throw new Error(response.message || response.error || 'API request failed');
  }
  return response.data;
};

// Handle API response with error checking
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    const errorMessage = response.message || response.error || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
  return response.data;
};

// Create a standardized error response
export const createErrorResponse = (message: string, error?: string, statusCode?: number): ApiErrorResponse => {
  return {
    success: false,
    message,
    error: error || message,
    statusCode
  };
};

// Create a standardized success response
export const createSuccessResponse = <T>(data: T, message: string = 'Success'): ApiSuccessResponse<T> => {
  return {
    success: true,
    message,
    data
  };
};

// Handle API errors consistently
export const handleApiError = (error: any): ApiErrorResponse => {
  if (error.response?.data) {
    // Server responded with error data
    return {
      success: false,
      message: error.response.data.message || 'Server error',
      error: error.response.data.error || error.message,
      statusCode: error.response.status
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error - no response from server',
      error: 'NETWORK_ERROR',
      statusCode: 0
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: 'UNKNOWN_ERROR',
      statusCode: 500
    };
  }
};
