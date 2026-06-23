import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTeams } from '../hooks/useCalls';
import { MainLayout } from '../layouts';
const TeamDetails = () => {
  const { id } = useParams();
  const { teams, loading } = useTeams();

  // Trouver l'équipe correspondante dans la liste
  const team = teams?.find(t => (t.id || t._id) === id);

  if (loading) return <p>Chargement...</p>;
  if (!team) return <p>Équipe introuvable</p>;

  // Extraire proprement les noms des joueurs pour enrichir les mots-clés
  const playerNames = team.members?.map(m => m.nom).join(', ') || '';

  return (
    <>
      <Helmet>
        {/* Titre unique de l'onglet et de Google */}
        <title>{`${team.nom} - Profil Officiel | TOP FOOT 2026`}</title>
        
        {/* Descriptif pour le résumé Google */}
        <meta name="description" content={`Découvrez l'effectif, les statistiques de match et l'actualité de l'équipe ${team.nom} (${team.quartier}). ${team.slogan || ''}`} />
        
        {/* Vos Mots-clés (Keywords) personnalisés */}
        <meta name="keywords" content={`TOP FOOT, Valeur Foot, ${team.nom}, ${team.quartier}, effectif ${team.nom}, joueurs, ${playerNames}`} />

        {/* Configuration Open Graph (Partage Facebook / WhatsApp / Telegram) */}
        <meta property="og:title" content={`${team.nom} — Club de Football Officiel`} />
        <meta property="og:description" content={`Suivez les performances de ${team.nom} basés à ${team.quartier} dans le tournoi TOP FOOT.`} />
        <meta property="og:image" content={team.logo || 'https://talent-hubapp.com/og-image.png'} />
        <meta property="og:url" content={`https://talent-hubapp.com/#/matches/${id}/details`} />
      </Helmet>

      {/* Reste de votre interface de l'équipe */}
      <MainLayout>
      <div className="p-6">
        <div className="flex items-center gap-4">
          {team.logo && <img src={team.logo} alt={team.nom} className="w-16 h-16 object-contain" />}
          <div>
            <h1 className="text-xl font-black text-white font-mono">{team.nom}</h1>
            <p className="text-xs text-zinc-400">{team.quartier} — <i>{team.slogan}</i></p>
          </div>
        </div>
      </div>
      </MainLayout>
    </>
  );
};

export default TeamDetails;