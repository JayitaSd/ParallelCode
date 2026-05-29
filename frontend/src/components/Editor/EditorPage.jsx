import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { CodeEditor } from './CodeEditor.jsx';
import { UsersList } from './UsersList.jsx';
import { DocumentHeader } from './DocumentHeader.jsx';
import { EditorSkeleton } from '@/components/Common/Loading.jsx';
import { showError } from '@/components/Common/Toast.jsx';
import { documentService } from '@/services/documentService.js';
import { wsService } from '@/services/websocketService.js';

export const EditorPage = () => {
  const { docId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [documentData, setDocumentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);

  // Use ref instead of state for timer
  const autoSaveTimer = useRef(null);

  // Save document
  const saveDocument = useCallback(
      async (
          content = documentData?.content,
          language = documentData?.language
      ) => {
        if (!documentData) return;

        setIsSaving(true);

        try {
          const result = await documentService.updateDocument(docId, {
            content,
            language,
          });

          if (result.success) {
            setLastSaved(new Date());
            setDocumentData(result.data);
          } else {
            showError(result.error || 'Failed to save document');
          }
        } catch (error) {
          showError('Failed to save document');
        } finally {
          setIsSaving(false);
        }
      },
      [docId, documentData]
  );

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);

      try {
        const result = await documentService.getDocument(docId);

        if (result.success) {
          setDocumentData(result.data);
          setLastSaved(new Date());
        } else {
          showError(result.error || 'Failed to load document');
          navigate('/', { replace: true });
        }
      } catch (error) {
        showError('Failed to load document');
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [docId, navigate]);

  // WebSocket connection
  useEffect(() => {
    if (!documentData || !token) return;

    const connectWS = async () => {
      try {
        await wsService.connect(token);

        setWsConnected(true);

        wsService.joinDocument(
            docId,
            user?.name || user?.username || 'User'
        );

        wsService.subscribe(docId, 'EDIT', (payload) => {
          if (payload.content) {
            setDocumentData((prev) => ({
              ...(prev || {}),
              content: payload.content,
            }));
          }
        });

        wsService.subscribe(docId, 'USER_JOINED', (payload) => {
          if (payload.user) {
            setActiveUsers((prev) => {
              const exists = prev.some(
                  (u) => u.id === payload.user.id
              );

              return exists ? prev : [...prev, payload.user];
            });
          }
        });

        wsService.subscribe(docId, 'USER_LEFT', (payload) => {
          if (payload.userId) {
            setActiveUsers((prev) =>
                prev.filter((u) => u.id !== payload.userId)
            );
          }
        });
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setWsConnected(false);
      }
    };

    connectWS();

    return () => {
      if (wsConnected) {
        wsService.leaveDocument(
            docId,
            user?.name || user?.username || 'User'
        );
      }
    };
  }, [documentData, token, docId, user, wsConnected]);

  // Code change handler
  const handleCodeChange = useCallback(
      (content) => {
        setDocumentData((prev) => ({
          ...(prev || {}),
          content,
        }));

        // Clear old timer
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }

        // New timer
        autoSaveTimer.current = setTimeout(() => {
          saveDocument(content);
        }, 2000);

        // WebSocket sync
        if (wsConnected) {
          wsService.sendEdit(
              docId,
              content,
              documentData?.language,
              user?.name || user?.username || 'User'
          );
        }
      },
      [
        docId,
        documentData?.language,
        saveDocument,
        user,
        wsConnected,
      ]
  );

  // Language change
  const handleLanguageChange = (language) => {
    setDocumentData((prev) => ({
      ...(prev || {}),
      language,
    }));

    saveDocument(documentData?.content, language);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  if (isLoading) {
    return <EditorSkeleton />;
  }

  if (!documentData) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Document not found
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The document you're looking for doesn't exist.
            </p>

            <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">

        {/* Header */}
        <DocumentHeader
            document={documentData}
            isSaving={isSaving}
            lastSaved={lastSaved}
        />

        {/* Main */}
        <div className="flex-1 flex overflow-hidden">

          {/* Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <CodeEditor
                code={documentData?.content || ''}
                language={documentData?.language || 'javascript'}
                onChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                isLoading={isLoading}
            />
          </div>

          {/* Desktop Sidebar */}
          <div
              className={`${
                  showUsersList ? 'flex' : 'hidden'
              } lg:flex flex-col w-56 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-hidden`}
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span
                    className={`w-2 h-2 rounded-full ${
                        wsConnected
                            ? 'bg-success-500'
                            : 'bg-danger-500'
                    }`}
                ></span>

                  Active Users
                </h3>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeUsers.length} user
                {activeUsers.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <UsersList
                  users={activeUsers}
                  currentUser={user}
              />
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
              onClick={() =>
                  setShowUsersList(!showUsersList)
              }
              className="lg:hidden px-3 py-2 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
          >
            Users
          </button>
        </div>
      </div>
  );
};

export default EditorPage;