import React from 'react';

export const UsersList = ({ users = [], currentUser = null }) => {
  const getAvatarColor = (index) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-amber-500',
    ];
    return colors[index % colors.length];
  };

  const getInitials = (user) => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <svg
          className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0m6 0a3 3 0 01-6 0m9-8.354a4 4 0 11-8 0 4 4 0 018 0zm-12 4a4 4 0 110 5.292M3 12H9"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No active users
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div
          key={user.id || index}
          className="flex items-center gap-3 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 ${getAvatarColor(
              index
            )}`}
          >
            {getInitials(user)}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user.name || user.username || 'Anonymous User'}
            </p>
            <div className="flex items-center gap-1">
              {currentUser?.id === user.id && (
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  (you)
                </span>
              )}
              {user.status && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.status}
                </p>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-2 h-2 rounded-full bg-success-500 flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
