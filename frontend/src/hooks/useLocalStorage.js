import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage.js';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = storage.getItem(key);
      return storedValue !== null ? storedValue : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((valueOrFunction) => {
    try {
      const valueToStore =
        valueOrFunction instanceof Function ? valueOrFunction(value) : valueOrFunction;
      setValue(valueToStore);
      storage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  const removeValue = useCallback(() => {
    try {
      storage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [value, setStoredValue, removeValue];
};

