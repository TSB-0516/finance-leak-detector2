export default function LoadingSpinner({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-base/90 backdrop-blur-sm">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-surface-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin-slow" />
      </div>
      <p className="text-sm text-text-muted mt-5 animate-pulse-glow">
        {message || 'Analyzing your statement...'}
      </p>
    </div>
  );
}
