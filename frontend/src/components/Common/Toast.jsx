import React from 'react';
import toast from 'react-hot-toast';

/**
 * Common toast styles
 */
const commonStyle = {
  color: '#fff',
  fontSize: '14px',
  borderRadius: '8px',
  padding: '12px 16px',
};

/**
 * Show success toast
 */
export const showSuccess = (message) => {
  toast.success(message, {
    position: 'bottom-right',
    duration: 3000,
    style: {
      ...commonStyle,
      background: '#10B981',
    },
  });
};

/**
 * Show error toast
 */
export const showError = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    duration: 3000,
    style: {
      ...commonStyle,
      background: '#EF4444',
    },
  });
};

/**
 * Show info toast
 */
export const showInfo = (message) => {
  toast.custom(
      (t) => (
          <div
              className={`flex items-center gap-2 shadow-lg ${
                  t.visible
                      ? 'animate-enter'
                      : 'animate-leave'
              }`}
              style={{
                ...commonStyle,
                background: '#3B82F6',
              }}
          >
            <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              />
            </svg>

            <span>{message}</span>
          </div>
      ),
      {
        id: 'info-toast',
        duration: 3000,
        position: 'bottom-right',
      }
  );
};

/**
 * Show loading toast
 */
export const showLoading = (message) => {
  return toast.loading(message, {
    id: 'loading-toast',
    position: 'bottom-right',
    style: {
      ...commonStyle,
      background: '#111827',
    },
  });
};

/**
 * Dismiss specific toast
 */
export const dismissToast = (id) => {
  toast.dismiss(id);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Toast wrapper component
 */
export const Toast = () => {
  return null;
};

export default Toast;