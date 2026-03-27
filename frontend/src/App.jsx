import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Upload from './pages/Upload'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Breakdown from './pages/Breakdown'
import Trends from './pages/Trends'
import Transactions from './pages/Transactions'

function App() {
  const [analysisComplete, setAnalysisComplete] = useState(false)

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Upload onAnalysisComplete={() => setAnalysisComplete(true)} />} 
        />
        {analysisComplete && (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="breakdown" element={<Breakdown />} />
            <Route path="trends" element={<Trends />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App