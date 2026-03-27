import { useState, useEffect } from 'react'
import {
  getDashboardScore,
  getDashboardInsights,
  getTopLeak,
  getSpendingBreakdown,
  getTransactions,
  getRecurring,
  getMonthlyTrend,
  getMicroLeaks,
  getSummary,
  getTopLeaks,
  getLeakBreakdown,
} from '../api/dashboardApi'

export const useDashboard = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [
          score,
          insights,
          topLeak,
          spending,
          transactions,
          recurring,
          trend,
          microLeaks,
          summary,
          topLeaks,
          leakBreakdown,
        ] = await Promise.all([
          getDashboardScore(),
          getDashboardInsights(),
          getTopLeak(),
          getSpendingBreakdown(),
          getTransactions(),
          getRecurring(),
          getMonthlyTrend(),
          getMicroLeaks(),
          getSummary(),
          getTopLeaks(),
          getLeakBreakdown(),
        ])

        setData({
          score,
          insights,
          topLeak,
          spending,
          transactions,
          recurring,
          trend,
          microLeaks,
          summary,
          topLeaks,
          leakBreakdown,
        })
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  return { data, loading, error }
}