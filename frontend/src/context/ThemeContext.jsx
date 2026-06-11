import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/utils/storage.js';
import { STORAGE_KEYS, THEME_OPTIONS } from '@/utils/constants.js';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEME_OPTIONS.LIGHT);
  const [loading, setLoading] = useState(true);

  // Initialize theme
  useEffect(() => {
    const savedTheme = storage.getItem(STORAGE_KEYS.THEME);

    let initialTheme = THEME_OPTIONS.LIGHT;

    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    }

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setLoading(false);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === THEME_OPTIONS.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Force Tailwind to re-evaluate dark classes
    document.documentElement.style.setProperty('--tw-content', '""');
  };

  const toggleTheme = () => {
    const newTheme = theme === THEME_OPTIONS.LIGHT
        ? THEME_OPTIONS.DARK
        : THEME_OPTIONS.LIGHT;

    setTheme(newTheme);
    applyTheme(newTheme);
    storage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const setCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    storage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setCurrentTheme,
    isDark: theme === THEME_OPTIONS.DARK,
    isLight: theme === THEME_OPTIONS.LIGHT,
    loading,
  };

  return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
  );
};

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};