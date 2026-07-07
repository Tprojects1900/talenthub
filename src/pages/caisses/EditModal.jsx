import React, { useState, useEffect } from 'react';

export default function EditSumModal({ isOpen, onClose, teamName, label, onSave,loading=false }) {
  const [newSum, setNewSum] = useState('');
  const [newTarget, setNewTarget] = useState('');

  useEffect(() => {
    if (isOpen && label) {
      setNewSum(label.todaySum || '');
      setNewTarget(label.targetThreshold || '');
    }
  }, [isOpen, label]);

  if (!isOpen || !label) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-black text-white tracking-wide uppercase">Ajuster la Ligne de Caisse</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{teamName} • <span className="text-cyan-400 font-semibold">{label.name}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Historique visuel */}
        <div className="mt-4 p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 text-[11px]">
          <span className="text-slate-500 font-bold uppercase block tracking-wider">Bascule de Registre :</span>
          <div className="flex justify-between font-mono text-slate-400">
            <span>Ancien montant ➡️ Somme Initiale :</span>
            <span className="text-amber-400 font-bold">{parseFloat(label.todaySum).toLocaleString()} F</span>
          </div>
        </div>

        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            onSave(label.id, newSum, newTarget); 
            onClose(); 
          }} 
          className="mt-4 space-y-4"
        >
          {/* Modification du Seuil spécifique */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Seuil exigé pour cette équipe (F CFA)</label>
            <input 
              type="number" 
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="Ex: 5000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-slate-700"
              required
            />
          </div>

          {/* Saisie de la nouvelle somme actuelle */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1.5 tracking-wider">Nouvelle Somme Actuelle (Date du jour)</label>
            <input 
              type="number" 
              value={newSum}
              onChange={(e) => setNewSum(e.target.value)}
              placeholder="Saisir le montant cumulé"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-400/50"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/40 text-xs font-bold">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl">
              Annuler
            </button>
            <button type="submit" 
            disabled={loading} 
            className="px-4 py-2.5 bg-cyan-400 text-slate-950 hover:bg-cyan-300 rounded-xl shadow-lg">
              {loading ? 'Enregistrement...' : 'Enregistrer les ajustements'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}