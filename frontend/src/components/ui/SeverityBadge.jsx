const config = {
  high: { bg: 'bg-status-danger/15', text: 'text-status-danger', label: 'High Risk' },
  medium: { bg: 'bg-status-warning/15', text: 'text-status-warning', label: 'Medium' },
  low: { bg: 'bg-status-success/15', text: 'text-status-success', label: 'Low' },
};

export default function SeverityBadge({ severity }) {
  const c = config[severity] || config.low;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text} whitespace-nowrap`}>
      {c.label}
    </span>
  );
}
