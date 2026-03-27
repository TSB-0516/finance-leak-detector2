import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import { getTransactions } from '../api/dashboardApi'
import TransactionsTable from '../components/tables/TransactionsTable'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Transactions() {
  const { data, loading, error } = useFetch(getTransactions)

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Error loading transactions: {error}</p>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const transactions = data?.transactions || []

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
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="text-slate-600 mt-1">
          Complete transaction history with advanced filtering
        </p>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <TransactionsTable transactions={transactions} />
      </motion.div>
    </motion.div>
  )
}