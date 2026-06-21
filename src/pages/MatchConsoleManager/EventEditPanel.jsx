// ==========================================
// COMPOSANT 1 : MODIFICATION D'UN ÉVÉNEMENT
// ==========================================
import React, { useState } from 'react'; // <-- TRÈS IMPORTANT : Ne pas oublier useState !
import {
  X, Edit3, RotateCcw
} from 'lucide-react';

const EventEditPanel = ({ event, roster, onCancel, onSave }) => {
  const [editedTime, setEditedTime] = useState(event.time);
  const [editedPlayerId, setEditedPlayerId] = useState(event.isSubstitution ? '' : (event.player?.id || ''));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-2 space-y-3 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <span className="text-[11px] uppercase tracking-wider text-[#FFD700] font-bold flex items-center gap-1.5">
          <Edit3 size={12} /> Modifier l'événement
        </span>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white"><X size={14} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase">Minute / Temps</label>
          <input
            type="text"
            value={editedTime}
            onChange={(e) => setEditedTime(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono focus:border-[#FFD700] outline-none"
          />
        </div>

        {!event.isSubstitution && (
          <div>
            <label className="block text-[10px] text-zinc-500 font-bold mb-1 uppercase">Réassigner l'acteur</label>
            <select
              value={editedPlayerId}
              onChange={(e) => setEditedPlayerId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-[#FFD700] outline-none font-semibold"
            >
              <option value="">Sélectionner un joueur</option>
              {roster.filter(p => p.role !== 'Staff' || p.role !== 'Remplacé' || p.role !=="Remplaçant").map(p => (
                <option key={p.playerId || p.id} value={p.playerId || p.id}>[N°{p.dorsa}] {p.nom}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2 pt-2 text-[11px] font-bold uppercase">
        <button
          onClick={() => onSave({ ...event, id: event.id, isDeleted: true })}
          className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <RotateCcw size={13} /> Annuler l'événement
        </button>
        <button
          onClick={() => onSave({ ...event, time: editedTime, playerId: editedPlayerId })}
          className="px-4 py-2 bg-[#FFD700] text-black hover:bg-[#ffe34d] rounded-lg transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default EventEditPanel;