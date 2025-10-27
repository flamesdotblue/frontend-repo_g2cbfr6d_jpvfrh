import React, { useMemo } from 'react';
import { CreditCard, PieChart, BarChart3, TrendingUp } from 'lucide-react';

function formatCurrency(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
}

export default function Insights({ transactions = [] }) {
  const { totalSpend, totalIncome, count, avg, byCategory, byDay } = useMemo(() => summarize(transactions), [transactions]);

  return (
    <section id="insights" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<CreditCard className="w-5 h-5" />} label="Total Spend" value={formatCurrency(totalSpend)} />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Income" value={formatCurrency(totalIncome)} />
          <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Transactions" value={count} />
          <StatCard icon={<PieChart className="w-5 h-5" />} label="Avg Spend" value={formatCurrency(avg)} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur p-5">
            <h3 className="text-slate-200 font-medium mb-3">Spending trend</h3>
            <LineChart data={byDay} />
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur p-5">
            <h3 className="text-slate-200 font-medium mb-3">Top categories</h3>
            <CategoryList data={byCategory} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur p-5 flex items-center gap-4">
      <div className="p-2 rounded-lg bg-violet-500/20 text-violet-300">
        {icon}
      </div>
      <div>
        <div className="text-slate-400 text-sm">{label}</div>
        <div className="text-white text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function summarize(transactions) {
  const debitTx = transactions.filter((t) => (t.type || '').toLowerCase() !== 'credit');
  const creditTx = transactions.filter((t) => (t.type || '').toLowerCase() === 'credit');
  const totalSpend = debitTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalIncome = creditTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const count = transactions.length;
  const avg = debitTx.length ? totalSpend / debitTx.length : 0;

  // Categories
  const byCategoryMap = new Map();
  for (const t of debitTx) {
    const key = t.category || 'Uncategorized';
    byCategoryMap.set(key, (byCategoryMap.get(key) || 0) + (t.amount || 0));
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // By day (YYYY-MM-DD)
  const dayMap = new Map();
  for (const t of debitTx) {
    const d = new Date(t.date);
    const key = isNaN(d) ? 'Unknown' : d.toISOString().slice(0, 10);
    dayMap.set(key, (dayMap.get(key) || 0) + (t.amount || 0));
  }
  const byDay = Array.from(dayMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { totalSpend, totalIncome, count, avg, byCategory, byDay };
}

function LineChart({ data }) {
  // Render a simple SVG line chart
  const padding = 24;
  const width = 700;
  const height = 220;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * w + padding;
    const y = height - padding - (d.value / max) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline fill="url(#grad)" stroke="none" points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} />
      <polyline fill="none" stroke="#a78bfa" strokeWidth="2.5" points={points} />
    </svg>
  );
}

function CategoryList({ data }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-4">
          <div className="text-slate-300">{item.name}</div>
          <div className="flex-1 h-2 mx-4 rounded bg-white/5 overflow-hidden">
            <div
              className="h-full bg-violet-500"
              style={{ width: `${Math.min(100, (item.value / (data[0]?.value || 1)) * 100)}%` }}
            />
          </div>
          <div className="text-slate-200 font-medium">{formatCurrency(item.value)}</div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-slate-400 text-sm">No spending yet. Upload data to see categories.</div>
      )}
    </div>
  );
}
