import React from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/dateUtils'

export const MatchCard = ({ match }) => {
  if (!match) return null;

  // 1. Normalisation et sécurisation des statuts
  const status = String(match.status || '').toLowerCase();
  const isLive = status === 'live' || status === 'half-time' || status === 'en cours';
  const isProgrammed = status === 'programmed' || status === 'bientôt';
  const isCancelled = status === 'cancelled' || status === 'annulé';

  // 2. Récupération sécurisée des données d'équipes
  const home = match.homeTeam || match.teamA;
  const away = match.awayTeam || match.teamB;

  // 3. Récupération des scores réels ou par défaut
  const scoreHome = match.homeScore !== undefined ? match.homeScore : (match.scoreA || 0);
  const scoreAway = match.awayScore !== undefined ? match.awayScore : (match.scoreB || 0);

  const matchId = match._id || match.id;

  // Formatage propre du texte de statut à afficher
  const getStatusConfig = () => {
    if (status === 'live') return { label: 'En direct', style: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (status === 'half-time') return { label: 'Mi-temps', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (status === 'programmed') return { label: 'Programmé', style: 'bg-zinc-800 text-zinc-400 border-zinc-700/50' };
    if (status === 'finished') return { label: 'Terminé', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (status === 'cancelled') return { label: 'Annulé', style: 'bg-zinc-900 text-zinc-600 border-zinc-800 line-through' };
    return { label: match.status || 'N/A', style: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
  };

  const statusConfig = getStatusConfig();

  // Gestion de l'affichage de la date/heure
  const dateDisplay = match.dateInfo || (match.date && match.time ? formatDateTime(match.date, match.time) : '');

  return (
    <Link 
      to={`/${matchId}/details`} 
      className="bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg max-w-md mx-auto w-full transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700/80 group"
    >
      {/* Équipe Home (A) */}
      <div className="flex flex-col items-center flex-1">
        <div className="relative">
          <img
            src={home?.logo || "https://placehold.co/100x100/png?text=FC"}
            alt={home?.nom || home?.name || "Équipe Home"}
            className="w-12 h-12 object-cover rounded-full shadow-md border-2 border-zinc-800/80 group-hover:border-zinc-700 transition-colors bg-zinc-950"
          />
        </div>
        <span className="mt-2.5 font-bold text-zinc-300 text-xs sm:text-sm tracking-wide text-center group-hover:text-zinc-100 transition-colors">
          {home?.code || home?.nom?.substring(0, 3).toUpperCase() || "TEAM A"}
        </span>
      </div>

      {/* Informations centrales */}
      <div className="flex flex-col items-center justify-center flex-1 px-2 text-center">
        {match.groupName && (
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
            {match.groupName}
          </span>
        )}

        {/* Zone des scores ou VS */}
        <div className="flex items-center justify-center space-x-3 text-2xl font-black font-mono tracking-tight text-zinc-100">
          {!isProgrammed && !isCancelled ? (
            <>
              <span className={isLive ? "text-orange-400" : "text-zinc-100"}>{scoreHome}</span>
              <span className="text-zinc-700 font-light text-xl">-</span>
              <span className={isLive ? "text-orange-400" : "text-zinc-100"}>{scoreAway}</span>
            </>
          ) : (
            <span className="text-[10px] font-black text-zinc-500 bg-zinc-800/60 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-widest">
              vs
            </span>
          )}
        </div>

        {/* Badge de Statut */}
        <span
          className={`text-[10px] mt-2.5 px-2.5 py-0.5 rounded-full font-bold border transition-all ${statusConfig.style} ${
            isLive ? 'animate-pulse shadow-sm shadow-red-500/5' : ''
          }`}
        >
          {statusConfig.label}
        </span>
        
        {/* Date et Heure */}
        {dateDisplay && (
          <span className="text-[9px] text-zinc-500 font-medium font-mono mt-2 tracking-wide">
            {dateDisplay}
          </span>
        )}
      </div>

      {/* Équipe Away (B) */}
      <div className="flex flex-col items-center flex-1">
        <div className="relative">
          <img
            src={away?.logo || "https://placehold.co/100x100/png?text=FC"}
            alt={away?.nom || away?.name || "Équipe Versus"}
            className="w-12 h-12 object-cover rounded-full shadow-md border-2 border-zinc-800/80 group-hover:border-zinc-700 transition-colors bg-zinc-950"
          />
        </div>
        <span className="mt-2.5 font-bold text-zinc-300 text-xs sm:text-sm tracking-wide text-center group-hover:text-zinc-100 transition-colors">
          {away?.code || away?.nom?.substring(0, 3).toUpperCase() || "TEAM B"}
        </span>
      </div>
      
    </Link>
  )
}