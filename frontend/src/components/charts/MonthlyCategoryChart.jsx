import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { getCategoryColor } from '../../utils/colors'

export default function MonthlyCategoryChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-slate-50 rounded-lg">
        <p className="text-slate-500">No monthly data available</p>
      </div>
    )
  }

  const categories = data[0] 
    ? Object.keys(data[0]).filter(key => key !== 'month')
    : []

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {categories.map((category, index) => (
            <Bar 
              key={category} 
              dataKey={category} 
              fill={getCategoryColor(category)}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}