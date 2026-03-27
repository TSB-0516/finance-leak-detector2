export const CHART_COLORS = {
  emerald: '#22c55e',
  amber: '#f59e0b',
  rose: '#f43f5e',
  slate: '#64748b',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  pink: '#ec4899',
  violet: '#a855f7',
}

export const CATEGORY_COLORS = {
  'Food & Dining': '#22c55e',
  'Shopping': '#f59e0b',
  'Entertainment': '#f43f5e',
  'Transport': '#06b6d4',
  'Subscriptions': '#8b5cf6',
  'Utilities': '#64748b',
  'Healthcare': '#ec4899',
  'Other': '#a1a5b4',
}

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#64748b'
}