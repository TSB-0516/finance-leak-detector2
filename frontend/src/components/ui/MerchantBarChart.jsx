import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import formatCurrency from '../../utils/formatCurrency';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload[0]) return null;
  const { name, total, count } = payload[0].payload;
  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-text-primary">{name}</p>
      <p className="text-xs text-text-muted mt-1">{formatCurrency(total)}</p>
      {count != null && <p className="text-xs text-text-faint">{count} transactions</p>}
    </div>
  );
}

export default function MerchantBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex items-center justify-center h-80">
        <p className="text-text-muted text-sm">No merchant data available</p>
      </div>
    );
  }

  // Take top 8 merchants, make amounts positive for chart
  const chartData = data
    .slice(0, 8)
    .map((m) => ({ ...m, absTotal: Math.abs(m.total || 0) }));

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Top Merchants by Spending</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8B90A7', fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#F1F3FA', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 106, 247, 0.08)' }} />
            <Bar dataKey="absTotal" radius={[0, 6, 6, 0]} barSize={20}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={index === 0 ? '#7C6AF7' : '#4E47C2'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
