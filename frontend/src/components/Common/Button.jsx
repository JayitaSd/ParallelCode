import React from 'react';

export const Button = React.forwardRef(({
                                          variant = 'primary',
                                          size = 'md',
                                          disabled = false,
                                          loading = false,
                                          className = '',
                                          children,
                                          ...props
                                        }, ref) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer inline-flex';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/50',
    ghost: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
      <button
          ref={ref}
          disabled={disabled || loading}
          className={`${baseStyles} ${variantStyle} ${sizeStyle} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
          {...props}
      >
        {loading && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        )}
        {children}
      </button>
  );
});

Button.displayName = 'Button';