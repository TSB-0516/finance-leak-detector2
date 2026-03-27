import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency, formatCurrencyDecimal } from '../../utils/formatters'

export default function TransactionsTable({ transactions = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category))
    return Array.from(cats).sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = 
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
        const matchesType = selectedType === 'all' || t.type === selectedType
        return matchesSearch && matchesCategory && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'amount') return b.amount - a.amount
        return 0
      })
  }, [transactions, searchTerm, selectedCategory, selectedType, sortBy])

  return (
    <div className="card p-6">
      {/* Filters */}
      <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date">Date (Newest)</option>
              <option value="amount">Amount (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Date
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Description
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Category
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">
                Type
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-700">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {transaction.type === 'debit' ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-rose-600" />
                          <span className="text-rose-600 font-medium">Debit</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Credit</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="text-right px-4 py-3 font-semibold">
                    <span className={transaction.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'}>
                      {transaction.type === 'debit' ? '-' : '+'}
                      {formatCurrencyDecimal(transaction.amount)}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-slate-600 text-center">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>
    </div>
  )
}