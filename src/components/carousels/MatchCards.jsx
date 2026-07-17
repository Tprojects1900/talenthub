import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

// --- Utilitaires de statut ---
const FINISHED_STATUSES = ["finished", "termine", "terminé", "fini", "ended"];
const PROGRAMMED_STATUSES = ["programmed", "programme", "programmé", "scheduled", "upcoming", "planifie", "planifié"];
const normalizeStatus = (status) => (status || "").toString().trim().toLowerCase();
const isFinishedStatus = (status) => FINISHED_STATUSES.includes(normalizeStatus(status));
export const isProgrammedStatus = (status) => PROGRAMMED_STATUSES.includes(normalizeStatus(status));

const getMatchId = (match) => match?._id || match?.id;

const getMatchTimestamp = (match) => {
  if (!match?.date) return 0;
  const time = match.time || "00:00";
  const ts = new Date(`${match.date}T${time}`).getTime();
  return Number.isNaN(ts) ? 0 : ts;
};

// --- Logique de tri ---
function sortMatches(schedules, currentSchedule) {
  if (!Array.isArray(schedules) || !currentSchedule) return [];
  const currentId = getMatchId(currentSchedule);
  const currentTs = getMatchTimestamp(currentSchedule);
  const others = schedules.filter((m) => getMatchId(m) !== currentId);
  const upcoming = others.filter((m) => !isFinishedStatus(m.status));
  const finished = others.filter((m) => isFinishedStatus(m.status));
  const byProximity = (a, b) => Math.abs(getMatchTimestamp(a) - currentTs) - Math.abs(getMatchTimestamp(b) - currentTs);
  upcoming.sort(byProximity);
  finished.sort(byProximity);
  return [currentSchedule, ...upcoming, ...finished];
}

// =========================================
// --- COMPOSANTS DE DESIGN ---
// =========================================

// 1. Badge de statut
function StatusPill({ status }) {
  const s = normalizeStatus(status);
  const isLive = ["live", "en cours", "encours", "ongoing"].includes(s);
  const finished = isFinishedStatus(status);

  if (isLive) {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        DIRECT
      </span>
    );
  }

  if (finished) {
    return (
      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-zinc-900 text-zinc-500 border border-zinc-800">
        FIN
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
      À VENIR
    </span>
  );
}

// 2. Logo d'équipe
function TeamLogo({ team, teamName, size = "w-7 h-7" }) {
  return (
    <div className={`flex items-center justify-center ${size} rounded-full bg-zinc-950 p-1 border border-zinc-800/60 flex-shrink-0 shadow-inner`}>
      {team.logo ? (
        <img
          src={team.logo}
          alt={teamName}
          className="w-full h-full object-contain"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <Shield size={14} className="text-zinc-700" />
      )}
    </div>
  );
}

// 3. Layout pour MATCH TERMINÉ (Affiche fièrement le score final)
function FinishedMatchDisplay({ home, away, homeScore, awayScore }) {
  const isHomeWinner = Number(homeScore) > Number(awayScore);
  const isAwayWinner = Number(awayScore) > Number(homeScore);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center justify-center gap-3 w-full">
        {/* Équipe Domicile */}
        <div className={`flex items-center gap-2.5 justify-end flex-1 min-w-0 ${isAwayWinner ? 'opacity-40' : ''}`}>
          <span className="text-xs font-bold truncate tracking-wide text-white">
            {home.code || home.nom || home.name || "DOM"}
          </span>
          <TeamLogo team={home} teamName={home.nom} />
        </div>

        {/* SCORE CENTRAL IMPACTANT */}
        <div className="flex items-center gap-1 font-mono font-black text-3xl tracking-tighter tabular-nums px-3 py-1 bg-zinc-950 rounded-xl border border-zinc-800/50 shadow-inner">
          <span className={isHomeWinner ? "text-white" : "text-zinc-400"}>{homeScore}</span>
          <span className="text-zinc-600 text-2xl">:</span>
          <span className={isAwayWinner ? "text-white" : "text-zinc-400"}>{awayScore}</span>
        </div>

        {/* Équipe Extérieur */}
        <div className={`flex items-center gap-2.5 flex-1 min-w-0 ${isHomeWinner ? 'opacity-40' : ''}`}>
          <TeamLogo team={away} teamName={away.nom} />
          <span className="text-xs font-bold truncate tracking-wide text-white">
            {away.code || away.nom || away.name || "EXT"}
          </span>
        </div>
      </div>
    </div>
  );
}

