import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Flame, Calendar, Award } from "lucide-react";

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

function sortMatches(schedules, currentSchedule) {
  if (!Array.isArray(schedules) || !currentSchedule) return [];

  const currentId = getMatchId(currentSchedule);
  const currentTs = getMatchTimestamp(currentSchedule);

  const others = schedules.filter((m) => getMatchId(m) !== currentId);

  const upcoming = others.filter((m) => !isFinishedStatus(m.status));
  const finished = others.filter((m) => isFinishedStatus(m.status));

  const byProximity = (a, b) =>
    Math.abs(getMatchTimestamp(a) - currentTs) - Math.abs(getMatchTimestamp(b) - currentTs);

  upcoming.sort(byProximity);
  finished.sort(byProximity);

  return [currentSchedule, ...upcoming, ...finished];
}

// Badge de statut ultra épuré (Style Apple Sports)
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
      <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
        TERMINÉ
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
      À VENIR
    </span>
  );
}

// Ligne d'équipe propre
function TeamRow({ team, score, isWinner }) {
  const teamName = team.nom || team.name || "Équipe";
  return (
    <div className="flex items-center justify-between w-full min-w-0 py-1">
      <div className="flex items-center gap-3 min-w-0">
        {/* Container Logo de l'équipe */}
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-950 p-1 border border-zinc-800/60 flex-shrink-0 shadow-inner">
          {team.logo ? (
            <img
              src={team.logo}
              alt={teamName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <Shield size={14} className="text-zinc-600" />
          )}
        </div>
        <span className={`text-xs font-bold truncate tracking-wide transition-colors duration-200 ${
          isWinner ? "text-white font-extrabold" : "text-zinc-300 group-hover:text-zinc-100"
        }`}>
          {team.code || teamName}
        </span>
      </div>
      
      {score !== undefined && score !== null && (
        <span className={`text-sm font-mono font-black px-1.5 py-0.5 rounded ${
          isWinner ? "text-emerald-400 bg-emerald-500/5" : "text-zinc-500"
        }`}>
          {score}
        </span>
      )}
    </div>
  );
}

function MatchCard({ match, isCurrent, onClick }) {
  const home = match.homeTeam || {};
  const away = match.awayTeam || {};
  const matchId = getMatchId(match);

  const status = normalizeStatus(match.status);
  const isFinished = isFinishedStatus(match.status);
  const isLive = ["live", "en cours", "encours", "ongoing"].includes(status);
  
  const homeScore = match.homeScore;
  const awayScore = match.awayScore;
  
  const isHomeWinner = isFinished && Number(homeScore) > Number(awayScore);
  const isAwayWinner = isFinished && Number(awayScore) > Number(homeScore);

  return (
    <button
      type="button"
      onClick={() => onClick(matchId)}
      className={`group relative flex-shrink-0 w-[260px] snap-start text-left rounded-2xl p-4 transition-all duration-300 overflow-hidden
        ${
          isCurrent
            ? "bg-[#121214] border border-[#FFD700]/30 shadow-[0_8px_30px_-5px_rgba(255,215,0,0.1)]"
            : "bg-[#0f0f11]/80 border border-zinc-900 hover:border-zinc-800 hover:bg-[#121214] hover:shadow-xl"
        } select-none`}
    >
      {/* Barre néon subtile à gauche pour le match sélectionné */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.4)]" />
      )}

      {/* En-tête de carte */}
      <div className="flex items-center justify-between mb-3.5">
        {isCurrent ? (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-[#FFD700] text-zinc-950 shadow">
            ★ À l'affiche
          </span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
            {match.time ? `${match.time}` : match.date}
          </span>
        )}
        <StatusPill status={match.status} />
      </div>

      {/* Les Équipes & Scores */}
      <div className="flex flex-col gap-1.5 py-1">
        <TeamRow team={home} score={homeScore} isWinner={isHomeWinner} />
        <TeamRow team={away} score={awayScore} isWinner={isAwayWinner} />
      </div>

      {/* Pied de carte */}
      {!isFinished && !isLive && (
        <div className="mt-3 pt-2.5 border-t border-zinc-900/80 flex items-center justify-between text-[10px]">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">Date du match</span>
          <span className="text-zinc-400 font-bold">{match.date}</span>
        </div>
      )}
    </button>
  );
}

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
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200">Tous les matchs</h3>
        </div>
      </div>

      {/* Conteneur défilant horizontal moderne et invisible au scroll standard */}
      <div
        className="flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory
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