// API Routes
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',

  // Documents
  GET_DOCUMENTS: '/documents',
  GET_DOCUMENT: '/documents/:id',
  CREATE_DOCUMENT: '/documents/create',
  DELETE_DOCUMENT: '/documents/:id',
  UPDATE_DOCUMENT: '/documents/:id',
  GET_DOCUMENT_MEMBERS: '/documents/:id/members',
  ADD_DOCUMENT_MEMBER: '/documents/:id/members',

  // Code Languages
  SUPPORTED_LANGUAGES: '/editor/languages',
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  DOCUMENT_NOT_FOUND: 'Document not found',
  UNAUTHORIZED: 'You do not have permission to access this document',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  DOCUMENT_CREATED: 'Document created successfully!',
  DOCUMENT_DELETED: 'Document deleted successfully!',
  DOCUMENT_SAVED: 'Changes saved!',
  LINK_COPIED: 'Link copied to clipboard!',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  AUTO_SAVE: 'auto_save_enabled',
};

// Language Definitions for Monaco Editor
export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: 'js' },
  { id: 'typescript', label: 'TypeScript', icon: 'ts' },
  { id: 'python', label: 'Python', icon: 'py' },
  { id: 'java', label: 'Java', icon: 'java' },
  { id: 'cpp', label: 'C++', icon: 'cpp' },
  { id: 'csharp', label: 'C#', icon: 'cs' },
  { id: 'go', label: 'Go', icon: 'go' },
  { id: 'rust', label: 'Rust', icon: 'rs' },
  { id: 'php', label: 'PHP', icon: 'php' },
  { id: 'ruby', label: 'Ruby', icon: 'rb' },
  { id: 'swift', label: 'Swift', icon: 'swift' },
  { id: 'kotlin', label: 'Kotlin', icon: 'kt' },
  { id: 'sql', label: 'SQL', icon: 'sql' },
  { id: 'html', label: 'HTML', icon: 'html' },
  { id: 'css', label: 'CSS', icon: 'css' },
  { id: 'json', label: 'JSON', icon: 'json' },
  { id: 'xml', label: 'XML', icon: 'xml' },
  { id: 'yaml', label: 'YAML', icon: 'yaml' },
  { id: 'bash', label: 'Bash', icon: 'sh' },
  { id: 'dockerfile', label: 'Dockerfile', icon: 'docker' },
];

// Themes
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
};

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT',
  JOIN: 'JOIN',
  LEAVE: 'LEAVE',
  EDIT: 'EDIT',
  CODE_UPDATE: 'CODE_UPDATE',
  USER_JOINED: 'USER_JOINED',
  USER_LEFT: 'USER_LEFT',
  CURSOR_MOVED: 'CURSOR_MOVED',
  ERROR: 'ERROR',
};

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  WEAK_PASSWORD: /^.{6,}$/,
};

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 5,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 30000, // 30 seconds
  BACKOFF_MULTIPLIER: 2,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

