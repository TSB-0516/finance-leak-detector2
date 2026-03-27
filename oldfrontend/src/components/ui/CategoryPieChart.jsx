import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import formatCurrency from '../../utils/formatCurrency';
import formatPercent from '../../utils/formatPercent';

const COLORS = [
  '#7C6AF7', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444',
  '#EC4899', '#A855F7', '#14B8A6', '#F97316', '#6366F1',
  '#84CC16', '#06B6D4',
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload[0]) return null;
  const { category, total, percentage } = payload[0].payload;
  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-text-primary">{category}</p>
      <p className="text-xs text-text-muted mt-1">{formatCurrency(total)}</p>
      <p className="text-xs text-text-muted">{formatPercent(percentage)}</p>
    </div>
  );
}

export default function CategoryPieChart({ data, onCategoryClick }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex items-center justify-center h-80">
        <p className="text-text-muted text-sm">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Category Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="total"
              nameKey="category"
              onClick={(entry) => onCategoryClick && onCategoryClick(entry.category)}
              style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <button
            key={item.category}
            onClick={() => onCategoryClick && onCategoryClick(item.category)}
            className="flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-surface-raised transition-colors duration-200"
          >
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs text-text-muted truncate">{item.category}</span>
            <span className="text-xs text-text-faint ml-auto">{formatPercent(item.percentage)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
