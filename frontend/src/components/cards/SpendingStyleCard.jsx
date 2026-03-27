import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export default function SpendingStyleCard({ insights = [] }) {
  const getMainInsight = () => {
    if (insights && insights.length > 0) {
      return insights[0]
    }
    return 'Analyzing your spending patterns...'
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="card p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600">AI Insight</p>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Your Spending Pattern
          </h3>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 bg-slate-200 rounded-lg"
        >
          <Brain className="w-5 h-5 text-slate-700" />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-slate-700 leading-relaxed"
      >
        {getMainInsight()}
      </motion.p>
    </motion.div>
  )
}