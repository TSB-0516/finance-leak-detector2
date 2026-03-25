import SeverityBadge from './SeverityBadge';

export default function InsightCard({ title, description, severity }) {
  const borderColorMap = {
    high: 'border-l-status-danger',
    medium: 'border-l-status-warning',
    low: 'border-l-status-success',
  };
  const borderColor = borderColorMap[severity] || 'border-l-status-info';

  return (
    <div className={`bg-surface-card border border-surface-border ${borderColor} border-l-4 rounded-2xl p-5 transition-all duration-200 hover:border-surface-raised animate-fade-in`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary mb-1.5">{title || '—'}</h4>
          <p className="text-xs text-text-muted leading-relaxed">{description || '—'}</p>
        </div>
        <SeverityBadge severity={severity} />
      </div>
    </div>
  );
}
