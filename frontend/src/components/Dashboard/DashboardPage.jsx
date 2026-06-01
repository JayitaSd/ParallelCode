import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout.jsx';
import { DocumentList } from './DocumentList.jsx';
import { CreateDocModal } from './CreateDocModal.jsx';
import { Button } from '@/components/Common/Button.jsx';
import { Input } from '@/components/Common/Input.jsx';
import { DocumentListSkeleton } from '@/components/Common/Loading.jsx';
import { documentService } from '@/services/documentService.js';
import {
  showError,
  showSuccess,
} from '@/components/Common/Toast.jsx';
import { useAuth } from '@/hooks/useAuth.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Added logout from context

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

  // Load documents on mount
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

  // Delete document
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

  // Filter documents
  const filteredDocuments = documents.filter(
      (doc) =>
          doc?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc?.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <MainLayout showSidebar={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Welcome Header */}
            <div className="mb-12">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3">
                  Welcome back, {user?.name || user?.username}! 👋
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Continue coding, collaborating, and creating amazing things with your team.
                </p>
              </div>
            </div>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My Documents
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {documents.length} document{documents.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>

              <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Document</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>

            {/* Search Bar */}
            {documents.length > 0 && (
                <div className="mb-8">
                  <Input
                      type="search"
                      placeholder="Search documents by title or language..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500"
                  />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && documents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    No documents yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
                    Create your first document to start real-time collaboration. It only takes a second!
                  </p>
                  <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2"
                  >
                    Create First Document
                  </Button>
                </div>
            )}

            {/* No Search Results */}
            {!isLoading && documents.length > 0 && filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No documents found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or create a new document</p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && <DocumentListSkeleton count={6} />}

            {/* Documents List */}
            {!isLoading && filteredDocuments.length > 0 && (
                <DocumentList
                    documents={filteredDocuments}
                    isLoading={false}
                    onDelete={handleDeleteDocument}
                />
            )}
          </div>
        </div>

        {/* Create Document Modal */}
        <CreateDocModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateDocument}
        />
      </MainLayout>
  );
};

export default DashboardPage;