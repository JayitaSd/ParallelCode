import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  containerClassName = '',
  disabled = false,
  required = false,
  helpText,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName} relative z-20`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-700
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-700
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? 'border-danger-500 focus:ring-danger-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-danger-500">{error}</p>}
      {helpText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

