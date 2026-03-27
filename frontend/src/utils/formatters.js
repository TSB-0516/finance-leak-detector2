export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatCurrencyDecimal = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(1)}%`
}

export const getSeverityColor = (band) => {
  switch (band) {
    case 'low':
      return 'text-emerald-600'
    case 'moderate':
      return 'text-amber-600'
    case 'severe':
      return 'text-rose-600'
    default:
      return 'text-slate-600'
  }
}

export const getSeverityBgColor = (band) => {
  switch (band) {
    case 'low':
      return 'bg-emerald-50'
    case 'moderate':
      return 'bg-amber-50'
    case 'severe':
      return 'bg-rose-50'
    default:
      return 'bg-slate-50'
  }
}

export const getSeverityBorder = (band) => {
  switch (band) {
    case 'low':
      return 'border-emerald-200'
    case 'moderate':
      return 'border-amber-200'
    case 'severe':
      return 'border-rose-200'
    default:
      return 'border-slate-200'
  }
}

export const getChartColor = (band) => {
  switch (band) {
    case 'low':
      return '#16a34a'
    case 'moderate':
      return '#d97706'
    case 'severe':
      return '#e11d48'
    default:
      return '#475569'
  }
}