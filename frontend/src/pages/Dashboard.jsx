import { motion } from 'framer-motion'
import { useDashboard } from '../hooks/useDashboard'
import LeakScoreCard from '../components/cards/LeakScoreCard'
import BiggestLeakCard from '../components/cards/BiggestLeakCard'
import MonthlySummaryCard from '../components/cards/MonthlySummaryCard'
import SpendingStyleCard from '../components/cards/SpendingStyleCard'
import MicroLeaksCard from '../components/cards/MicroLeaksCard'
import SpendingDonutChart from '../components/charts/SpendingDonutChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import InsightsFeed from '../components/common/InsightsFeed'

export default function Dashboard() {
  const { data, loading, error } = useDashboard()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Error loading dashboard: {error}</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Your financial health snapshot</p>
      </motion.div>

      {/* Hero Cards - 4 Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LeakScoreCard score={data.score} loading={loading} />
        <SpendingStyleCard insights={data.insights?.insights} />
        <BiggestLeakCard leak={data.topLeak} loading={loading} />
        <MonthlySummaryCard summary={data.summary} loading={loading} />
      </div>

      {/* Middle Section - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Breakdown */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Spending Breakdown
          </h2>
          <SpendingDonutChart data={data.spending?.spending_breakdown} />
        </motion.div>

        {/* Recurring Payments */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Recurring Payments
          </h2>
          <div className="space-y-3">
            {data.recurring?.recurring && data.recurring.recurring.length > 0 ? (
              data.recurring.recurring.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">{item.merchant}</p>
                    <p className="text-xs text-slate-600">{item.count} times</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">
                No recurring payments
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Micro Leaks */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <MicroLeaksCard microLeaks={data.microLeaks} loading={loading} />
        </motion.div>

        {/* Insights Feed */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            AI Insights
          </h2>
          <InsightsFeed insights={data.insights?.insights} />
        </motion.div>
      </div>
    </motion.div>
  )
}