export default function TrendsPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      {/* Illustration */}
      <div className="w-24 h-24 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" opacity={0.3} />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-text-primary tracking-tight mb-2">
        Spending Trends
      </h2>
      <p className="text-sm text-text-muted max-w-md leading-relaxed mb-8">
        Day-by-day and week-by-week trends are coming soon. Upload more statements to enable historical comparison.
      </p>

      <div className="px-5 py-2.5 rounded-xl border border-dashed border-surface-border text-xs text-text-faint font-medium">
        Coming Soon
      </div>

      {/* Feature preview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-lg">
        {[
          { label: 'Daily Spending', icon: '📅' },
          { label: 'Weekly Patterns', icon: '📊' },
          { label: 'Monthly Compare', icon: '📈' },
        ].map((feature) => (
          <div
            key={feature.label}
            className="bg-surface-card border border-surface-border rounded-xl px-4 py-5 text-center opacity-50"
          >
            <p className="text-2xl mb-2">{feature.icon}</p>
            <p className="text-xs text-text-faint font-medium">{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
