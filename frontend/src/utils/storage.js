/**
 * Safe localStorage wrapper with better error handling
 */

export const storage = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);

      // Handle "undefined" string case (common bug)
      if (!item || item === "undefined") {
        return defaultValue;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  clear: () => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  },

  hasItem: (key) => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key: ${key}`, error);
      return false;
    }
  },
};

export default storage;