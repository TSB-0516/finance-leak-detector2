import { useAnalysis } from '../context/AnalysisContext';
import LeakScoreGauge from '../components/ui/LeakScoreGauge';
import MetricCard from '../components/ui/MetricCard';
import TopLeakCard from '../components/ui/TopLeakCard';
import InsightCard from '../components/ui/InsightCard';
import formatCurrency from '../utils/formatCurrency';
import formatDate from '../utils/formatDate';

export default function DashboardPage() {
  const { analysisData } = useAnalysis();

  if (!analysisData) return null;

  const {
    leak_score,
    analysis,
    top_leaks,
    insights,
  } = analysisData;

  const totalIncome = analysis?.total_income;
  const totalSpending = analysis?.total_spending;
  const totalTransactions = analysis?.total_transactions;
  const dateStart = analysis?.date_range?.start;
  const dateEnd = analysis?.date_range?.end;
  const periodLabel = dateStart && dateEnd
    ? `${formatDate(dateStart)} — ${formatDate(dateEnd)}`
    : '—';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Leak Score */}
      <LeakScoreGauge score={leak_score} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          subtitle="Credits received"
        />
        <MetricCard
          title="Total Spending"
          value={formatCurrency(totalSpending)}
          subtitle="Debits made"
        />
        <MetricCard
          title="Analysis Period"
          value={analysis?.number_of_days ? `${analysis.number_of_days} days` : '—'}
          subtitle={periodLabel}
        />
        <MetricCard
          title="Transactions"
          value={totalTransactions != null ? totalTransactions.toLocaleString() : '—'}
          subtitle="Total processed"
        />
      </div>

      {/* Top 3 Leaks */}
      {top_leaks && top_leaks.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-primary mb-3 tracking-tight">
            Your Biggest Spending Leaks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top_leaks.map((leak, index) => (
              <TopLeakCard
                key={JSON.stringify(leak) + index}
                rank={leak.rank}
                category={leak.category}
                leak_amount={leak.leak_amount}
                leak_percentage={leak.leak_percentage}
                reason={leak.reason}
              />
            ))}
          </div>
        </section>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-text-primary mb-3 tracking-tight">
            Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <InsightCard
                key={i}
                title={insight.title}
                description={insight.description}
                severity={insight.severity}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
