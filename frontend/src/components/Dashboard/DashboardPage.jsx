import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { useTheme } from '@/context/ThemeContext.jsx';
import { Button } from '@/components/Common/Button.jsx';
import { Input } from '@/components/Common/Input.jsx';
import { DocumentList } from './DocumentList.jsx';
import { CreateDocModal } from './CreateDocModal.jsx';
import { documentService } from '@/services/documentService.js';
import { showError, showSuccess } from '@/components/Common/Toast.jsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await documentService.getDocuments();
      if (result?.success) {
        setDocuments(result.data || []);
      } else {
        showError(result?.error || 'Failed to load documents');
      }
    } catch (error) {
      console.error(error);
      showError('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Create document
  const handleCreateDocument = async (title, language) => {
    try {
      const result = await documentService.createDocument(title, language);
      if (result?.success) {
        showSuccess('Document created successfully!');
        setDocuments((prev) => [result.data, ...prev]);
        setShowCreateModal(false);
        return { success: true };
      }
      showError(result?.error || 'Failed to create document');
      return { success: false };
    } catch (error) {
      console.error(error);
      showError('Failed to create document');
      return { success: false };
    }
  };

  const handleDeleteDocument = async (docId) => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (!confirmed) return;

    try {
      const result = await documentService.deleteDocument(docId);
      if (result?.success) {
        showSuccess('Document deleted successfully');
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      } else {
        showError(result?.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error(error);
      showError('Failed to delete document');
    }
  };

  const filteredDocuments = documents.filter(
      (doc) =>
          doc?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc?.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block fixed h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ParallelCode</span>
            </div>

            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                <span>🏠</span>
                <span>Dashboard</span>
              </div>
              <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-left"
              >
                <span>✚</span>
                <span>New Document</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Top Navbar */}
          <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <Input
                  type="search"
                  placeholder="Search documents by title or language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                  onClick={toggleTheme}
                  className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {user?.username || user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </div>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
                  {(user?.username || user?.name || 'T')[0].toUpperCase()}
                </div>
              </div>
            </div>
          </nav>

          {/* Dashboard Content */}
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.username || user?.name}! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Continue coding, collaborating, and creating amazing things with your team.
              </p>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">My Documents</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {documents.length} document{documents.length !== 1 ? 's' : ''}
                </p>
              </div>

              <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2"
              >
                + New Document
              </Button>
            </div>

            {/* Documents */}
            {isLoading ? (
                <div className="text-center py-20">Loading documents...</div>
            ) : (
                <DocumentList
                    documents={filteredDocuments}
                    isLoading={isLoading}
                    onDelete={handleDeleteDocument}
                />
            )}
          </div>
        </div>

        <CreateDocModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateDocument}
        />
      </div>
  );
};

export default DashboardPage;