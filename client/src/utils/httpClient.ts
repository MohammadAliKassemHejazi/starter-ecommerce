import axios from 'axios'
import cookie from "cookie";
import { ACCESS_TOKEN_KEY } from './constant';
const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API
})

export const setAuthHeaders = (headers: any) => {

  const cookies = headers.cookie;
  const parsedCookies = cookies ? cookie.parse(cookies) : {};
  const token = parsedCookies[ACCESS_TOKEN_KEY]; // Adjust the cookie name to your setup
 
  if (token) {
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};


export default httpClient
