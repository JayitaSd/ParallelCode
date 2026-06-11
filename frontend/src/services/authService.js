import api from './api.js';

export const authService = {
  /**
   * Login user
   */
  login: async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/auth/login', {
        usernameOrEmail,
        password,
      });

      return {
        success: true,
        data: response.data,   // { token, username, userId, email, ... }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  /**
   * Signup user
   */
  signup: async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  },
};

export default authService;