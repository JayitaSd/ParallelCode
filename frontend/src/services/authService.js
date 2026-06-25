import api from './api.js';
import storage from '../utils/storage.js';
import {STORAGE_KEYS} from "../utils/constants.js";
export const authService = {
  login: async (usernameOrEmail, password) => {
    try {
      console.log('🔑 Attempting login with:', { usernameOrEmail });

      const response = await api.post('/auth/login', {
        usernameOrEmail,
        password
      });

      console.log('✅ Login response received:', response.data);

      // Store token
      if (response.data?.token) {
        storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        storage.setItem(STORAGE_KEYS.USER_DATA, {
          username: response.data.username,
          userId: response.data.userId,
          email: response.data.email,
        });
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      let errorMsg = 'Login failed';

      if (error.response?.data) {
        errorMsg = typeof error.response.data === 'string'
            ? error.response.data
            : error.response.data.message || error.response.data.error || 'Invalid credentials';
      } else if (error.message) {
        errorMsg = error.message;
      }

      return {
        success: false,
        error: errorMsg
      };
    }
  },

  // ... signup remains same
  signup: async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data || 'Signup failed',
      };
    }
  },
};

  // ← Add this import at top