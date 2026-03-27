import { motion } from 'framer-motion'
import { formatCurrency } from '../utils/formatters'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function CategoryCard({ category, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryColors = {
    'Food & Dining': 'from-emerald-500 to-emerald-600',
    'Shopping': 'from-amber-500 to-amber-600',
    'Entertainment': 'from-rose-500 to-rose-600',
    'Transport': 'from-cyan-500 to-cyan-600',
    'Subscriptions': 'from-violet-500 to-violet-600',
    'Utilities': 'from-slate-500 to-slate-600',
    'Healthcare': 'from-pink-500 to-pink-600',
  }

  const gradient = categoryColors[category.category] || 'from-slate-500 to-slate-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-6 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold mb-3`}>
              {category.category}
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {formatCurrency(category.total)}
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              {category.top_sources?.length || 0} merchants
            </p>
          </div>
          
          <motion.button
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-slate-600" />
          </motion.button>
        </div>
      </motion.div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-200 px-6 py-4 bg-slate-50"
        >
          <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
            Top Merchants
          </p>
          <div className="space-y-2">
            {category.top_sources && category.top_sources.length > 0 ? (
              category.top_sources.map((source, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">{source.merchant}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(source.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No merchant data</p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}