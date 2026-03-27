import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

export default function TransactionRow({ transaction }) {
  const { date, merchant, description, category, amount, is_leak, is_recurring } = transaction || {};
  const isCredit = amount > 0;

  return (
    <tr className="border-b border-surface-border/50 hover:bg-surface-raised/40 transition-colors duration-150">
      <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
        {formatDate(date)}
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-text-primary truncate max-w-[180px]">{merchant || description || '—'}</p>
      </td>
      <td className="px-4 py-3">
        <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-surface-raised text-text-muted">
          {category || '—'}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm font-medium text-right whitespace-nowrap ${isCredit ? 'text-status-success' : 'text-status-danger'}`}>
        {formatCurrency(amount)}
      </td>
      <td className="px-4 py-3 text-center">
        {is_leak && (
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-status-danger" title="Leak" />
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {is_recurring && (
          <svg className="w-4 h-4 text-accent-glow inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </td>
    </tr>
  );
}
