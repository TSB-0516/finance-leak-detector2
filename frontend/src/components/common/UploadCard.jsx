import { motion } from 'framer-motion'
import { Upload, FileText } from 'lucide-react'
import { useState } from 'react'

export default function UploadCard({ onFileSelect, isLoading }) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative p-12 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
        isDragActive
          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
          : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'
      }`}
    >
      <div className="text-center">
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Drop your bank statement here
        </h3>
        <p className="text-slate-600 mb-6">
          or click to browse (CSV, PDF, or Excel)
        </p>
        
        <label className="inline-block">
          <input
            type="file"
            className="hidden"
            disabled={isLoading}
            onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
            accept=".csv,.pdf,.xlsx,.xls"
          />
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            {isLoading ? 'Processing...' : 'Select File'}
          </motion.span>
        </label>
        
        <p className="text-sm text-slate-500 mt-6">
          <FileText className="w-4 h-4 inline mr-1" />
          Supports CSV, PDF, and Excel formats
        </p>
      </div>
    </motion.div>
  )
}