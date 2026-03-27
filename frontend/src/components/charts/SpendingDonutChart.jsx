import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getCategoryColor } from '../../utils/colors'

export default function SpendingDonutChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg">
        <p className="text-slate-500">No spending data available</p>
      </div>
    )
  }

  const chartData = data.map(item => ({
    name: item.category,
    value: item.total,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getCategoryColor(entry.name)}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `$${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}