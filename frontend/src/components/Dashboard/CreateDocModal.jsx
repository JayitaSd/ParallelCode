import { useState } from 'react';
import { Modal } from '@/components/Common/Modal.jsx';
import { Input } from '@/components/Common/Input.jsx';
import { validateDocumentTitle } from '@/utils/validators.js';
import { SUPPORTED_LANGUAGES } from '@/utils/constants.js';

export const CreateDocModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    const titleError = validateDocumentTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }

    setError('');
    const result = await onCreate(title, language);

    if (result.success) {
      setTitle('');
      setLanguage('javascript');
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setLanguage('javascript');
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create New Document"
      onClose={handleClose}
      onConfirm={handleCreate}
      confirmText="Create"
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <Input
          label="Document Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          placeholder="My awesome code"
          disabled={isLoading}
          autoFocus
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDocModal;

