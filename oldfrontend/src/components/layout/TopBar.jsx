export default function TopBar({ title, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 bg-surface-base/80 backdrop-blur-md border-b border-surface-border">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 -ml-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-all duration-200"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <h2 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h2>
    </header>
  );
}
