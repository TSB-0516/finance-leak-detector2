export default function UploadStatus({ fileName, fileSize, status }) {
  function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  if (!fileName) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-surface-border rounded-xl mt-4 animate-fade-in">
      <svg className="w-5 h-5 text-accent-glow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{fileName}</p>
        <p className="text-xs text-text-muted">{formatSize(fileSize)}</p>
      </div>
      {status === 'uploading' && (
        <div className="w-4 h-4 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
      )}
      {status === 'success' && (
        <svg className="w-5 h-5 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}
