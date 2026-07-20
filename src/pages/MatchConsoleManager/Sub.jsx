import React from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';

const SubstitutionConfig = ({ 
  config, 
  closePanel, 
  subsOut = [], 
  subsIn = [], 
  playersList = [], 
  onPlayerClick, 
  onSubmit, 
  loading = false 
}) => {
  const isChangement = config.type === 'Changement';

  // --- Fonctions de Helper (Logique Métier Séparée) ---
  
  // Un joueur est sur le terrain s'il est Titulaire non remplacé OU un Remplaçant entré en jeu
  const isPlayerOnField = (player) => {
    const role = player.role || '';
    const matchStatus = player.matchStatus || '';
    return (matchStatus === 'Titulaire' && role !== 'Remplacé') || role === 'Titulaire (Entré)';
  };

  // Un joueur peut entrer s'il est remplaçant et pas encore entré
  const isPlayerAvailableSub = (player) => {
    const role = player.role || '';
    const matchStatus = player.matchStatus || '';
    return matchStatus === 'Remplaçant' && role !== 'Titulaire (Entré)';
  };

  // --- Filtration des Joueurs ---
  const filteredPlayers = playersList.filter((player) => {
    // 1. Exclure le Staff
    if (player.matchStatus === 'Staff') return false;

    // 2. Si l'événement est un But, seuls les joueurs sur le terrain comptent
    if (config.type?.includes('But') && !isPlayerOnField(player)) {
      return false;
    }

    return true;
  });

  return (
    <div className={`bg-zinc-900 border-2 border-[#FFD700]/40 p-4 rounded-2xl space-y-3 transition-all ${loading ? 'opacity-75' : ''}`}>
      
      {/* En-tête */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <div>
          <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
            Événement : {config.type}
            {loading && <Loader2 size={12} className="animate-spin text-[#FFD700]" />}
          </span>
          <p className="text-[11px] text-zinc-400">
            {isChangement
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

      {/* Résumé des Substitutions */}
      {isChangement && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-850 text-xs">
            {/* Sortants */}
            <div className={`p-2 rounded-lg border ${subsOut.length === 0 ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800'}`}>
              <p className="text-[10px] uppercase font-bold text-zinc-500">🔴 Sortants ({subsOut.length})</p>
              <div className="mt-1 font-bold space-y-0.5 text-red-400">
                {subsOut.length > 0 ? (
                  subsOut.map(p => <div key={p.playerId || p.id}>• [N°{p.dorsa}] {p.nom}</div>)
                ) : (
                  "👉 Sélectionnez un joueur sur le terrain"
                )}
              </div>
            </div>

            {/* Entrants */}
            <div className={`p-2 rounded-lg border ${subsOut.length > 0 && subsIn.length < subsOut.length ? 'border-emerald-500/40 bg-emerald-500/5 animate-pulse' : 'border-zinc-800'} ${subsOut.length === 0 && 'opacity-30'}`}>
              <p className="text-[10px] uppercase font-bold text-zinc-500">🟢 Entrants ({subsIn.length} / {subsOut.length})</p>
              <div className="mt-1 font-bold space-y-0.5 text-emerald-400">
                {subsIn.length > 0 ? (
                  subsIn.map(p => <div key={p.playerId || p.id}>• [N°{p.dorsa}] {p.nom}</div>)
                ) : (
                  "👉 En attente du banc..."
                )}
              </div>
            </div>
          </div>

          {/* Bouton de confirmation */}
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

      {/* Grille de sélection des joueurs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pt-1">
        {filteredPlayers.map((player) => {
          const playerId = player.playerId || player.id;
          const onField = isPlayerOnField(player);
          const availableSub = isPlayerAvailableSub(player);

          const isSelectedOut = subsOut.some(p => (p.playerId || p.id) === playerId);
          const isSelectedIn = subsIn.some(p => (p.playerId || p.id) === playerId);

          // Désactivation dynamique propre :
          // - Un joueur sur le banc est désactivé tant qu'aucun joueur sortant n'est sélectionné
          // - Un joueur déjà "Remplacé" ne peut être sélectionné
          let isDisabled = loading;

          if (isChangement) {
            if (subsOut.length === 0 && !onField) {
              isDisabled = true; // Empêche de choisir un entrant avant un sortant
            } else if (!onField && !availableSub) {
              isDisabled = true; // Le joueur est déjà sorti
            }
          }

          return (
            <button
              key={playerId}
              disabled={isDisabled}
              onClick={() => onPlayerClick(player, config.type)}
              className={`p-2 rounded-xl text-left text-xs border transition-all 
                ${isSelectedOut ? 'bg-red-950/40 border-red-500 text-red-200' : ''} 
                ${isSelectedIn ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : ''} 
                ${!isSelectedOut && !isSelectedIn ? 'bg-zinc-950 border-zinc-850 hover:border-zinc-700' : ''} 
                ${isDisabled ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-950' : ''}`}
            >
              <div className="font-bold truncate">{player.nom}</div>
              <div className="text-[10px] text-zinc-500 flex justify-between mt-0.5">
                <span>N°{player.dorsa}</span>
                <span className={onField ? 'text-blue-400' : 'text-amber-500'}>
                  {player.role || player.matchStatus}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubstitutionConfig;