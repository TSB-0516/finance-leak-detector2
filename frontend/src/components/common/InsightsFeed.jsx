import { motion } from 'framer-motion'
import { Zap, TrendingDown, AlertCircle } from 'lucide-react'

export default function InsightsFeed({ insights = [] }) {
  const getInsightIcon = (index) => {
    const icons = [Zap, TrendingDown, AlertCircle]
    return icons[index % icons.length]
  }

  const getInsightColor = (index) => {
    const colors = [
      'bg-emerald-100 text-emerald-600',
      'bg-amber-100 text-amber-600',
      'bg-rose-100 text-rose-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-3">
      {insights && insights.length > 0 ? (
        insights.map((insight, index) => {
          const IconComponent = getInsightIcon(index)
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getInsightColor(index)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
            </motion.div>
          )
        })
      ) : (
        <p className="text-slate-500 text-sm text-center py-4">
          No insights available yet
        </p>
      )}
    </div>
  )
}