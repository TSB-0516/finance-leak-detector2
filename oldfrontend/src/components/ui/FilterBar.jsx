import { useState, useMemo } from 'react';

export default function FilterBar({ categories, onFilterChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [leaksOnly, setLeaksOnly] = useState(false);

  const uniqueCategories = useMemo(() => {
    if (!categories) return [];
    return [...new Set(categories)].sort();
  }, [categories]);

  function emitChange(overrides = {}) {
    const filters = { search, category, minAmount, maxAmount, leaksOnly, ...overrides };
    onFilterChange && onFilterChange(filters);
  }

  function handleClear() {
    setSearch('');
    setCategory('');
    setMinAmount('');
    setMaxAmount('');
    setLeaksOnly(false);
    onFilterChange && onFilterChange({ search: '', category: '', minAmount: '', maxAmount: '', leaksOnly: false });
  }

  const inputClass = 'bg-surface-raised border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-accent-primary transition-colors duration-200';

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Search merchant..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); emitChange({ search: e.target.value }); }}
            className={`${inputClass} w-full`}
          />
        </div>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); emitChange({ category: e.target.value }); }}
          className={`${inputClass} min-w-[140px]`}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Amount range */}
        <input
          type="number"
          placeholder="Min ₹"
          value={minAmount}
          onChange={(e) => { setMinAmount(e.target.value); emitChange({ minAmount: e.target.value }); }}
          className={`${inputClass} w-24`}
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxAmount}
          onChange={(e) => { setMaxAmount(e.target.value); emitChange({ maxAmount: e.target.value }); }}
          className={`${inputClass} w-24`}
        />

        {/* Leaks toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={leaksOnly}
            onChange={(e) => { setLeaksOnly(e.target.checked); emitChange({ leaksOnly: e.target.checked }); }}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-surface-raised rounded-full peer peer-checked:bg-accent-primary transition-colors duration-200 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-text-primary after:rounded-full after:transition-transform after:duration-200 peer-checked:after:translate-x-4" />
          <span className="text-xs text-text-muted">Leaks only</span>
        </label>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="text-xs text-text-faint hover:text-text-muted transition-colors duration-200 px-3 py-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
