import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Finance Leak Detector
          </h1>
          <p className="text-sm text-slate-500">
            Analyzing your spending patterns
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </motion.header>
  )
}