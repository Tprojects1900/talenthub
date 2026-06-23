import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTeams } from '../hooks/useCalls'; 
import { MainLayout } from '../layouts';

const PlayerDetails = () => {
  const { playerId } = useParams();
  const { teams, loading } = useTeams();

  // Chercher le joueur à l'intérieur de la structure "members" de chaque équipe
  let currentPlayer = null;
  let playerTeam = null;

  if (teams) {
    for (const team of teams) {
      const found = team.members?.find(m => (m.id || m._id) === playerId);
      if (found) {
        currentPlayer = found;
        playerTeam = team;
        break;
      }
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (!currentPlayer) return <p>Joueur introuvable</p>;

  return (
    <>
      {/* 1. SEULEMENT les balises SEO ici (Pas de Layout à l'intérieur) */}
      <Helmet>
        {/* Titre de la page centré sur le joueur et son club */}
        <title>{`${currentPlayer.nom} (${playerTeam?.nom || 'Sans Club'}) - Fiche Joueur | TOP FOOT`}</title>
        
        {/* Description unique pour Google */}
        <meta name="description" content={`Profil, statistiques et détails de ${currentPlayer.nom}, évoluant au poste de ${currentPlayer.type || 'Joueur'} au sein de l'équipe ${playerTeam?.nom || ''}.`} />
        
        {/* Mots-clés dédiés à la recherche de ce joueur */}
        <meta name="keywords" content={`joueur ${currentPlayer.nom}, effectif ${playerTeam?.nom}, statistiques ${currentPlayer.nom}, ${currentPlayer.type}, tournoi de football Lomé`} />

        {/* Balises Open Graph pour afficher le visage/logo du joueur sur WhatsApp / Réseaux */}
        <meta property="og:title" content={`${currentPlayer.nom} - Effectif ${playerTeam?.nom}`} />
        <meta property="og:description" content={`Regardez la fiche technique complète de ${currentPlayer.nom} sur la plateforme TOP FOOT.`} />
        <meta property="og:image" content={currentPlayer.logo || playerTeam?.logo || 'https://talent-hubapp.com/og-image.png'} />
        <meta property="og:url" content={`https://talent-hubapp.com/#/players/${playerId}/details`} />
      </Helmet>

      {/* 2. LE LAYOUT enveloppe toute la partie visuelle de l'interface */}
      <MainLayout>
        <div className="p-6 text-zinc-200">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
            <img 
              src={currentPlayer.logo || playerTeam?.logo} 
              alt={currentPlayer.nom} 
              className="w-12 h-12 rounded-full object-cover bg-zinc-950 p-1 border border-zinc-800"
            />
            <div>
              <h2 className="text-base font-bold text-white">{currentPlayer.nom}</h2>
              <p className="text-xs text-emerald-400 font-mono uppercase tracking-wider">{currentPlayer.type || 'Membre'}</p>
              {playerTeam && (
                <p className="text-[11px] text-zinc-500 mt-0.5">Équipe : <span className="text-zinc-400 font-bold">{playerTeam.nom}</span></p>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default PlayerDetails;