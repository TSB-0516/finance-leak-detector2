import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, BarChart3, TrendingUp, List, ChevronLeft } from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Breakdown', path: '/dashboard/breakdown', icon: BarChart3 },
    { label: 'Trends', path: '/dashboard/trends', icon: TrendingUp },
    { label: 'Transactions', path: '/dashboard/transactions', icon: List },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`${
        isOpen ? 'w-64' : 'w-24'
      } transition-all duration-300 h-screen bg-gradient-premium border-r border-slate-700 sticky top-0 flex flex-col backdrop-blur-xl`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-white font-bold">FlexLeak</span>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center"
        >
          <p>v1.0.0</p>
          <p className="mt-1">Powered by AI</p>
        </motion.div>
      )}
    </motion.aside>
  )
}