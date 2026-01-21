
import React, { useState } from 'react';

interface HPPopupProps {
  currentHP: number;
  onApply: (amount: number) => void;
  onClose: () => void;
}

const HPPopup: React.FC<HPPopupProps> = ({ currentHP, onApply, onClose }) => {
  const [isDamage, setIsDamage] = useState(true);
  const [value, setValue] = useState('');

  const handleAction = () => {
    const amount = parseInt(value);
    if (isNaN(amount)) return;
    onApply(isDamage ? -amount : amount);
    onClose();
  };

  return (
    <div className="absolute z-50 mt-2 p-4 rounded-lg shadow-xl border w-48 bg-slate-800 border-slate-700 animate-in fade-in zoom-in duration-200">
      <div className={`text-sm font-bold mb-2 ${isDamage ? 'text-red-400' : 'text-green-400'}`}>
        {isDamage ? 'DEAL DAMAGE' : 'HEAL TARGET'}
      </div>
      <div className="flex flex-col gap-2">
        <input
          autoFocus
          type="number"
          placeholder="Amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:ring-1 focus:ring-amber-500"
          onKeyDown={(e) => e.key === 'Enter' && handleAction()}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsDamage(!isDamage)}
            className={`flex-1 p-2 rounded text-xs font-bold transition-colors ${
              isDamage 
              ? 'bg-green-900 hover:bg-green-800 text-green-100' 
              : 'bg-red-900 hover:bg-red-800 text-red-100'
            }`}
          >
            SWITCH
          </button>
          <button
            onClick={handleAction}
            className="flex-1 p-2 bg-amber-600 hover:bg-amber-500 rounded text-xs font-bold text-white transition-colors"
          >
            APPLY
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-[10px] text-slate-500 hover:text-slate-300 mt-1 uppercase"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HPPopup;
