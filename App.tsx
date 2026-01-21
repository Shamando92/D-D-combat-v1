
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ColumnDefinition, 
  Character, 
  INITIAL_COLUMNS, 
  ColumnType, 
  CONDITIONS 
} from './types';
import HPPopup from './components/HPPopup';
import ImportModal from './components/ImportModal';

const App: React.FC = () => {
  const [columns, setColumns] = useState<ColumnDefinition[]>(INITIAL_COLUMNS);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [activeHPPopup, setActiveHPPopup] = useState<{charId: string, element: HTMLElement} | null>(null);
  
  // Ref for table cells for keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null);

  // Load session from "cookies" (using localStorage for persistence, mimicking requested behavior)
  useEffect(() => {
    const saved = localStorage.getItem('dnd_combat_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColumns(parsed.columns || INITIAL_COLUMNS);
        setCharacters(parsed.characters || []);
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
  }, []);

  const saveSession = () => {
    const data = { columns, characters };
    localStorage.setItem('dnd_combat_session', JSON.stringify(data));
    alert('Session saved successfully!');
  };

  const addRow = () => {
    const newChar: Character = { id: crypto.randomUUID() };
    setCharacters(prev => [...prev, newChar]);
  };

  const removeRow = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const addColumn = () => {
    const name = prompt('Enter new column name:');
    if (!name) return;
    const newCol: ColumnDefinition = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      label: name,
      type: ColumnType.STRING,
      isCustom: true
    };
    setColumns(prev => [...prev, newCol]);
  };

  const updateCharacter = useCallback((id: string, field: string, value: any) => {
    setCharacters(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, [field]: value } : c);
      // Auto-sort by initiative if initiative changed
      if (field === 'initiative') {
        return [...updated].sort((a, b) => {
          const valA = (a.initiative as number) || 0;
          const valB = (b.initiative as number) || 0;
          return valB - valA;
        });
      }
      return updated;
    });
  }, []);

  const handleImport = (stats: any, count: number) => {
    const newChars: Character[] = [];
    for (let i = 1; i <= count; i++) {
      newChars.push({
        ...stats,
        id: crypto.randomUUID(),
        nickname: count > 1 ? `${stats.name} ${i}` : stats.name,
        name: stats.name,
      });
    }
    setCharacters(prev => {
      const combined = [...prev, ...newChars];
      return combined.sort((a, b) => ((b.initiative as number) || 0) - ((a.initiative as number) || 0));
    });
  };

  const exportCSV = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = characters.map(char => 
      columns.map(col => `"${char[col.id] || ''}"`).join(',')
    ).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `combat_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent, charIndex: number, colIndex: number) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const rows = tableRef.current?.querySelectorAll('tr.character-row');
      if (!rows) return;

      let nextRow = charIndex;
      let nextCol = colIndex;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          nextCol = colIndex - 1;
          if (nextCol < 0) {
            nextRow = charIndex - 1;
            nextCol = columns.length - 1;
          }
        } else {
          nextCol = colIndex + 1;
          if (nextCol >= columns.length) {
            nextRow = charIndex + 1;
            nextCol = 0;
          }
        }
      } else if (e.key === 'Enter') {
        if (e.shiftKey) {
          nextRow = charIndex - 1;
        } else {
          nextRow = charIndex + 1;
        }
      }

      if (nextRow >= 0 && nextRow < characters.length) {
        const targetRow = rows[nextRow];
        const targetCell = targetRow.querySelectorAll('td input, td select')[nextCol] as HTMLElement;
        targetCell?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="fantasy-font text-4xl text-amber-500 drop-shadow-lg flex items-center gap-3">
          <span className="bg-amber-600 text-slate-900 rounded-full w-10 h-10 flex items-center justify-center text-2xl">⚔</span>
          Combat Dashboard
        </h1>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={saveSession} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-all">Save Session</button>
          <button onClick={exportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-all">Export CSV</button>
          <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold text-white shadow-lg transition-all">Import Monster</button>
          <button onClick={addRow} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold text-white shadow-lg transition-all">Add Participant</button>
          <button onClick={addColumn} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-bold text-white shadow-lg transition-all">Add Column</button>
        </div>
      </header>

      {/* Main Table Container */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table ref={tableRef} className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-20 bg-slate-800 shadow-md">
              <tr>
                <th className="p-3 border-b border-slate-700 w-12 text-center"></th>
                {columns.map(col => (
                  <th key={col.id} className="p-3 border-b border-slate-700 font-bold text-slate-400 min-w-[120px]">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {characters.map((char, charIdx) => (
                <tr key={char.id} className="character-row group hover:bg-slate-800/50 border-b border-slate-800 transition-colors">
                  <td className="p-2 text-center">
                    <button 
                      onClick={() => removeRow(char.id)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      -
                    </button>
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={col.id} className="p-1 min-w-[120px]">
                      {col.type === ColumnType.CONDITION ? (
                        <select
                          value={char[col.id] || 'None'}
                          onChange={(e) => updateCharacter(char.id, col.id, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, charIdx, colIdx)}
                          className="w-full bg-transparent p-2 rounded outline-none focus:bg-slate-700 border border-transparent focus:border-amber-500/50"
                        >
                          {CONDITIONS.map(cond => (
                            <option key={cond} value={cond} className="bg-slate-800 text-white">{cond}</option>
                          ))}
                        </select>
                      ) : col.type === ColumnType.HP ? (
                        <div className="relative flex items-center gap-1 group/hp">
                          <input
                            type="number"
                            value={char[col.id] ?? ''}
                            onChange={(e) => updateCharacter(char.id, col.id, e.target.value === '' ? undefined : parseInt(e.target.value))}
                            onKeyDown={(e) => handleKeyDown(e, charIdx, colIdx)}
                            className="w-full bg-transparent p-2 rounded outline-none focus:bg-slate-700 border border-transparent focus:border-amber-500/50"
                          />
                          <button
                            onClick={(e) => setActiveHPPopup({ charId: char.id, element: e.currentTarget })}
                            className="absolute right-2 opacity-0 group-hover/hp:opacity-100 w-6 h-6 rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs transition-all shadow-lg"
                          >
                            ±
                          </button>
                          {activeHPPopup?.charId === char.id && (
                            <HPPopup 
                              currentHP={(char.hp as number) || 0}
                              onApply={(amount) => updateCharacter(char.id, 'hp', ((char.hp as number) || 0) + amount)}
                              onClose={() => setActiveHPPopup(null)}
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type={col.type === ColumnType.INTEGER ? 'number' : 'text'}
                          value={char[col.id] ?? ''}
                          onChange={(e) => updateCharacter(char.id, col.id, col.type === ColumnType.INTEGER ? (e.target.value === '' ? undefined : parseInt(e.target.value)) : e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, charIdx, colIdx)}
                          className="w-full bg-transparent p-2 rounded outline-none focus:bg-slate-700 border border-transparent focus:border-amber-500/50"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {characters.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-12 text-center text-slate-500 italic">
                    The dungeon is quiet... add some participants to begin the encounter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showImport && (
        <ImportModal 
          onImport={handleImport} 
          onClose={() => setShowImport(false)} 
        />
      )}

      {/* Footer / Stats summary */}
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>Sorted by Initiative • Use Tab/Enter for Navigation • Powered by Gemini Flash</p>
      </footer>
    </div>
  );
};

export default App;
