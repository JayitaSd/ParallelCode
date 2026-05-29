import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header.jsx';

export const MainLayout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
};

