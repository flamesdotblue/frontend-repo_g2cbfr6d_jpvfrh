import React, { useMemo, useRef, useState } from 'react';
import Hero from './components/Hero';
import Uploader from './components/Uploader';
import Insights from './components/Insights';
import TransactionsTable from './components/TransactionsTable';

const initialData = [
  { id: crypto.randomUUID(), date: new Date('2025-01-08').toISOString(), merchant: 'Swiggy', category: 'Food', amount: 349, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-08').toISOString(), merchant: 'Uber', category: 'Transport', amount: 189, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-07').toISOString(), merchant: 'PhonePe Wallet', category: 'Income', amount: 2000, type: 'Credit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-06').toISOString(), merchant: 'Big Bazaar', category: 'Groceries', amount: 1249, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-05').toISOString(), merchant: 'Netflix', category: 'Entertainment', amount: 499, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-03').toISOString(), merchant: 'Amazon', category: 'Shopping', amount: 1799, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-02').toISOString(), merchant: 'Starbucks', category: 'Cafe', amount: 260, type: 'Debit' },
  { id: crypto.randomUUID(), date: new Date('2025-01-01').toISOString(), merchant: 'Rent', category: 'Household', amount: 12000, type: 'Debit' },
];

export default function App() {
  const [transactions, setTransactions] = useState(initialData);
  const insightsRef = useRef(null);

  const onGetStarted = () => {
    insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleData = (rows) => {
    // Merge with existing and sort by date desc
    const merged = [...rows, ...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(merged);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero onGetStarted={onGetStarted} />
      <Uploader onData={handleData} />
      <div ref={insightsRef}>
        <Insights transactions={transactions} />
      </div>
      <TransactionsTable transactions={transactions} />
      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-6 text-slate-500 text-sm">
          Built for visual, modern spending analysis. Data stays in your browser.
        </div>
      </footer>
    </div>
  );
}
