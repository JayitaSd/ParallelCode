import React, { createContext, useEffect, useState } from 'react';
import { storage } from '@/utils/storage.js';
import { STORAGE_KEYS } from '@/utils/constants.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedUser = storage.getItem(STORAGE_KEYS.USER_DATA);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, userData);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeItem(STORAGE_KEYS.USER_DATA);
    setError(null);
  };

  const setAuthError = (err) => {
    setError(err);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    setAuthError,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

