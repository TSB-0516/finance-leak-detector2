import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function MicroLeaksCard({ microLeaks = null, loading = false }) {
  if (loading) {
    return (
      <div className="card p-6">
        <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!microLeaks) {
    return (
      <div className="card p-6 text-center text-slate-500">
        No micro-leak data
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-6 bg-amber-50 border-amber-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">Micro Leaks</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">
            {microLeaks.count}
          </h3>
          <p className="text-xs text-slate-600 mt-1">transactions detected</p>
        </div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 bg-amber-100 rounded-lg"
        >
          <Zap className="w-5 h-5 text-amber-600" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-lg font-bold text-amber-600">
          {formatCurrency(microLeaks.total)}
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Total amount in small purchases
        </p>
      </motion.div>
    </motion.div>
  )
}