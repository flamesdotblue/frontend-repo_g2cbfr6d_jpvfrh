import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import JSZip from 'jszip';

const sampleCsv = `date,merchant,category,amount,type\n2025-01-08,Swiggy,Food,349,Debit\n2025-01-08,Uber,Transport,189,Debit\n2025-01-07,PhonePe Wallet,Income,2000,Credit\n2025-01-06,Big Bazaar,Groceries,1249,Debit\n2025-01-05,Netflix,Entertainment,499,Debit\n2025-01-03,Amazon,Shopping,1799,Debit\n2025-01-02,Starbucks,Cafe,260,Debit\n2025-01-01,Rent,Household,12000,Debit`;

export default function Uploader({ onData }) {
  const fileInputRef = useRef(null);

  const parseCsvText = (text) => {
    const rows = text.trim().split(/\r?\n/);
    const header = rows.shift().split(',').map((h) => h.trim().toLowerCase());

    const records = rows.map((row) => {
      const cols = row.split(',');
      const obj = {};
      header.forEach((h, i) => (obj[h] = cols[i] ? cols[i].trim() : ''));
      return normalize(obj);
    });
    return records;
  };

  const handleFile = async (file) => {
    try {
      const name = file.name.toLowerCase();
      if (!name.endsWith('.zip')) {
        alert('Please upload a ZIP file that contains a CSV.');
        return;
      }

      const zip = await JSZip.loadAsync(file);
      const csvFiles = zip.file(/\.csv$/i);
      if (!csvFiles || csvFiles.length === 0) {
        alert('No CSV file found inside the ZIP.');
        return;
      }
      // Load the first CSV inside the archive
      const csvText = await csvFiles[0].async('string');
      const records = parseCsvText(csvText);
      onData(records);
    } catch (err) {
      console.error(err);
      alert('Failed to read ZIP. Please ensure it is a valid ZIP containing a CSV file.');
    }
  };

  const normalize = (raw) => {
    return {
      date: new Date(raw.date || Date.now()).toISOString(),
      merchant: raw.merchant || raw.narration || 'Unknown',
      category: raw.category || 'Uncategorized',
      amount: Number(String(raw.amount || '0').replace(/[^\d.\-]/g, '')),
      type: (raw.type || 'Debit').toString(),
      id: crypto.randomUUID(),
    };
  };

  const triggerFile = () => fileInputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <section className="relative -mt-12 md:-mt-20 z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-6 md:p-8 text-slate-200 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">Upload your PhonePe statement</h2>
              <p className="mt-1 text-slate-400">Drag and drop a ZIP file containing a CSV, or use the button below. We process everything locally in your browser.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={triggerFile}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700 transition-colors px-4 py-2 text-white"
              >
                <Upload className="w-4 h-4" />
                <span>Choose ZIP</span>
              </button>
              <button
                onClick={() => onData(sampleCsv.split(/\r?\n/).slice(1).map((row) => {
                  const [date, merchant, category, amount, type] = row.split(',');
                  return {
                    id: crypto.randomUUID(),
                    date: new Date(date).toISOString(),
                    merchant, category,
                    amount: Number(amount),
                    type,
                  };
                }))}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors px-4 py-2 text-white"
              >
                <Download className="w-4 h-4" />
                <span>Load sample data</span>
              </button>
            </div>
          </div>
          <input
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
