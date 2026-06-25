import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants.js';
import { storage } from '../utils/storage.js';

const api = axios.create({
    baseURL: API_BASE_URL,   // Must be exactly 'http://localhost:8080' — NO /api
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const publicEndpoints = ['/auth/login', '/auth/signup'];

api.interceptors.request.use(
    (config) => {
        const token = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const isPublic = publicEndpoints.some(ep => (config.url || '').startsWith(ep));

        if (!isPublic && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
        });
        if (error.response?.status === 401 || error.response?.status === 403) {
            storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        return Promise.reject(error);
    }
);

export default api;