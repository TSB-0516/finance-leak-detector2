export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-status-danger/10 border border-status-danger/30 rounded-2xl px-5 py-4 flex items-start gap-3 animate-fade-in">
      <svg className="w-5 h-5 text-status-danger flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="flex-1 text-sm text-status-danger">{message || 'An unexpected error occurred.'}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-status-danger/70 hover:text-status-danger transition-colors duration-200"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
