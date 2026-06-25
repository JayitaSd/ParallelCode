import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout.jsx';
import { Button } from '@/components/Common/Button.jsx';

export const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
            <svg
              className="w-32 h-32 mx-auto text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" size="lg" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" size="lg" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Need help?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;

