import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@/utils/formatters.js';
import { Button } from '@/components/Common/Button.jsx';

export const DocumentCard = ({
  document,
  onDelete,
  isDeleting = false,
}) => {
  const truncateTitle = (title) => {
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
  };

  const truncateContent = (content) => {
    return content ? content.substring(0, 120) : 'No content yet';
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Header with Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 dark:to-transparent px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to={`/editor/${document.id}`}
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
              {truncateTitle(document.title)}
            </h3>
          </Link>
        </div>
        <button
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
          className="ml-2 p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg text-danger-600 dark:text-danger-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
          title="Delete document"
          aria-label="Delete document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 flex flex-col">
        {/* Language Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
            {document.language || 'javascript'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {formatRelativeTime(document.createdAt || new Date().toISOString())}
          </span>
        </div>

        {/* Content Preview */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
          {truncateContent(document.content)}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
        <Link
          to={`/editor/${document.id}`}
          className="block"
        >
          <Button
            variant="primary"
            size="sm"
            className="w-full text-sm"
          >
            Open Editor
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DocumentCard;
