import React, { createContext, useState } from 'react';

export const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const updateDocument = (document) => {
    setCurrentDocument(document);
    setError(null);
  };

  const updateDocumentContent = (content) => {
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        content,
      });
    }
  };

  const updateDocumentLanguage = (language) => {
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        language,
      });
    }
  };

  const updateActiveUsers = (users) => {
    setActiveUsers(users);
  };

  const clearDocument = () => {
    setCurrentDocument(null);
    setActiveUsers([]);
    setError(null);
  };

  const setSaving = (saving) => {
    setIsSaving(saving);
  };

  const updateLastSaved = (timestamp) => {
    setLastSaved(timestamp);
  };

  const value = {
    currentDocument,
    isLoading,
    error,
    activeUsers,
    isSaving,
    lastSaved,
    updateDocument,
    updateDocumentContent,
    updateDocumentLanguage,
    updateActiveUsers,
    clearDocument,
    setIsLoading,
    setError,
    setSaving,
    updateLastSaved,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

