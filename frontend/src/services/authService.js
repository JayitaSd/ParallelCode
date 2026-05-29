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
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      console.log('Login response:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Login failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
        config: error.config,
      });
      const message = error.response?.data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
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
      const response = await api.post(API_ENDPOINTS.SIGNUP, {
        username,
        email,
        password,
      });
      console.log('Signup response:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Signup failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
      });
      const message = error.response?.data?.message || ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Verify token validity
   */
  verifyToken: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VERIFY_TOKEN);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.SESSION_EXPIRED,
      };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
      return { success: true };
    } catch (error) {
      // Even if logout fails, we should clear local storage
      return { success: true };
    }
  },
};

export default authService;
