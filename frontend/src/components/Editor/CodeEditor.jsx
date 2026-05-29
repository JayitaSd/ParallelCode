import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme.js';
import { SUPPORTED_LANGUAGES } from '@/utils/constants.js';

export const CodeEditor = ({
  code = '',
  language = 'javascript',
  onChange,
  onLanguageChange,
  readOnly = false,
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    if (onChange && !readOnly) {
      onChange(value || '');
    }
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    // Focus on mount for better UX
    editor.focus();
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 flex items-center gap-4 flex-wrap">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Language:
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={readOnly || isLoading}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Select programming language"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Read-only Badge */}
        {readOnly && (
          <span className="ml-auto px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full whitespace-nowrap">
            🔒 Read-only
          </span>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <span className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        )}
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme={isDark ? 'vs-dark' : 'vs'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineHeight: 1.6,
            wordWrap: 'on',
            automaticLayout: true,
            readOnly,
            insertSpaces: true,
            tabSize: 2,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorSmooth: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            showFoldingControls: 'mouseover',
            suggest: {
              enabled: true,
              showWords: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            parameterHints: { enabled: true },
            contextmenu: true,
            dragAndDrop: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
          loading={<div className="flex items-center justify-center h-full"><div className="text-gray-500">Loading editor...</div></div>}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
