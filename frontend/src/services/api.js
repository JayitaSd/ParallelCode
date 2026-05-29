import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants.js';
import { storage } from '@/utils/storage.js';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('Request to:', config.baseURL + config.url);
    console.log('Request method:', config.method.toUpperCase());
    console.log('Request data:', config.data);
    console.log('Request headers:', config.headers);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.log('No token found in storage');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      storage.removeItem(STORAGE_KEYS.USER_DATA);
      // Optionally redirect to login
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

