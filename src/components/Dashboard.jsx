import React, { useState, useEffect, useMemo } from 'react';
import { Users, Shield, CalendarCheck2, Activity, ArrowUpRight, Award, BarChart3, TrendingUp, CheckCircle2, ChevronDown } from 'lucide-react';
import Loader from './Loader';
import { useSchedules, useGroups, useTeams } from '../hooks/useCalls';
import { formatDateTime } from '../utils/dateUtils';
const Dashboard = () => {
  const { schedules, loaded_schedule } = useSchedules();
  const { groups, group_loaded } = useGroups();
  const { teams, loading } = useTeams();

  const [matchCount, setMatchCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [pouleCount, setPouleCount] = useState(0);
  
  // État pour la limite d'affichage des matchs [4, 10, 25]
  const [matchLimit, setMatchLimit] = useState(4);

  useEffect(() => {
    if (!loaded_schedule && !group_loaded && !loading) {
      setMatchCount(schedules?.length || 0);
      setPouleCount(groups?.length || 0);
      setTeamCount(teams?.length || 0);
    }
  }, [schedules, groups, teams, loaded_schedule, group_loaded, loading]);

  const isGlobalLoading = loaded_schedule || loading || group_loaded;

  // ==========================================
  // --- ANALYSE ET LOGIQUE DES STATISTIQUES ---
  // ==========================================
  const matchStats = useMemo(() => {
    const list = schedules || [];
    const total = list.length;
    const played = list.filter(m => m.status === 'finished').length;
    const live = list.filter(m => m.status === 'live').length;
    const programmed = list.filter(m => m.status === 'programmed' || !m.status).length;
    const percentagePlayed = total > 0 ? Math.round((played / total) * 100) : 0;

    return { total, played, live, programmed, percentagePlayed };
  }, [schedules]);

  const goalsStats = useMemo(() => {
    const list = teams || [];
    let totalGoals = 0;
    let topScoringTeam = { name: 'Aucune', goals: 0 };

    list.forEach(team => {
      const bp = team.stat?.bp || team.bp || 0;
      totalGoals += bp;
      if (bp > topScoringTeam.goals) {
        topScoringTeam = { name: team.nom || team.name, goals: bp };
      }
    });

    return { totalGoals, topScoringTeam };
  }, [teams]);

  // ==========================================
  // --- FILTRAGE ET TRI DES PROCHAINS MATCHS ---
  // ==========================================
  const filteredAndSortedMatches = useMemo(() => {
    const list = schedules || [];
    
    // 1. Exclure 'finished' et 'cancelled'
    const validMatches = list.filter(m => m.status !== 'finished' && m.status !== 'cancelled');

    // 2. Classer par ordre de priorité : live -> half-time -> programmed
    const statusOrder = { 'live': 1, 'half-time': 2, 'programmed': 3 };

    return validMatches.sort((a, b) => {
      const orderA = statusOrder[a.status] || 3;
      const orderB = statusOrder[b.status] || 3;
      return orderA - orderB;
    }).slice(0, matchLimit); // Appliquer la limite dynamique (4, 10 ou 25)
  }, [schedules, matchLimit]);

  // Métriques globales du haut
  const metrics = [
    { label: 'Équipes Engagées', value: teamCount, details: `Réparties sur ${pouleCount} poules`, icon: Users, color: 'text-orange-400' },
    { label: 'Matchs Planifiés', value: matchStats.total, details: `${matchStats.percentagePlayed}% de matchs joués`, icon: CalendarCheck2, color: 'text-amber-500' },
    { label: 'Buts Inscrits', value: goalsStats.totalGoals, details: `Top : ${goalsStats.topScoringTeam.name} (${goalsStats.topScoringTeam.goals}⚽)`, icon: Award, color: 'text-emerald-400' },
  ];

  // Variables pour le graphique circulaire SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchStats.percentagePlayed / 100) * circumference;

  // Rendu des badges de statut
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-2 py-1 bg-red-950/60 border border-red-800 text-[9px] font-black uppercase text-red-400 rounded-lg flex items-center gap-1 animate-pulse">
            <span className="w-1 h-1 rounded-full bg-red-500"></span> En Direct
          </span>
        );
      case 'half-time':
        return (
          <span className="px-2 py-1 bg-amber-950/60 border border-amber-800 text-[9px] font-black uppercase text-amber-400 rounded-lg flex items-center gap-1">
            ⏱️ Mi-temps
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-bold uppercase text-zinc-400 rounded-lg">
            Programmé
          </span>
        );
    }
  };

  return (
    <>
      {isGlobalLoading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* HEADER DE BIENVENUE ÉPURÉ */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-850 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Console d'analyse générale 👋</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Le tournoi se déroule parfaitement. Voici un état rapide des opérations et statistiques globales.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[10px] font-mono font-bold uppercase text-zinc-400 rounded-xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Données Synchronisées
              </span>
            </div>
          </div>

          {/* SECTION 1 : PRINCIPALES MÉTRIQUES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-colors">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-zinc-100 font-mono">{stat.value}</p>
                    <p className="text-[10px] font-medium text-zinc-400 truncate max-w-[180px]">{stat.details}</p>
                  </div>
                  <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-850 ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2 : COMPOSANTS D'ANALYSE & DIAGRAMMES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* DIAGRAMME CIRCULAIRE DE PROGRESSION DES MATCHS */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
                <BarChart3 size={14} className="text-orange-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">Avancement Global</h3>
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} className="stroke-zinc-800" strokeWidth="10" fill="transparent" />
                    <circle cx="50" cy="50" r={radius} className="stroke-orange-500 transition-all duration-1000 ease-out" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white font-mono">{matchStats.percentagePlayed}%</span>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Joués</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Terminés</span>
                    <span className="font-bold text-zinc-200">{matchStats.played}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>En Direct</span>
                    <span className="font-bold text-zinc-200">{matchStats.live}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-700"></span>À Venir</span>
                    <span className="font-bold text-zinc-200">{matchStats.programmed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRES D'EFFICACITÉ LOGISTIQUE DES POULES */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
                <TrendingUp size={14} className="text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">Densité et Logistique</h3>
              </div>

              <div className="space-y-3 py-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase font-bold text-zinc-400">
                    <span>Groupes / Poules</span>
                    <span className="text-zinc-200">{pouleCount} configurés</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((pouleCount / 4) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase font-bold text-zinc-400">
                    <span>Moyenne Équipes / Poule</span>
                    <span className="text-zinc-200">{pouleCount > 0 ? (teamCount / pouleCount).toFixed(1) : 0} éq.</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((teamCount / 16) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PERFORMANCES OFFENSIVES */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-850 pb-2.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">Rendement Offensif</h3>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 tracking-wider">Meilleure Attaque</span>
                  <p className="text-xs font-black text-zinc-200 uppercase truncate max-w-[140px]">{goalsStats.topScoringTeam.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 font-mono">{goalsStats.topScoringTeam.goals}</span>
                  <span className="text-[10px] text-zinc-500 font-bold font-mono ml-0.5">BUTS</span>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 3 : DOUBLE GRILLE AVEC FILTRAGE AVANCÉ DES MATCHS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BLOC : PROCHAINES PROGRAMMATIONS AMÉLIORÉES */}
            <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <CalendarCheck2 size={14} className="text-amber-500" /> Prochaines Programmations
                </h3>
                
                {/* SÉLECTEUR DE PAGINATION DYNAMIQUE [4, 10, 25] */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Afficher:</span>
                  <div className="relative inline-block text-left">
                    <select 
                      value={matchLimit}
                      onChange={(e) => setMatchLimit(Number(e.target.value))}
                      className="appearance-none bg-zinc-950 border border-zinc-850 px-2.5 py-1 text-[11px] font-black text-zinc-300 rounded-lg pr-6 cursor-pointer focus:outline-none focus:border-zinc-700 font-mono"
                    >
                      <option value={4}>4</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* LISTE DES MATCHS FILTRÉS (SANS FINISHED / CANCELLED) */}
              <div className="space-y-2">
                {filteredAndSortedMatches.length > 0 ? (
                  filteredAndSortedMatches.map((m, idx) => {
                    const matchId = m.id || m._id || idx;
                    return (
                      <div 
                        key={matchId} 
                        onClick={() => window.location.href = `/${matchId}/details`}
                        className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-xs hover:border-zinc-800 cursor-pointer group transition-all"
                      >
                        <div className="space-y-1 flex-1 pr-4">
                          <div className="font-bold text-zinc-200 group-hover:text-amber-500 transition-colors uppercase tracking-wide flex items-center gap-2">
                            <span>{m.homeTeam?.nom || m.homeTeam?.name || 'À déterminer'}</span> 
                            <span className="text-[10px] text-zinc-500 font-normal font-mono lowercase">vs</span> 
                            <span>{m.awayTeam?.nom || m.awayTeam?.name || 'À déterminer'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {m.groupName || m.poule || 'Phase de poules'}
                            </span>
                            {renderStatusBadge(m.status)}
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-center items-end shrink-0">
                          {/* <div className="font-bold text-zinc-300 font-mono">{m.date || 'Date à venir'}</div> */}
                          <div className="text-[10px] text-emerald-400 font-semibold font-mono flex items-center gap-0.5">
                            { formatDateTime(m.date,m.time) || '15:00'} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-[10px] uppercase font-mono tracking-widest text-zinc-600">
                    Aucun match en cours ou programmé
                  </div>
                )}
              </div>
            </div>

            {/* FLUX D'ACTIVITÉS SYSTÈME */}
            <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" /> Flux d'Activité Récent
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>

              <div className="space-y-3 pl-2 border-l border-zinc-850 ml-1">
                <div className="relative text-xs">
                  <div className="absolute -left-[13px] top-1 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <p className="font-bold text-zinc-300">Synchronisation automatique effectuée</p>
                  <p className="text-[10px] text-zinc-500 font-mono">À l'instant • système en temps réel</p>
                </div>
                <div className="relative text-xs">
                  <div className="absolute -left-[13px] top-1 w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <p className="font-bold text-zinc-400">Structures de données prêtes</p>
                  <p className="text-[10px] text-zinc-500 font-mono">16 équipes indexées avec succès</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Dashboard;