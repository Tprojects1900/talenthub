import React, { useEffect, useState, useMemo } from "react";
import TeamsTable from "../components/tables/TeamsTable"; 
import { MainLayout } from '../layouts';
import { Trophy, Star, Loader2, Award } from "lucide-react";
import { useGroups, useTeamStat, useTeams } from "../hooks/useCalls";
import trophy from "../assets/images/trophy.png";

// Composant intermédiaire pour gérer une équipe et récupérer ses statistiques via le hook
const TeamRowLoader = ({ team, index, onStatsLoaded }) => {
  const teamId = team.id || team._id;
  const { teamStats, t_loaded } = useTeamStat(teamId);

  useEffect(() => {
    if (!t_loaded && teamStats) {
      onStatsLoaded(teamId, {
        id: teamId,
        logo: team.logo,
        name: team.nom || team.name,
        matchP: teamStats.mj || 0,
        victoire: teamStats.g || 0,
        nul: teamStats.n || 0,
        defaite: teamStats.p || 0,
        butM: teamStats.bp || 0,
        butE: teamStats.bc || 0,
        diffB: teamStats.db !== undefined ? (teamStats.db > 0 ? `+${teamStats.db}` : `${teamStats.db}`) : "0",
        point: teamStats.pts || 0
      });
    }
  }, [teamStats, t_loaded, teamId]);

  return null;
};

// Sous-composant pour charger et injecter les statistiques dynamiques d'une poule
const PouleTableContainer = ({ group, columns, onPouleDataResolved }) => {
  const [resolvedTeamsMap, setResolvedTeamsMap] = useState({});
  const rawTeams = group.teams || [];

  const handleStatsLoaded = (teamId, completeTeamData) => {
    setResolvedTeamsMap(prev => {
      const updated = { ...prev, [teamId]: completeTeamData };
      onPouleDataResolved(group.id || group._id, Object.values(updated));
      return updated;
    });
  };

  const teamsData = Object.values(resolvedTeamsMap).sort((a, b) => {
    if (b.point !== a.point) return b.point - a.point;
    if (parseInt(b.diffB) !== parseInt(a.diffB)) return parseInt(b.diffB) - parseInt(a.diffB);
    return b.butM - a.butM;
  });

  const loadingStats = teamsData.length < rawTeams.length;

  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-2xl border border-zinc-800/60 shadow-xl">
      {rawTeams.map((team, idx) => (
        <TeamRowLoader 
          key={team.id || team._id || idx} 
          team={team} 
          index={idx} 
          onStatsLoaded={handleStatsLoaded}
        />
      ))}

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rotate-45 rounded-xs"></div>
          <h3 className="font-bold text-lg text-zinc-100 tracking-tight uppercase">
            {group.name || `Poule ${group.id}`}
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
          {rawTeams.length} Équipes
        </span>
      </div>

      <TeamsTable 
        columns={columns} 
        data={loadingStats ? [] : teamsData} 
        loading={loadingStats}
        searchPlaceholder="Rechercher une équipe..."
        searchKey="name"
      />
    </div>
  );
};

