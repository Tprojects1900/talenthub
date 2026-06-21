import React from 'react';
import {
  X, CheckCircle, Loader2
} from 'lucide-react';

const SubstitutionConfig = ({ 
  config, 
  closePanel, 
  subsOut, 
  subsIn, 
  playersList, 
  onPlayerClick, 
  onSubmit, 
  loading = false 
}) => (
  <div className={`bg-zinc-900 border-2 border-[#FFD700]/40 p-4 rounded-2xl space-y-3 transition-all ${loading ? 'opacity-75' : ''}`}>
    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
      <div>
        <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
          Événement : {config.type}
          {loading && <Loader2 size={12} className="animate-spin text-[#FFD700]" />}
        </span>
        <p className="text-[11px] text-zinc-400">
          {config.type === 'Changement'
            ? "Sélectionnez d'abord le(s) joueur(s) sortant(s), puis le même nombre d'entrant(s)."
            : "Sélectionnez l'acteur de l'action sur le terrain ou cliquez sur X pour annuler."}
        </p>
      </div>
      <button 
        disabled={loading} 
        onClick={closePanel} 
        className="text-zinc-400 hover:text-white bg-zinc-950 p-1.5 rounded-md border border-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X size={14} />
      </button>
    </div>

    {config.type === 'Changement' && (
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-850 text-xs">
          <div className={`p-2 rounded-lg border ${subsOut.length === 0 ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800'}`}>
            <p className="text-[10px] uppercase font-bold text-zinc-500">🔴 Sortants ({subsOut.length})</p>
            <div className="mt-1 font-bold space-y-0.5 text-red-400">
              {subsOut.length > 0 ? subsOut.map(p => <div key={p.playerId || p.id}>• [N°{p.dorsa}] {p.nom}</div>) : "👉 Sélectionnez au moins un titulaire"}
            </div>
          </div>

          <div className={`p-2 rounded-lg border ${subsOut.length > 0 && subsIn.length < subsOut.length ? 'border-emerald-500/40 bg-emerald-500/5 animate-pulse' : 'border-zinc-800'} ${subsOut.length === 0 && 'opacity-30'}`}>
            <p className="text-[10px] uppercase font-bold text-zinc-500">🟢 Entrants ({subsIn.length} / {subsOut.length})</p>
            <div className="mt-1 font-bold space-y-0.5 text-emerald-400">
              {subsIn.length > 0 ? subsIn.map(p => <div key={p.playerId || p.id}>• [N°{p.dorsa}] {p.nom}</div>) : "👉 En attente du banc..."}
            </div>
          </div>
        </div>

        {subsOut.length > 0 && subsOut.length === subsIn.length && (
          <button 
            disabled={loading} 
            onClick={onSubmit} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black p-2 rounded-lg uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 shadow-md disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                <CheckCircle size={14} /> Confirmer la substitution ({subsOut.length} vs {subsIn.length})
              </>
            )}
          </button>
        )}
      </div>
    )}

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pt-1">
      {playersList
        .filter(p => p.matchStatus !== 'Staff' )
        .filter(p => !config.type?.includes('But') || p.role?.includes('Titulaire'))
        .map((player, index) => {
          const isTitulaire = player.role?.includes('Titulaire');
          const playerId = player.playerId || player.id;
          const isSelectedOut = subsOut.some(p => (p.playerId || p.id) === playerId);
          const isSelectedIn = subsIn.some(p => (p.playerId || p.id) === playerId);
          
          // Correction de la condition : Désactivé si c'est un changement inapproprié, OU si globalement en cours de chargement
          const isInvalidSubSelection = config.type === 'Changement' && !isTitulaire && subsOut.length === 0;
          const isButtonDisabled = loading || isInvalidSubSelection;

          return (
            <button
              key={playerId || index}
              disabled={isButtonDisabled}
              onClick={() => onPlayerClick(player, config.type)}
              className={`p-2 rounded-xl text-left text-xs border transition-all 
                ${isSelectedOut ? 'bg-red-950/40 border-red-500 text-red-200' : isSelectedIn ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'} 
                ${isButtonDisabled ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-950' : ''}`}
            >
              <div className="font-bold truncate">{player.nom}</div>
              <div className="text-[10px] text-zinc-500 flex justify-between mt-0.5">
                <span>N°{player.dorsa}</span>
                <span className={isTitulaire ? 'text-blue-400' : 'text-amber-500'}>{player.role || player.matchStatus}</span>
              </div>
            </button>
          );
        })}
    </div>
  </div>
);

export default SubstitutionConfig;