// 4. Layout pour MATCH À VENIR ou DIRECT (Sans score, ultra-épuré)
function ActiveMatchDisplay({ team }) {
  const teamName = team.nom || team.name || "Équipe";
  return (
    <div className="flex items-center justify-between w-full min-w-0 py-1.5">
      <div className="flex items-center gap-3 min-w-0">
        <TeamLogo team={team} teamName={teamName} size="w-8 h-8" />
        <span className="text-sm font-bold truncate tracking-wide text-zinc-100 group-hover:text-white">
          {teamName}
        </span>
      </div>
    </div>
  );
}


// --- MatchCard principale ---
function MatchCard({ match, isCurrent, onClick }) {
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};
  const matchId = getMatchId(match);

  const status = normalizeStatus(match.status);
  const isFinished = isFinishedStatus(match.status);
  const isLive = ["live", "en cours", "encours", "ongoing"].includes(status);
  
  // Calcul du score (Uniquement si le match est terminé pour économiser les perfs au rendu des autres cartes)
  const homeScore = isFinished 
    ? (match.events || []).filter((e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("but")).length 
    : 0;
    
  const awayScore = isFinished 
    ? (match.events || []).filter((e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("but")).length 
    : 0;

  return (
    <button
      type="button"
      onClick={() => onClick(matchId)}
      className={`group relative flex-shrink-0 w-[290px] snap-start text-left rounded-2xl p-4 transition-all duration-300 overflow-hidden
        ${
          isCurrent
            ? "bg-[#101012] border border-[#FFD700]/30 shadow-[0_8px_30px_-5px_rgba(255,215,0,0.15)]"
            : "bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-700 hover:bg-[#101012]"
        } select-none`}
    >
      {/* Barre néon dorée sur le match actif */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.5)]" />
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        {isCurrent ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[#FFD700] text-zinc-950">
            ★ À l'affiche
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
            {match.time ? `${match.time}` : match.date}
          </span>
        )}
        <StatusPill status={match.status} />
      </div>

      {/* Zone Contenu */}
      <div className="py-1">
        {isFinished ? (
          // Match Terminé -> Score mis en avant au centre
          <FinishedMatchDisplay 
            home={home} 
            away={away} 
            homeScore={homeScore} 
            awayScore={awayScore} 
          />
        ) : (
          // Match Non-terminé -> Pas de score, juste les équipes alignées proprement
          <div className="flex flex-col gap-1">
            <ActiveMatchDisplay team={home} />
            <ActiveMatchDisplay team={away} />
          </div>
        )}
      </div>

      {/* Pied de carte (affiché uniquement pour les matchs non-terminés) */}
      {!isFinished && !isLive && (
        <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px]">
          <span className="text-zinc-600 font-bold uppercase tracking-wider">Date</span>
          <span className="text-zinc-500 font-bold">{match.date}</span>
        </div>
      )}
    </button>
  );
}

// --- MatchesCarousel ---
export default function MatchesCarousel({ schedules, currentSchedule }) {
  const navigate = useNavigate();

  const shouldShow = isProgrammedStatus(currentSchedule?.status);

  const orderedMatches = useMemo(
    () => sortMatches(schedules, currentSchedule),
    [schedules, currentSchedule]
  );

  if (!shouldShow || orderedMatches.length < 2) return null;

  const handleCardClick = (matchId) => {
    if (!matchId) return;
    navigate(`/${matchId}/details`);
  };

  return (
    <div className="w-full mt-8">
      {/* En-tête stylisé */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-4 rounded-full bg-[#FFD700]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200">Tous les matchs</h3>
        </div>
      </div>

      {/* Conteneur défilant */}
      <div
        className="flex gap-4 overflow-x-auto pb-5 px-2 snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {orderedMatches.map((match) => {
          const matchId = getMatchId(match);
          const isCurrent = matchId === getMatchId(currentSchedule);
          return (
            <MatchCard 
              key={matchId} 
              match={match} 
              isCurrent={isCurrent} 
              onClick={handleCardClick} 
            />
          );
        })}
      </div>
    </div>
  );
}