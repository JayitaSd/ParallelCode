import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants.js';
import { storage } from '@/utils/storage.js';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    timeout: 10000, // Added timeout
});

const publicEndpoints = ['/auth/login', '/auth/signup'];

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            (config.url || '').startsWith(endpoint)
        );

        // Ensure headers
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';

        console.log('Request to:', config.baseURL + config.url);
        console.log('Is public endpoint:', isPublicEndpoint);

        if (!isPublicEndpoint && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        return Promise.reject(error);
    }
);

export default api;