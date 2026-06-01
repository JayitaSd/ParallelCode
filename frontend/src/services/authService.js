import api from './api.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/utils/constants.js';

export const authService = {
  /**
   * Login user with username and password
   */
  login: async (username, password) => {
    try {
      console.log('Login request to:', `${api.defaults.baseURL}${API_ENDPOINTS.LOGIN}`);
      console.log('Login credentials:', { username });

      // Backend expects 'usernameOrEmail' field
      const payload = {
        usernameOrEmail: username,   // ← Critical fix
        password: password
      };

      const response = await api.post(API_ENDPOINTS.LOGIN, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Login response:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      const message = error.response?.data?.message
          || error.response?.data?.error
          || error.response?.data?.details
          || ERROR_MESSAGES.INVALID_CREDENTIALS;

      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Sign up new user
   */
  signup: async (username, email, password) => {
    try {
      console.log('Signup request to:', `${api.defaults.baseURL}${API_ENDPOINTS.SIGNUP}`);

      const payload = {
        username,
        email,
        password
      };

      const response = await api.post(API_ENDPOINTS.SIGNUP, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Signup response:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Signup failed:', error.response?.data);

      const message = error.response?.data?.message
          || ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;

      return {
        success: false,
        error: message,
      };
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
      return { success: true };
    } catch (error) {
      return { success: true }; // Always succeed on logout
    }
  },
};

export default authService;