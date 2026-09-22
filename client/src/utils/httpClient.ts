import axios, { AxiosResponse, AxiosError } from 'axios'
import cookie from "cookie";
import { ACCESS_TOKEN_KEY } from './constant';
import { ApiResponse, ApiErrorResponse } from '@/interfaces/api/apiResponse.types';
import { handleApiError } from './apiUtils';

// Server-side code (getServerSideProps/getStaticProps, pages/api/* routes) runs
// inside the client container's own Node process, where NEXT_PUBLIC_BASE_URL_API
// (a host-reachable URL like http://localhost:5300) does not resolve — container
// networking requires the compose service name instead. INTERNAL_API_URL (server-only,
// not NEXT_PUBLIC_*, so it stays out of the browser bundle) supplies that address.
// Browser-side code keeps using the public, host-reachable URL unaffected.
const baseURL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL_API
    : process.env.NEXT_PUBLIC_BASE_URL_API;

const httpClient = axios.create({
  baseURL,
})

// // Request interceptor to add auth token
// httpClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
