import { motion } from 'framer-motion'
import { getSeverityColor, getSeverityBgColor } from '../../utils/formatters'

export default function LeakScoreCard({ score = null, loading = false }) {
  if (loading) {
    return (
      <div className="card p-6 h-full flex items-center justify-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!score) {
    return (
      <div className="card p-6 text-center text-slate-500">
        No data available
      </div>
    )
  }

  const { score: scoreValue, band } = score

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`card p-6 h-full flex flex-col items-center justify-center ${getSeverityBgColor(band)}`}
    >
      <p className="text-sm font-medium text-slate-600 mb-4">Leak Score</p>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="relative w-32 h-32 flex items-center justify-center"
      >
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className={getSeverityColor(band)}
            initial={{ strokeDasharray: '0 351.86' }}
            animate={{ strokeDasharray: `${(scoreValue / 100) * 351.86} 351.86` }}
            transition={{ duration: 1, delay: 0.3 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold ${getSeverityColor(band)}`}>
            {Math.round(scoreValue)}
          </span>
          <span className="text-xs text-slate-600 mt-1">/ 100</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-center"
      >
        <p className={`text-lg font-semibold ${getSeverityColor(band)} capitalize`}>
          {band}
        </p>
        <p className="text-xs text-slate-600 mt-1">
          {band === 'low' && 'Your spending is healthy'}
          {band === 'moderate' && 'Some areas need attention'}
          {band === 'severe' && 'Significant leaks detected'}
        </p>
      </motion.div>
    </motion.div>
  )
}