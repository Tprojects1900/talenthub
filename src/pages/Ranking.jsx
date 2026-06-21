import React, { useEffect, useState } from "react";
import TeamsTable from "../components/tables/TeamsTable"; 
import { MainLayout } from '../layouts';
import { Trophy, Star, Loader2 } from "lucide-react";
import { useGroups, useTeamStat } from "../hooks/useCalls";
import trophy from "../assets/images/trophy.png";

// Composant intermédiaire pour gérer une équipe et récupérer ses statistiques via le hook
const TeamRowLoader = ({ team, index, columns, onStatsLoaded }) => {
  const teamId = team.id || team._id;
  // Utilisation correcte du hook au niveau du cycle de vie du composant
  const { teamStats, t_loaded } = useTeamStat(teamId);

  //console.log("teamsta",teamStats)

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

  return null; // Composant purement utilitaire pour la synchronisation des données
};

// Sous-composant pour charger et injecter les statistiques dynamiques d'une poule
const PouleTableContainer = ({ group, columns }) => {
  const [resolvedTeamsMap, setResolvedTeamsMap] = useState({});
  const rawTeams = group.teams || [];

  const handleStatsLoaded = (teamId, completeTeamData) => {
    setResolvedTeamsMap(prev => ({
      ...prev,
      [teamId]: completeTeamData
    }));
  };

  // Convertir la map en tableau et la trier selon les règles officielles du football
  const teamsData = Object.values(resolvedTeamsMap).sort((a, b) => {
    if (b.point !== a.point) return b.point - a.point;
    if (parseInt(b.diffB) !== parseInt(a.diffB)) return parseInt(b.diffB) - parseInt(a.diffB);
    return b.butM - a.butM;
  });

  // Le chargement s'arrête dès que toutes les équipes ont poussé leurs stats dans la map
  const loadingStats = teamsData.length < rawTeams.length;

  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-2xl border border-zinc-800/60 shadow-xl">
      {/* Rendu masqué des chargeurs de hooks pour alimenter la structure de données */}
      {rawTeams.map((team, idx) => (
        <TeamRowLoader 
          key={team.id || team._id || idx} 
          team={team} 
          index={idx} 
          onStatsLoaded={handleStatsLoaded}
        />
      ))}

      {/* Titre de la Poule */}
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

      {/* Tableau dynamique configuré pour le sport */}
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
  // Récupération des groupes/poules réels depuis la base de données
  const { groups, group_loaded } = useGroups();

  const columns = [
    {
      key: "rang",
      label: "RANG",
      render: (item, index) => {
        if (index === 0) {
          return (
            <span className="bg-amber-500/10 text-amber-400 font-mono font-black border border-amber-500/20 px-2 py-0.5 rounded-md text-xs shadow-sm">
              1er
            </span>
          );
        }
        return <span className="font-mono font-bold text-zinc-500 text-xs">{index + 1}e</span>;
      },
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
          <img
            src={item.logo || "https://placehold.co/100x100/png?text=FC"}
            alt={item.name}
            className="w-7 h-7 object-cover bg-zinc-950 rounded-full border border-zinc-800"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: (
        <div className="flex flex-col items-start pl-1">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Équipe</span>
        </div>
      ),
      render: (item) => (
        <div className="text-left pl-1">
          <span className="font-bold text-zinc-200 uppercase tracking-wide text-xs block truncate max-w-[130px] sm:max-w-none group-hover:text-zinc-100">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: "matchP",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Matchs Joués">MJ</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-zinc-300">{item.matchP}</span>
    },
    {
      key: "victoire",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Matchs Gagnés">V</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-emerald-500">{item.victoire}</span>
    },
    {
      key: "nul",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Matchs Nuls">N</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-zinc-400">{item.nul}</span>
    },
    {
      key: "defaite",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Matchs Perdus">D</span>,
      render: (item) => <span className="text-xs font-bold font-mono text-red-400">{item.defaite}</span>
    },
    {
      key: "buts",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Buts Pour : Buts Contre">BM:BE</span>,
      render: (item) => <span className="text-xs font-mono text-zinc-500">{item.butM}:{item.butE}</span>
    },
    {
      key: "diffB",
      label: <span className="text-[10px] font-bold text-zinc-500" title="Différence de buts">DB</span>,
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
      label: <span className="text-[10px] text-orange-400 font-bold tracking-wider" title="Points">PTS</span>,
      render: (item) => <span className="text-sm font-black font-mono text-zinc-100">{item.point}</span>
    },
  ];

  return (
    <MainLayout>
      <div className="relative w-full h-[380px] m-0 p-0 overflow-hidden bg-zinc-950">
        <img
          src={trophy}
          alt="Tournoi Trophy Header"
          className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-7xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-widest mb-4">
              <Trophy size={13} className="text-orange-500" /> Classement Officiel
            </div>
            <h1 className="text-zinc-100 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none">
              LES POULES <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">TOP FOOT</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm lg:text-base font-medium mt-3 max-w-xl leading-relaxed">
              Suivez en direct l'évolution, les points et le goal-average de chaque groupe qualificatif pour la phase finale.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-10 pb-24">
        {!group_loaded ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groups && groups.map((group) => (
              <PouleTableContainer 
                key={group.id || group._id} 
                group={group} 
                columns={columns} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl backdrop-blur-sm gap-4">
            <Loader2 className="animate-spin text-orange-500" size={36} strokeWidth={2.5} />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 animate-pulse">
              Initialisation des classements...
            </span>
          </div>
        )}

        {!group_loaded && (!groups || groups.length === 0) && (
          <div className="text-center py-16 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl text-zinc-500 font-medium italic text-sm">
            Aucun groupe ou poule n'a été configuré pour le moment.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RankingPage;