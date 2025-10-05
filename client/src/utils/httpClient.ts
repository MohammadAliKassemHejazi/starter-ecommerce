import axios, { AxiosResponse, AxiosError } from 'axios'
import cookie from "cookie";
import { ACCESS_TOKEN_KEY } from './constant';
import { ApiResponse, ApiErrorResponse } from '@/interfaces/api/apiResponse.types';
import { handleApiError } from './apiUtils';

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
})

// Shared mutable reference to the current token
let currentAccessToken: string | null = null;

// Set interceptor ONCE
httpClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// Export a way to update the token
export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

// Response interceptor to handle API responses consistently
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Transform response to ensure consistent structure
    if (!response.data.success && response.data.success !== false) {
      // If response doesn't have success field, wrap it
      response.data = {
        success: true,
        message: 'Success',
        data: response.data
      };
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle errors consistently
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export const setAuthHeaders = (headers: any) => {
  const cookies = headers.cookie;
  const parsedCookies = cookies ? cookie.parse(cookies) : {};
  const token = parsedCookies[ACCESS_TOKEN_KEY]; // Adjust the cookie name to your setup
 
  if (token) {
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default httpClient