const RankingPage = () => {
  const { groups, group_loaded } = useGroups();
  
  // Utilisation stratégique de useTeams pour le classement des buteurs
  const { teams: apiTeams, loading: teamsLoading } = useTeams();
  
  const [activeTab, setActiveTab] = useState("poules");
  const [globalGroupsData, setGlobalGroupsData] = useState({});

  const handlePouleDataResolved = (groupId, data) => {
    setGlobalGroupsData(prev => ({ ...prev, [groupId]: data }));
  };

  // Extraction directe, performante et fiable du TOP 10 depuis useTeams
  const topScorers = useMemo(() => {
    if (!apiTeams || apiTeams.length === 0) return [];

    const allScorers = [];

    apiTeams.forEach(team => {
      // Extraction depuis la structure GraphQL team.stat.listOfScorers
      const scorers = team.stat?.listOfScorers || [];
      scorers.forEach(scorer => {
        allScorers.push({
          id: scorer.id,
          nom: scorer.nom,
          dorsa: scorer.dorsa,
          goals: scorer.goals,
          teamName: team.nom,
          teamLogo: team.logo
        });
      });
    });

    // Tri absolu décroissant par buts marqués et limitation au Top 10
    return allScorers.sort((a, b) => b.goals - a.goals).slice(0, 10);
  }, [apiTeams]);

  // État de chargement global de la page
  const isGlobalDataLoading = useMemo(() => {
    if (group_loaded || teamsLoading) return true;
    if (!groups || groups.length === 0) return false;
    
    // return groups.some(g => {
    //   const resolvedCount = globalGroupsData[g.id || g._id]?.length || 0;
    //   console.log("resolved",resolvedCount,g.teams)
    //   return resolvedCount < (g.teams || []).length;
    // });
  }, [groups, group_loaded, teamsLoading, globalGroupsData]);

  const columnsPoules = [
    {
      key: "rang",
      label: "RANG",
      render: (item, index) => index === 0 
        ? <span className="bg-amber-500/10 text-amber-400 font-mono font-black border border-amber-500/20 px-2 py-0.5 rounded-md text-xs shadow-sm">1er</span>
        : <span className="font-mono font-bold text-zinc-500 text-xs">{index + 1}e</span>
    },
    {
      key: "logo",
      label: (
        <div className="flex flex-col items-center justify-center">
          <Star size={11} className="text-orange-500 mb-0.5" />
          <span className="text-[9px] tracking-wider text-zinc-500 font-bold">LOGO</span>
        </div>
      ),
      render: (item) => (
        <div className="flex justify-center">
          <img src={item.logo || "https://placehold.co/100x100/png?text=FC"} alt="" className="w-7 h-7 object-cover bg-zinc-950 rounded-full border border-zinc-800" />
        </div>
      )
    },
    {
      key: "name",
      label: <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider pl-1">Équipe</span>,
      render: (item) => <span className="font-bold text-zinc-200 uppercase tracking-wide text-xs block truncate max-w-[130px] pl-1">{item.name}</span>
    },
    {
      key: "matchP",
      label: <span className="text-[10px] font-bold text-zinc-500">MJ</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-zinc-300">{item.matchP}</span>
    },
    {
      key: "victoire",
      label: <span className="text-[10px] font-bold text-zinc-500">V</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-emerald-500">{item.victoire}</span>
    },
    {
      key: "nul",
      label: <span className="text-[10px] font-bold text-zinc-500">N</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-zinc-400">{item.nul}</span>
    },
    {
      key: "defaite",
      label: <span className="text-[10px] font-bold text-zinc-500">D</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-red-400">{item.defaite}</span>
    },
    {
      key: "buts",
      label: <span className="text-[10px] font-bold text-zinc-500">BM:BE</span>,
      render: (item) => <span className="text-xs font-mono text-zinc-500">{item.butM}:{item.butE}</span>
    },
    {
      key: "diffB",
      label: <span className="text-[10px] font-bold text-zinc-500">DB</span>,
      render: (item) => {
        const isPositive = String(item.diffB).startsWith('+');
        const isZero = String(item.diffB) === '0';
        return (
          <span className={`text-xs font-black font-mono ${isZero ? 'text-zinc-500' : isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {item.diffB}
          </span>
        );
      }
    },
    {
      key: "point",
      label: <span className="text-[10px] text-orange-400 font-bold tracking-wider">PTS</span>,
      render: (item) => <span className="text-sm font-black font-mono text-zinc-100">{item.point}</span>
    }
  ];

  return (
    <MainLayout>
      {/* HEADER DE LA PAGE */}
      <div className="relative w-full h-[380px] m-0 p-0 overflow-hidden bg-zinc-950">
        <img src={trophy} alt="Tournoi Trophy Header" className="w-full h-full object-cover opacity-40 select-none pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-7xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-xl text-xs font-mono uppercase tracking-widest mb-4">
              <Trophy size={13} className="text-orange-500" /> CLASSEMENT ET STATISTIQUES
            </div>
            <h1 className="text-zinc-100 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              TABLEAUX D'HONNEUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">TOP FOOT</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm lg:text-base font-medium mt-0 max-w-xl leading-relaxed p-8">
              Evolution des poules ou le tableau récapitulatif des meilleurs buteurs.
            </p>
          </div>
        </div>
      </div>

      {/* ELEMENT BLOC DE NAVIGATION (UNDERLINE SWITCH) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-10 pb-24">
        <div className="flex border-b border-zinc-800/80 mb-8 gap-6 font-mono text-xs tracking-widest uppercase">
          <button
            onClick={() => setActiveTab("poules")}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === "poules" ? "text-orange-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            CLASSEMENT PAR POULE
            {activeTab === "poules" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("buteurs")}
            className={`pb-3 font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === "buteurs" ? "text-orange-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            CLASSEMENT BUTEURS
            <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.2 rounded font-sans">TOP 10</span>
            {activeTab === "buteurs" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>

        {isGlobalDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl backdrop-blur-sm gap-4">
            <Loader2 className="animate-spin text-orange-500" size={36} strokeWidth={2.5} />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 animate-pulse">
              Synchronisation des données du tournoi...
            </span>
          </div>
        ) : (
          <>
            {/* INJECTEUR POUR LE CHARGEMENT ET LA SYNCHRONISATION DU CLASSEMENT DES POULES */}
            <div className="hidden">
              {groups && groups.map((group) => (
                <PouleTableContainer 
                  key={group.id || group._id} 
                  group={group} 
                  columns={columnsPoules} 
                  onPouleDataResolved={handlePouleDataResolved}
                />
              ))}
            </div>

            {/* ONGLET 1 : LES POULES */}
            {activeTab === "poules" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {groups && groups.map((group) => {
                  const resolvedData = globalGroupsData[group.id || group._id] || [];
                  return (
                    <div key={group.id || group._id} className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-2xl border border-zinc-800/60 shadow-xl">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-orange-500 rotate-45 rounded-xs"></div>
                          <h3 className="font-bold text-lg text-zinc-100 tracking-tight uppercase">
                            {group.name || `Poule ${group.id}`}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                          {(group.teams || []).length} Équipes
                        </span>
                      </div>
                      <TeamsTable 
                        columns={columnsPoules} 
                        data={resolvedData.sort((a, b) => {
                          if (b.point !== a.point) return b.point - a.point;
                          if (parseInt(b.diffB) !== parseInt(a.diffB)) return parseInt(b.diffB) - parseInt(a.diffB);
                          return b.butM - a.butM;
                        })} 
                        loading={false}
                        searchPlaceholder="Rechercher une équipe..."
                        searchKey="name"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* ONGLET 2 : LE CLASSEMENT DES MEILLEURS BUTEURS */}
            {activeTab === "buteurs" && (
              <div className="bg-zinc-900/40 backdrop-blur-sm p-5 rounded-2xl border border-zinc-800/60 shadow-xl font-mono">
                <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3 mb-4">
                  <Award size={16} className="text-orange-400" />
                  <h3 className="font-bold text-base text-zinc-100 uppercase tracking-tight">SOULIER D'OR — CLASSEMENT DES BUTEURS</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="py-3 px-3">N°</th>
                        <th className="py-3 px-2 text-center">DOSSARD</th>
                        <th className="py-3 px-3">JOUEUR</th>
                        <th className="py-3 px-3">ÉQUIPE</th>
                        <th className="py-3 px-3 text-right">BUTS MARQUÉS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 text-xs">
                      {topScorers.length > 0 ? (
                        topScorers.map((scorer, idx) => (
                          <tr key={scorer.id || idx} className="hover:bg-zinc-950/40 transition-colors">
                            <td className="py-3.5 px-3 font-black text-zinc-400">
                              {idx === 0 ? (
                                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded text-[11px]">01</span>
                              ) : String(idx + 1).padStart(2, '0')}
                            </td>
                            <td className="py-3.5 px-2 text-center font-bold text-zinc-500">
                              #{String(scorer.dorsa || 0).padStart(2, '0')}
                            </td>
                            <td className="py-3.5 px-3 font-black text-zinc-100 uppercase tracking-wide">
                              {scorer.nom}
                            </td>
                            <td className="py-3.5 px-3 text-zinc-400">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={scorer.teamLogo || "https://placehold.co/40x40/000?text=FC"} 
                                  alt="" 
                                  className="w-5 h-5 object-contain bg-zinc-950 rounded-full border border-zinc-850 p-0.5"
                                />
                                <span className="font-bold text-zinc-400 text-xs uppercase truncate max-w-[150px] sm:max-w-none">{scorer.teamName}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-right font-black text-white text-sm">
                              {scorer.goals} <span className="text-xs">⚽</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-[11px] text-zinc-600 uppercase tracking-widest">Aucune réalisation enregistrée pour le moment</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default RankingPage;