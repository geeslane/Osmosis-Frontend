import axios from 'axios';
import config from '@/config';
import { getSessionCookie } from './session';

const API_BASE_URL =
  typeof config.apiBaseUrl === 'string' ? config.apiBaseUrl : '';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  /*  headers: {
    //'Content-Type': 'application/json',
    //Accept: 'application/json',
  }, */
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getSessionCookie();
  const bearerToken = typeof token === 'string' ? token : token?.token;
  if (bearerToken && config.headers) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
