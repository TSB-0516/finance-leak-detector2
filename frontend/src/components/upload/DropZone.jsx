import { useState, useRef, useCallback } from 'react';

export default function DropZone({ onFileSelect }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!file) return 'No file selected.';
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are accepted.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be under 10MB.';
    }
    return null;
  }, []);

  const handleFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      setSelectedFile(null);
      onFileSelect && onFileSelect(null);
      return;
    }
    setError('');
    setSelectedFile(file);
    onFileSelect && onFileSelect(file);
  }, [validateFile, onFileSelect]);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    handleFile(file);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center
          transition-all duration-300 ease-out
          ${isDragActive
            ? 'border-accent-primary bg-accent-primary/5 scale-[1.02]'
            : 'border-surface-border hover:border-accent-soft hover:bg-surface-card/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-accent-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text-primary truncate">{selectedFile.name}</p>
            <p className="text-xs text-text-muted mt-1">{formatSize(selectedFile.size)}</p>
            <p className="text-xs text-accent-glow mt-3">Click or drop to change file</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 mx-auto rounded-xl bg-surface-raised flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-text-primary font-medium">
              Drag and drop your PDF here
            </p>
            <p className="text-xs text-text-muted mt-1.5">or click to browse</p>
          </>
        )}
      </div>

      <p className="text-xs text-text-faint text-center mt-3">PDF files only · Max 10MB</p>

      {error && (
        <p className="text-xs text-status-danger text-center mt-2 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
