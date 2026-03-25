export default function formatPercent(value) {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(1)}%`;
}
