import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import { getLeakBreakdown } from '../api/dashboardApi'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Breakdown() {
  const { data, loading, error } = useFetch(getLeakBreakdown)

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Error loading breakdown: {error}</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const leakBreakdown = data?.leak_breakdown || []

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
        <h1 className="text-3xl font-bold text-slate-900">Spending Breakdown</h1>
        <p className="text-slate-600 mt-1">
          Detailed category analysis with top merchants
        </p>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leakBreakdown && leakBreakdown.length > 0 ? (
          leakBreakdown.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
            No breakdown data available
          </div>
        )}
      </div>
    </motion.div>
  )
}