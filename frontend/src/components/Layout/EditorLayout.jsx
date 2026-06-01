import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header.jsx';

export const EditorLayout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-950 h-screen flex flex-col text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  );
};

export default EditorLayout;

