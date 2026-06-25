import api from './api.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/utils/constants.js';

export const documentService = {
  getDocuments: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DOCUMENTS);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  getDocument: async (docId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_DOCUMENT}${docId}`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return { success: false, error: ERROR_MESSAGES.UNAUTHORIZED };
      }
      if (error.response?.status === 404) {
        return { success: false, error: ERROR_MESSAGES.DOCUMENT_NOT_FOUND };
      }
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  createDocument: async (title, language = 'javascript', content = '') => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_DOCUMENT, {
        title,
        language,
        content,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  updateDocument: async (docId, content) => {
    try {
      const payload = { content };
      const response = await api.put(`${API_ENDPOINTS.UPDATE_DOCUMENT}${docId}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Update failed for doc ${docId}:`, error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  deleteDocument: async (docId) => {
    try {
      await api.delete(`${API_ENDPOINTS.DELETE_DOCUMENT}${docId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  addDocumentMember: async (docId, username) => {
    try {
      const response = await api.post(
          `${API_ENDPOINTS.ADD_DOCUMENT_MEMBER}${docId}/members?username=${encodeURIComponent(username)}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },
};

export default documentService;