import formatCurrency from '../../utils/formatCurrency';
import formatPercent from '../../utils/formatPercent';

const rankColors = {
  1: { bg: 'bg-status-danger/15', text: 'text-status-danger', border: 'border-status-danger/30' },
  2: { bg: 'bg-status-warning/15', text: 'text-status-warning', border: 'border-status-warning/30' },
  3: { bg: 'bg-status-info/15', text: 'text-status-info', border: 'border-status-info/30' },
};

export default function TopLeakCard({ rank, category, leak_amount, leak_percentage, reason }) {
  const colors = rankColors[rank] || rankColors[3];

  return (
    <div className={`bg-surface-card border ${colors.border} rounded-2xl p-5 transition-all duration-200 hover:border-surface-raised animate-fade-in`}>
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div className={`${colors.bg} ${colors.text} w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0`}>
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-text-primary">{category || '—'}</h4>
            <span className={`text-sm font-bold ${colors.text}`}>{formatCurrency(leak_amount)}</span>
          </div>
          <p className="text-xs text-text-muted mb-2">{formatPercent(leak_percentage)} of total leakage</p>
          <p className="text-xs text-text-faint leading-relaxed">{reason || '—'}</p>
        </div>
      </div>
    </div>
  );
}
