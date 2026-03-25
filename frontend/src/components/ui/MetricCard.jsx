export default function MetricCard({ title, value, subtitle }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 transition-all duration-200 hover:border-surface-raised">
      <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-2">{title}</p>
      <p className="text-text-primary text-2xl font-bold tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-text-muted text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}
