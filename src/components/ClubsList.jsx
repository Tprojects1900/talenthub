import React, { useState } from 'react';
// Assure-toi d'importer tes icônes et composants de notifications ici :
import { Users, Shield, MapPin, User, Trash2, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';

// 1. Sous-composant isolé pour gérer l'affichage/pagination propre à chaque club
const TeamCard = ({ team, index, handleConfirmP, handleOpenEdit }) => {
  // Changement ici : On utilise une string "5" par défaut ou "all"
  const [displayLimit, setDisplayLimit] = useState("5");

  const membres = team.membres || [];
  // Gestion de la découpe en fonction de la valeur du select
  const membresAffiches = displayLimit === "5" ? membres.slice(0, 5) : membres;

  return (
    <div key={team.id || index} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl space-y-3">

      {/* En-tête de la carte */}
      <div className="flex items-center justify-between border-b border-zinc-850/60 pb-2">
        <div className="flex items-center gap-3">
          {team.logo ? (
            <img src={team.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-zinc-800" />
          ) : (
            <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600">
              <Shield size={20} />
            </div>
          )}
          <div>
            <h4 className="text-xs font-black text-zinc-100">{team.nom}</h4>
            <p className="text-[10px] text-zinc-400 flex items-center gap-0.5 font-medium">
              <MapPin size={9} className="text-[#FFD700]" /> {team.quartier}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-[9px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-zinc-400 hover:text-white transition-colors"
            onClick={async () => {
              const inviteLink = `${window.location.origin}/${team.id}/ajouter-joueur-staff`;

              try {
                await navigator.clipboard.writeText(inviteLink);
                toast.success("Lien copié !");
              } catch (error) {
                console.error("Erreur lors de la copie :", error);
                toast.error("Impossible de copier le lien");
              }
            }}
          >
            Copier
          </button>
          <span className="text-[9px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-zinc-400">
            {membres.length} Membres
          </span>
        </div>
      </div>

      {team.slogan && (
        <p className="text-[10px] italic text-zinc-500 font-medium px-1">"{team.slogan}"</p>
      )}

      {/* Remplacement des boutons par un sélecteur dynamique (affiché uniquement si > 5 membres) */}
      {membres.length > 5 && (
        <div className="flex justify-end px-1">
          <select
            value={displayLimit}
            onChange={(e) => setDisplayLimit(e.target.value)}
            className="bg-zinc-950 text-zinc-400 text-[9px] font-mono font-bold px-2 py-1 rounded-lg border border-zinc-850/80 focus:outline-none focus:border-zinc-700 cursor-pointer transition-colors"
          >
            <option value="5" className="bg-zinc-950 text-zinc-300">
              Afficher : 5 par défaut
            </option>
            <option value="all" className="bg-zinc-950 text-zinc-300">
              Afficher : Tout ({membres.length})
            </option>
          </select>
        </div>
      )}

      {/* Liste des effectifs */}
      <div className="space-y-1 pt-1">
        {membres.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic px-1">Aucun membre dans cette équipe.</p>
        ) : (
          membresAffiches.map((m, mIndex) => (
            <div key={m.id || mIndex} className="bg-zinc-950 border border-zinc-900/60 px-2 py-1.5 rounded-xl flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-2">
                {m.logo ? (
                  <img src={m.logo} alt="member" className="w-5 h-5 rounded object-cover" />
                ) : (
                  <User size={12} className="text-zinc-600" />
                )}
                <span className="font-semibold text-zinc-300">{m.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-1 rounded text-[8px] font-black uppercase tracking-wide ${m.type === 'joueur' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {m.type}
                </span>
                <button
                  type="button" 
                  onClick={() => handleConfirmP(team.id, m.id)}
                  className="text-zinc-700 hover:text-red-400 p-0.5 transition-colors"
                >
                  <Trash2 size={11} className='text-red-500' />
                </button>

                <button
                  type="button" 
                  onClick={() => handleOpenEdit("player", m)}
                  className="text-zinc-700 hover:text-blue-400 p-0.5 transition-colors"
                >
                  <Pencil size={11} className='text-blue-500' />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

{/* 2. Composant Principal (Liste des Clubs & Effectifs) */}
export default function ClubsList({ teams, handleConfirmP, handleOpenEdit }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
        <Users size={14} /> Liste des Clubs & Effectifs
      </h3>

      {teams.length === 0 ? (
        <div className="text-center py-10 text-zinc-600 text-xs font-medium border border-dashed border-zinc-850 rounded-2xl">
          Aucune équipe créée pour le moment. Utilisez le formulaire de gauche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <TeamCard 
              key={team.id || index}
              team={team}
              index={index}
              handleConfirmP={handleConfirmP}
              handleOpenEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}