import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

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

// Badge de statut épuré et moderne
function StatusPill({ status }) {
  const s = normalizeStatus(status);
  const isLive = ["live", "en cours", "encours", "ongoing"].includes(s);
  const finished = isFinishedStatus(status);

  if (isLive) {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Live
      </span>
    );
  }

  if (finished) {
    return (
      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/50">
        Terminé
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-emerald-400 border border-emerald-500/10">
      À venir
    </span>
  );
}

// Ligne d'équipe propre
function TeamRow({ team, score, isWinner }) {
  const teamName = team.nom || team.name || "Équipe";
  return (
    <div className="flex items-center justify-between w-full min-w-0 py-0.5">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Container du logo soigné */}
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800/60 p-1 border border-slate-700/20 flex-shrink-0">
          <img
            src={team.logo}
            alt={teamName}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <span className={`text-xs font-semibold truncate transition-colors duration-200 ${
          isWinner ? "text-white font-bold" : "text-slate-300 group-hover:text-slate-200"
        }`}>
          {team.code || teamName}
        </span>
      </div>
      {score !== undefined && score !== null && (
        <span className={`text-xs font-mono font-bold px-1 ${isWinner ? "text-emerald-400" : "text-slate-400"}`}>
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
      className={`group relative flex-shrink-0 w-[240px] snap-start text-left rounded-xl p-3.5 transition-all duration-300 overflow-hidden
        ${
          isCurrent
            ? "bg-slate-900 border border-emerald-500/40 shadow-[0_4px_25px_-5px_rgba(16,185,129,0.2)]"
            : "bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-black/20"
        } select-none`}
    >
      {/* Ligne néon subtile à gauche pour le match à l'affiche */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      )}

      {/* En-tête : Badge "A l'affiche" intégré proprement à gauche si actif, sinon date/heure */}
      <div className="flex items-center justify-between mb-3">
        {isCurrent ? (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20">
            ⭐ À l'affiche
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
            {match.time ? `${match.time}` : match.date}
          </span>
        )}
        <StatusPill status={match.status} />
      </div>

      {/* Équipes */}
      <div className="flex flex-col gap-2 py-1">
        <TeamRow team={home} score={homeScore} isWinner={isHomeWinner} />
        <TeamRow team={away} score={awayScore} isWinner={isAwayWinner} />
      </div>

      {/* Pied de carte discret */}
      {!isFinished && !isLive && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
          <span className="text-slate-500 font-medium">Date du match</span>
          <span className="text-slate-400 font-bold">{match.date}</span>
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
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-1 h-3.5 rounded-full bg-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Tous les matchs</h3>
        </div>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {orderedMatches.map((match) => {
          const matchId = getMatchId(match);
          const isCurrent = matchId === getMatchId(currentSchedule);
          return (
            <MatchCard key={matchId} match={match} isCurrent={isCurrent} onClick={handleCardClick} />
          );
        })}
      </div>
    </div>
  );
}