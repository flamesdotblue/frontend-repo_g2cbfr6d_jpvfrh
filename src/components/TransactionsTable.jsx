import React, { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatINR(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
}

export default function TransactionsTable({ transactions = [] }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(['All']);
    transactions.forEach((t) => set.add(t.category || 'Uncategorized'));
    return Array.from(set);
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchQ = `${t.merchant} ${t.category}`.toLowerCase().includes(q.toLowerCase());
      const matchC = category === 'All' || (t.category || 'Uncategorized') === category;
      return matchQ && matchC;
    });
  }, [transactions, q, category]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-slate-200 text-lg font-medium">Recent transactions</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search merchant or category"
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="text-left font-medium p-3">Date</th>
                <th className="text-left font-medium p-3">Merchant</th>
                <th className="text-left font-medium p-3">Category</th>
                <th className="text-right font-medium p-3">Amount</th>
                <th className="text-left font-medium p-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const isCredit = (t.type || '').toLowerCase() === 'credit';
                return (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="p-3">{t.merchant}</td>
                    <td className="p-3">{t.category || 'Uncategorized'}</td>
                    <td className={`p-3 text-right font-medium ${isCredit ? 'text-emerald-300' : 'text-slate-100'}`}>
                      {isCredit ? '+' : '-'}{formatINR(t.amount)}
                    </td>
                    <td className="p-3">{t.type}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-400" colSpan={5}>No transactions found for the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
