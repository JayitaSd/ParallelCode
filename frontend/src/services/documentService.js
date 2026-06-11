import api from './api.js';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/utils/constants.js';

export const documentService = {
  /**
   * Get all documents for current user
   */
  getDocuments: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DOCUMENTS, { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Get single document by ID
   */
  getDocument: async (docId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DOCUMENT.replace(':id', docId));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          error: ERROR_MESSAGES.DOCUMENT_NOT_FOUND,
        };
      }
      if (error.response?.status === 403) {
        return {
          success: false,
          error: ERROR_MESSAGES.UNAUTHORIZED,
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Create new document
   */
  createDocument: async (title, language = 'javascript', content = '') => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_DOCUMENT, {
        title,
        language,
        content,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Update document content (Fixed for backend compatibility)
   */
  updateDocument: async (docId, updates) => {
    try {
      // Ensure we always send a proper object with content
      const payload = {
        content: updates?.content || updates || '', // Handle both object and direct string cases
        ...(updates?.language && { language: updates.language }),
      };

      console.log(`📤 Updating document ${docId} with payload:`, payload); // Debug log

      const response = await api.put(
          API_ENDPOINTS.UPDATE_DOCUMENT.replace(':id', docId),
          payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`❌ Update document ${docId} failed:`, error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (docId) => {
    try {
      await api.delete(API_ENDPOINTS.DELETE_DOCUMENT.replace(':id', docId));
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Get document members
   */
  getDocumentMembers: async (docId) => {
    try {
      const response = await api.get(
          API_ENDPOINTS.GET_DOCUMENT_MEMBERS.replace(':id', docId)
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },

  /**
   * Add member to document
   */
  addDocumentMember: async (docId, email) => {
    try {
      const response = await api.post(
          API_ENDPOINTS.ADD_DOCUMENT_MEMBER.replace(':id', docId),
          { email }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  },
};

export default documentService;