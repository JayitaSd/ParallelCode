export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  GET_DOCUMENTS: '/documents',
  GET_DOCUMENT: '/documents/',
  CREATE_DOCUMENT: '/documents/create',
  UPDATE_DOCUMENT: '/documents/',
  DELETE_DOCUMENT: '/documents/',
  ADD_DOCUMENT_MEMBER: '/documents/',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

// Add to constants.js
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Extend ERROR_MESSAGES:
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access',
  LOGIN_FAILED: 'Invalid credentials',
  DOCUMENT_NOT_FOUND: 'Document not found',
  // Add these:
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
};