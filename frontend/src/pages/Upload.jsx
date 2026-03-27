import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadCard from '../components/common/UploadCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { uploadBankStatement } from '../api/dashboardApi'

export default function Upload({ onAnalysisComplete }) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const navigate = useNavigate()

  const handleFileSelect = async (file) => {
    try {
      setIsLoading(true)
      setUploadProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 300)

      // Upload file
      await uploadBankStatement(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Wait a moment then redirect
      setTimeout(() => {
        onAnalysisComplete()
        navigate('/dashboard')
      }, 500)
    } catch (error) {
      setIsLoading(false)
      setUploadProgress(0)
      alert('Upload failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4 text-balance">
            Personal Finance <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Leak Detector</span>
          </h1>
          <p className="text-lg text-slate-600 text-balance">
            Upload your bank statement and let AI analyze your spending behavior
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="card p-16 text-center">
              <LoadingSpinner />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Analyzing your statement
                </h3>
                <p className="text-slate-600 mb-4">
                  This may take a moment...
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-emerald-600"
                  />
                </div>
              </motion.div>
            </div>
          ) : (
            <UploadCard onFileSelect={handleFileSelect} isLoading={isLoading} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-3 gap-4 text-center"
        >
          <div className="p-4">
            <p className="text-2xl font-bold text-slate-900">🔒</p>
            <p className="text-sm text-slate-600 mt-2">Secure & Private</p>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold text-slate-900">⚡</p>
            <p className="text-sm text-slate-600 mt-2">AI Powered</p>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold text-slate-900">📊</p>
            <p className="text-sm text-slate-600 mt-2">Instant Analysis</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}