import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function MonthlySummaryCard({ summary = null, loading = false }) {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-20 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="card p-6 text-center text-slate-500">
        No summary data
      </div>
    )
  }

  const totalSpend = (summary.essential || 0) + (summary.discretionary || 0)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card p-6 bg-emerald-50 border-emerald-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">Monthly Spend</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalSpend)}
          </h3>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="p-3 bg-emerald-100 rounded-lg"
        >
          <DollarSign className="w-5 h-5 text-emerald-600" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Essential</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(summary.essential || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Discretionary</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(summary.discretionary || 0)}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}