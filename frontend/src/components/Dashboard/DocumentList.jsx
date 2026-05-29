import { useState } from 'react';
import { DocumentCard } from './DocumentCard.jsx';
import { DocumentListSkeleton } from '@/components/Common/Loading.jsx';
import { Modal } from '@/components/Common/Modal.jsx';

export const DocumentList = ({
  documents = [],
  isLoading = false,
  onDelete,
  searchTerm = '',
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (docId) => {
    setDeleteConfirm(docId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteConfirm);
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <DocumentListSkeleton count={6} />;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Create your first document to get started</p>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No documents found matching "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map(doc => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onDelete={handleDeleteClick}
            isDeleting={isDeleting && deleteConfirm === doc.id}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onClose={() => !isDeleting && setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={isDeleting}
      />
    </>
  );
};

export default DocumentList;

