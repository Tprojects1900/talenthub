import React, { useState } from 'react';
import Loader from './Loader';

export default function MatchLineups({ loading = false, homeRoster, awayRoster, teamA, teamB, codeA, codeB }) {
  const [activeTab, setActiveTab] = useState('home');

  const groupActors = (roster) =>
    (roster?.actors ?? []).reduce(
      (acc, actor) => {
        // La distribution initiale dépend de matchStatus
        if (actor.matchStatus === 'Titulaire') {
          acc.titulaires.push(actor);
        } else {
          acc.remplacants.push(actor);
        }
        return acc;
      },
      { titulaires: [], remplacants: [] }
    );

  const homeTeamData = groupActors(homeRoster);
  const awayTeamData = groupActors(awayRoster);

  function getFirstWord(text = '') {
    return text.trim().split(/\s+/)[0];
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-[#0f1415] text-slate-100 rounded-xl shadow-xl border border-slate-800">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-slate-100">
        Compositions d'Équipes
      </h2>

      {/* Onglets Mobile */}
      <div className="flex md:hidden mb-6 bg-[#000] p-1 rounded-lg border border-slate-700">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === 'home'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {getFirstWord(teamA)}
        </button>
        <button
          onClick={() => setActiveTab('away')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === 'away'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {getFirstWord(teamB)}
        </button>
      </div>

      {/* Grille Principale */}
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Équipe Domicile */}
            <div className={`${activeTab === 'home' ? 'block' : 'hidden md:block'}`}>
              <TeamCard
                code={codeA}
                name={getFirstWord(teamA)}
                team={homeTeamData}
                label="Domicile"
                starterTheme="bg-emerald-950/30 border-emerald-800/40 hover:bg-emerald-900/40 text-emerald-200"
                starterNumColor="text-emerald-400"
                subTheme="bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 text-slate-300 opacity-90"
                subNumColor="text-slate-400"
              />
            </div>

            {/* Équipe Extérieur */}
            <div className={`${activeTab === 'away' ? 'block' : 'hidden md:block'}`}>
              <TeamCard
                code={codeB}
                name={getFirstWord(teamB)}
                team={awayTeamData}
                label="Extérieur"
                starterTheme="bg-green-950/30 border-green-800/40 hover:bg-green-900/40 text-green-200"
                starterNumColor="text-green-400"
                subTheme="bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 text-slate-300 opacity-90"
                subNumColor="text-slate-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({ name, team, label, starterTheme, starterNumColor, subTheme, subNumColor, code }) {
  return (
    <div className="space-y-6">
      {/* En-tête Équipe */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700 text-[10px]">
            {code}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">{name}</h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
          </div>
        </div>
      </div>

      {/* Titulaires */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Titulaires</span>
          <span className="text-slate-500">{team.titulaires.length}</span>
        </h4>
        <div className="space-y-1.5">
          {team.titulaires.map((player) => (
            <PlayerRow
              key={player.playerId}
              player={player}
              themeClass={starterTheme}
              numColor={starterNumColor}
            />
          ))}
        </div>
      </div>

      {/* Remplaçants */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between pt-2">
          <span>Remplaçants</span>
          <span className="text-slate-500">{team.remplacants.length}</span>
        </h4>
        <div className="space-y-1.5">
          {team.remplacants.map((player) => (
            <PlayerRow
              key={player.playerId}
              player={player}
              themeClass={subTheme}
              numColor={subNumColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ player, themeClass, numColor }) {
  // Détection des statuts basés sur actor.role
  const isSubbedOut = player?.role === 'Remplacé';
  const isSubbedIn = player?.role === 'Titulaire (Entré)';

  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-lg transition-all border ${
        player?.isCaptain
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-100 shadow-sm'
          : themeClass
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Numéro */}
        <span
          className={`w-6 text-center font-mono text-sm font-semibold ${
            player?.isCaptain ? 'text-amber-400' : numColor
          }`}
        >
          {player.dorsa}
        </span>

        {/* Nom du joueur */}
        <span
          className={`text-sm ${
            player.isCaptain ? 'font-bold text-amber-200' : 'font-medium'
          } ${isSubbedOut ? 'line-through opacity-60' : ''}`}
        >
          {player?.nom}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Signe Entrée en jeu (Flèche verte vers le haut) */}
        {isSubbedIn && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-1.5 py-0.5 rounded font-semibold">
            ▲ Entré
          </span>
        )}

        {/* Signe Sortie du terrain (Flèche rouge vers le bas) */}
        {isSubbedOut && (
          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] px-1.5 py-0.5 rounded font-semibold">
            ▼ Sorti
          </span>
        )}

        {/* Brassard du Capitaine */}
        {player?.isCaptain && (
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded shadow-sm">
            <span>C</span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold hidden sm:inline">
              Capitaine
            </span>
          </div>
        )}
      </div>
    </div>
  );
}