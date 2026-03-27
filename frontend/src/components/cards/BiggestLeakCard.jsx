import { motion } from 'framer-motion'
import { TrendingDown } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function BiggestLeakCard({ leak = null, loading = false }) {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-20 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!leak || !leak.biggest_leak) {
    return (
      <div className="card p-6 text-center text-slate-500">
        No leak data
      </div>
    )
  }

  const { category, amount } = leak.biggest_leak

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card p-6 bg-rose-50 border-rose-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">Biggest Leak</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{category}</h3>
        </div>
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 bg-rose-100 rounded-lg"
        >
          <TrendingDown className="w-5 h-5 text-rose-600" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-3xl font-bold text-rose-600">
          {formatCurrency(amount)}
        </p>
        <p className="text-xs text-slate-600 mt-2">
          This category has the highest leak potential
        </p>
      </motion.div>
    </motion.div>
  )
}