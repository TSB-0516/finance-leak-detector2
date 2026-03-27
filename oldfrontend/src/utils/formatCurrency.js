export default function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '—';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Indian numbering: last 3 digits, then groups of 2
  const [intPart, decPart] = absAmount.toFixed(2).split('.');
  let formatted = '';

  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const last3 = intPart.slice(-3);
    let remaining = intPart.slice(0, -3);
    const groups = [];
    while (remaining.length > 2) {
      groups.unshift(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) groups.unshift(remaining);
    formatted = groups.join(',') + ',' + last3;
  }

  const sign = isNegative ? '-' : '';
  return `${sign}₹${formatted}.${decPart}`;
}
