import React, { useState, useEffect } from 'react';

export default function ThresholdModal({ isOpen, onClose, labelName, currentTarget, onSave }) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) setAmount(currentTarget || '');
  }, [isOpen, currentTarget]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Flouté */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Contenu de la Modale */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase">Définir Objectif Frais</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Ajustement du seuil pour : <span className="text-cyan-400 font-semibold">{labelName}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(labelName, amount); onClose(); }} className="mt-4 space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Montant exigé (F CFA)</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                required
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">FCFA</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/40 text-xs font-bold">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl transition-all">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2.5 bg-cyan-400 text-slate-950 hover:bg-cyan-300 rounded-xl shadow-lg shadow-cyan-500/10 transition-all">
              Enregistrer l'objectif
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}