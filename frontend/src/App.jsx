import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { ThemeProvider } from '@/context/ThemeContext.jsx';
import { DocumentProvider } from '@/context/DocumentContext.jsx';
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute.jsx';
import { ErrorBoundary } from '@/components/Common/ErrorBoundary.jsx';

// Pages
import Auth from '@/pages/Auth.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import Editor from '@/pages/Editor.jsx';
import NotFound from '@/pages/NotFound.jsx';

export const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <DocumentProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<Auth />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editor/:docId"
                  element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </DocumentProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
