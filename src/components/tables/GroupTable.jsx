import React from 'react'

export const GroupTable = ({ group }) => {
  if (!group) return null;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      {/* Titre du Groupe */}
      <h3 className="font-bold text-base text-zinc-100 mb-4 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
        <span className="tracking-tight">{group.name}</span>
        <span className="text-[10px] bg-orange-500/10 text-orange-400 font-mono px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-wider">
          Poule
        </span>
      </h3>

      {/* Liste des Équipes */}
      <div className="space-y-1.5">
        {group.teams?.slice(0, 4).map((team, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2.5 hover:bg-zinc-800/40 rounded-xl transition-all duration-200 group border border-transparent hover:border-zinc-800/30"
          >
            <div className="flex items-center space-x-3">
              {/* Index / Position */}
              <span className="text-xs font-black text-zinc-500 w-4 font-mono group-hover:text-orange-400 transition-colors">
                {index + 1}
              </span>

              {/* Logo de l'équipe */}
              <img
                src={team.logo || "https://placehold.co/100x100/png?text=FC"}
                alt={team.nom || team.name}
                className="w-7 h-7 object-cover rounded-full shadow-sm border border-zinc-800 bg-zinc-900"
              />

              {/* Nom de l'équipe */}
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors">
                {team.nom || team.name || "Équipe sans nom"}
              </span>
            </div>

            {/* Quartier / Provenance de l'équipe */}
            {(team.quartier) && (
              <span className="text-xs text-zinc-500 font-medium tracking-wide bg-zinc-900/80 px-2 py-0.5 rounded-md border border-zinc-800/40">
                {team.quartier}
              </span>
            )}
          </div>
        ))}

        {(!group.teams || group.teams.length === 0) && (
          <p className="text-xs text-zinc-600 text-center py-4 font-medium italic">
            Aucune équipe ajoutée à cette poule
          </p>
        )}
      </div>
    </div>
  )
}