import { useState, useMemo } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import FilterBar from '../components/ui/FilterBar';
import TransactionRow from '../components/ui/TransactionRow';

const ROWS_PER_PAGE = 25;

export default function TransactionsPage() {
  const { analysisData } = useAnalysis();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    leaksOnly: false,
  });
  const [page, setPage] = useState(1);

  if (!analysisData) return null;

  const transactions = analysisData.transactions || [];

  const categories = useMemo(() => {
    return transactions.map((t) => t.category).filter(Boolean);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Sort by date descending
    result.sort((a, b) => {
      const da = a.date || '';
      const db = b.date || '';
      return db.localeCompare(da);
    });

    // Search by merchant
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) =>
        (t.merchant || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Amount range (absolute values)
    if (filters.minAmount !== '') {
      const min = parseFloat(filters.minAmount);
      if (!isNaN(min)) {
        result = result.filter((t) => Math.abs(t.amount || 0) >= min);
      }
    }
    if (filters.maxAmount !== '') {
      const max = parseFloat(filters.maxAmount);
      if (!isNaN(max)) {
        result = result.filter((t) => Math.abs(t.amount || 0) <= max);
      }
    }

    // Leaks only
    if (filters.leaksOnly) {
      result = result.filter((t) => t.is_leak);
    }

    return result;
  }, [transactions, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIdx, startIdx + ROWS_PER_PAGE);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Filter Bar */}
      <FilterBar categories={categories} onFilterChange={handleFilterChange} />

      {/* Count */}
      <p className="text-xs text-text-muted px-1">
        Showing {filteredTransactions.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + ROWS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
      </p>

      {/* Table */}
      <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Merchant</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-right">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-center">Leak</th>
                <th className="px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-center">Recurring</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm text-text-muted">No transactions match your filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn, i) => (
                  <TransactionRow key={txn.id || i} transaction={txn} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-card border border-surface-border text-text-muted hover:bg-surface-raised disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <span className="text-xs text-text-muted px-3">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-card border border-surface-border text-text-muted hover:bg-surface-raised disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
