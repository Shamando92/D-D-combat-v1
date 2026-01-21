
import React, { useState } from 'react';
import { fetchMonsterStats } from '../services/geminiService';

interface ImportModalProps {
  onImport: (stats: any, count: number) => void;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onImport, onClose }) => {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    const stats = await fetchMonsterStats(query);
    if (stats) {
      onImport(stats, count);
      onClose();
    } else {
      setError('Could not find stats for that creature.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl p-6">
        <h2 className="fantasy-font text-2xl text-amber-500 mb-6">Import Creature Stats</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Monster Name</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Ancient Red Dragon"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(n => (
                <option key={n} value={n}>{n} Units</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSearch}
              disabled={loading || !query}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 disabled:text-amber-100 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Consulting Tome...
                </>
              ) : 'Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
