import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters.js';
import { showSuccess } from '@/components/Common/Toast.jsx';
import { Button } from '@/components/Common/Button.jsx';

export const DocumentHeader = ({
  document,
  isSaving = false,
  lastSaved = null,
  onUpdate = {},
}) => {
  const navigate = useNavigate();

  const handleCopyLink = () => {
    const link = `${window.location.origin}/editor/${document?.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showSuccess('Document link copied to clipboard!');
    });
  };

  const goBack = () => {
    navigate('/');
  };

  if (!document) {
    return (
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
      {/* Top Row - Title and Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={goBack}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              title="Back to documents"
              aria-label="Back to documents"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {document.title}
            </h1>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Save Status */}
          {isSaving && (
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg whitespace-nowrap">
              <svg className="w-4 h-4 animate-spin text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 hidden sm:inline">Saving...</span>
            </div>
          )}

          {lastSaved && !isSaving && (
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Saved {formatRelativeTime(lastSaved)}
            </span>
          )}

          {/* Copy Link Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            title="Copy shareable link"
            aria-label="Copy shareable link"
            className="flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* Meta Information - Mobile Responsive */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-9 sm:px-0">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Created {formatRelativeTime(document.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">{document.language}</span>
        </span>
      </div>
    </div>
  );
};

export default DocumentHeader;
