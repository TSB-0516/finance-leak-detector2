import { useState, useMemo } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import CategoryPieChart from '../components/ui/CategoryPieChart';
import MerchantBarChart from '../components/ui/MerchantBarChart';
import formatCurrency from '../utils/formatCurrency';
import formatPercent from '../utils/formatPercent';

export default function BreakdownPage() {
  const { analysisData } = useAnalysis();
  const [viewMode, setViewMode] = useState('spending'); // 'spending' | 'leaks'
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!analysisData) return null;

  const { spending_breakdown, leak_breakdown } = analysisData;

  const activeData = viewMode === 'spending'
    ? (spending_breakdown || [])
    : (leak_breakdown || []).map((item) => ({
        ...item,
        total: item.leak_total,
        percentage: item.leak_percentage,
        transaction_count: item.merchants?.reduce((sum, m) => sum + (m.leak_count || 0), 0) || 0,
      }));

  // Aggregate all merchants across categories for the bar chart
  const allMerchants = useMemo(() => {
    const map = {};
    (spending_breakdown || []).forEach((cat) => {
      (cat.merchants || []).forEach((m) => {
        if (map[m.name]) {
          map[m.name].total += m.total || 0;
          map[m.name].count += m.count || 0;
        } else {
          map[m.name] = { name: m.name, total: m.total || 0, count: m.count || 0 };
        }
      });
    });
    return Object.values(map)
      .sort((a, b) => a.total - b.total) // Most negative first
      .slice(0, 8);
  }, [spending_breakdown]);

  function handleCategoryClick(category) {
    setExpandedCategory(expandedCategory === category ? null : category);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toggle */}
      <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-xl p-1 w-fit">
        <button
          onClick={() => setViewMode('spending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'spending'
              ? 'bg-accent-primary text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          All Spending
        </button>
        <button
          onClick={() => setViewMode('leaks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'leaks'
              ? 'bg-status-danger text-white'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Leaks Only
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={activeData} onCategoryClick={handleCategoryClick} />
        <MerchantBarChart data={allMerchants} />
      </div>

      {/* Category Table */}
      <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <h3 className="text-sm font-semibold text-text-primary">
            {viewMode === 'spending' ? 'Spending by Category' : 'Leak Categories'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-right">% of Total</th>
                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider text-right">Transactions</th>
                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Top Merchant</th>
              </tr>
            </thead>
            <tbody>
              {activeData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-text-muted">No data available</td>
                </tr>
              ) : (
                activeData.map((row) => {
                  const merchants = row.merchants || [];
                  const topMerchant = merchants[0];
                  const isExpanded = expandedCategory === row.category;

                  return (
                    <tbody key={row.category}>
                      <tr
                        onClick={() => handleCategoryClick(row.category)}
                        className="border-b border-surface-border/50 hover:bg-surface-raised/40 cursor-pointer transition-colors duration-150"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <svg
                              className={`w-3.5 h-3.5 text-text-faint transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm text-text-primary font-medium">{row.category}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-text-primary text-right font-medium">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="px-5 py-3 text-sm text-text-muted text-right">
                          {formatPercent(row.percentage)}
                        </td>
                        <td className="px-5 py-3 text-sm text-text-muted text-right">
                          {row.transaction_count ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-text-muted">
                          {topMerchant?.name || '—'}
                        </td>
                      </tr>

                      {/* Expanded merchant rows */}
                      {isExpanded && merchants.length > 0 && merchants.map((m) => (
                        <tr key={m.name} className="bg-surface-raised/20 border-b border-surface-border/30">
                          <td className="px-5 py-2.5 pl-14 text-xs text-text-muted">{m.name}</td>
                          <td className="px-5 py-2.5 text-xs text-text-muted text-right">
                            {formatCurrency(viewMode === 'spending' ? m.total : m.leak_amount)}
                          </td>
                          <td className="px-5 py-2.5 text-xs text-text-faint text-right">—</td>
                          <td className="px-5 py-2.5 text-xs text-text-faint text-right">
                            {(viewMode === 'spending' ? m.count : m.leak_count) ?? '—'}
                          </td>
                          <td className="px-5 py-2.5" />
                        </tr>
                      ))}
                    </tbody>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
