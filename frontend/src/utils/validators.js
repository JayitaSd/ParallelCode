/**
 * Input validation utilities
 */

import { PATTERNS, ERROR_MESSAGES } from './constants.js';

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.INVALID_EMAIL;
  if (!PATTERNS.EMAIL.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null; // null means valid
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return ERROR_MESSAGES.INVALID_PASSWORD;
  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirm = (password, confirm) => {
  if (password !== confirm) return ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH;
  return null;
};

/**
 * Validate document title
 */
export const validateDocumentTitle = (title) => {
  if (!title || title.trim() === '') return 'Document title is required';
  if (title.length > 100) return 'Document title must be less than 100 characters';
  return null;
};

/**
 * Validate code content
 */
export const validateCode = (code) => {
  if (code === null || code === undefined) return 'Code content is required';
  return null;
};

/**
 * Validate language selection
 */
export const validateLanguage = (language) => {
  if (!language) return 'Please select a language';
  return null;
};

/**
 * Validate user input (generic)
 */
export const validateInput = (input, minLength = 1, maxLength = 255) => {
  if (!input) return 'This field is required';
  if (input.length < minLength) return `Minimum ${minLength} characters required`;
  if (input.length > maxLength) return `Maximum ${maxLength} characters allowed`;
  return null;
};

/**
 * Validate login form
 */
export const validateLoginForm = (data) => {
  const errors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Validate signup form
 */
export const validateSignupForm = (data) => {
  const errors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirm(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (data.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  return Object.keys(errors).length === 0 ? null : errors;
};

/**
 * Check if form has errors
 */
export const hasFormErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};

/**
 * Sanitize string input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL';
  }
};

/**
 * Validate document ID
 */
export const validateDocumentId = (id) => {
  if (!id) return 'Document ID is required';
  if (typeof id !== 'string' && typeof id !== 'number') return 'Invalid document ID';
  return null;
};

