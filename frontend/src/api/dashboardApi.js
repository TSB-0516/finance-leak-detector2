import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export const uploadBankStatement = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export const getDashboardScore = async () => {
  try {
    const response = await api.get('/dashboard/score')
    return response.data
  } catch (error) {
    console.error('Score fetch error:', error)
    throw error
  }
}

export const getDashboardInsights = async () => {
  try {
    const response = await api.get('/dashboard/insights')
    return response.data
  } catch (error) {
    console.error('Insights fetch error:', error)
    throw error
  }
}

export const getTopLeak = async () => {
  try {
    const response = await api.get('/dashboard/top-leak')
    return response.data
  } catch (error) {
    console.error('Top leak fetch error:', error)
    throw error
  }
}

export const getTopLeaks = async () => {
  try {
    const response = await api.get('/dashboard/top-leaks')
    return response.data
  } catch (error) {
    console.error('Top leaks fetch error:', error)
    throw error
  }
}

export const getSpendingBreakdown = async () => {
  try {
    const response = await api.get('/dashboard/spending-breakdown')
    return response.data
  } catch (error) {
    console.error('Spending breakdown fetch error:', error)
    throw error
  }
}

export const getLeakBreakdown = async () => {
  try {
    const response = await api.get('/dashboard/leak-breakdown')
    return response.data
  } catch (error) {
    console.error('Leak breakdown fetch error:', error)
    throw error
  }
}

export const getTransactions = async () => {
  try {
    const response = await api.get('/dashboard/transactions')
    return response.data
  } catch (error) {
    console.error('Transactions fetch error:', error)
    throw error
  }
}

export const getRecurring = async () => {
  try {
    const response = await api.get('/dashboard/recurring')
    return response.data
  } catch (error) {
    console.error('Recurring fetch error:', error)
    throw error
  }
}

export const getMonthlyTrend = async () => {
  try {
    const response = await api.get('/dashboard/monthly-trend')
    return response.data
  } catch (error) {
    console.error('Monthly trend fetch error:', error)
    throw error
  }
}

export const getMicroLeaks = async () => {
  try {
    const response = await api.get('/dashboard/micro-leaks')
    return response.data
  } catch (error) {
    console.error('Micro leaks fetch error:', error)
    throw error
  }
}

export const getSummary = async () => {
  try {
    const response = await api.get('/dashboard/summary')
    return response.data
  } catch (error) {
    console.error('Summary fetch error:', error)
    throw error
  }
}