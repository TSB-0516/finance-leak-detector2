import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

function getScoreConfig(score) {
  if (score <= 30) return { color: '#22C55E', label: 'Excellent', sublabel: 'Low leakage detected' };
  if (score <= 50) return { color: '#F59E0B', label: 'Good', sublabel: 'Moderate leakage detected' };
  if (score <= 70) return { color: '#F97316', label: 'Fair', sublabel: 'Significant leakage detected' };
  return { color: '#EF4444', label: 'Poor', sublabel: 'Severe leakage detected' };
}

export default function LeakScoreGauge({ score }) {
  const safeScore = typeof score === 'number' ? score : 0;
  const config = getScoreConfig(safeScore);

  const data = [
    { name: 'bg', value: 100, fill: '#1A1D27' },
    { name: 'score', value: safeScore, fill: config.color },
  ];

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 flex flex-col items-center animate-fade-in">
      <div className="relative w-56 h-56 md:w-64 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={225}
            endAngle={-45}
            data={data}
            barSize={14}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gauge-center-text">
          <span className="text-5xl font-bold tracking-tight" style={{ color: config.color }}>
            {safeScore}
          </span>
          <span className="text-sm font-semibold text-text-primary mt-1">{config.label}</span>
        </div>
      </div>

      <p className="text-sm text-text-muted mt-3 text-center">{config.sublabel}</p>

      {/* Score range legend */}
      <div className="flex items-center gap-4 mt-4">
        {[
          { range: '0–30', color: '#22C55E', label: 'Low' },
          { range: '31–50', color: '#F59E0B', label: 'Mid' },
          { range: '51–70', color: '#F97316', label: 'High' },
          { range: '71–100', color: '#EF4444', label: 'Severe' },
        ].map((item) => (
          <div key={item.range} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-text-faint">{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
