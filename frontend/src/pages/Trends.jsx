import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import { getMonthlyTrend } from '../api/dashboardApi'
import TrendLineChart from '../components/charts/TrendLineChart'
import MonthlyCategoryChart from '../components/charts/MonthlyCategoryChart'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Trends() {
  const { data, loading, error } = useFetch(getMonthlyTrend)

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Error loading trends: {error}</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const trendData = data?.trend || []

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
        <h1 className="text-3xl font-bold text-slate-900">Trends</h1>
        <p className="text-slate-600 mt-1">
          Monthly spending patterns and trends
        </p>
      </motion.div>

      {/* Trend Line Chart */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          Leak Score Trend
        </h2>
        <TrendLineChart data={trendData} />
      </motion.div>

      {/* Monthly Category Chart */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          Monthly Category Breakdown
        </h2>
        <MonthlyCategoryChart data={trendData} />
      </motion.div>

      {/* Summary Cards */}
      {trendData && trendData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendData.slice(0, 3).map((month, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="card p-6 text-center"
            >
              <p className="text-sm font-medium text-slate-600 mb-2">
                {month.month}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${Object.values(month)
                  .filter(v => typeof v === 'number')
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}