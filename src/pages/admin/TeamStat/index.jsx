import { useState, useMemo } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { useTeams } from "../../../hooks/useCalls";
import { 
  Users, 
  Search, 
  Award, 
  Layers, 
  TrendingUp, 
  User, 
  ShieldAlert 
} from "lucide-react";

// ==========================================
// BESOIN 1 : COMPOSANT SELECTION EQUIPE
// ==========================================
const TeamsSelect = ({ teams = [], selectedId, onSelect, loading }) => {
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    return teams.filter(t => t.nom.toLowerCase().includes(search.toLowerCase()));
  }, [teams, search]);

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-3">
        <Users size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">SÉLECTION_ENTITÉ</span>
      </div>
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input
          type="text"
          placeholder="Rechercher une équipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-zinc-900 pl-9 pr-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono"
        />
      </div>
      {loading ? (
        <div className="text-center py-4 text-xs text-zinc-600 animate-pulse uppercase tracking-widest">CHARGEMENT_REGISTRES...</div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-black scrollbar-hide">
          {filteredTeams.map((team) => {
            const isSelected = team.id === selectedId;
            return (
              <button
                key={team.id}
                onClick={() => onSelect(team.id)}
                className={`flex items-center gap-2.5 px-4 py-2 border shrink-0 transition-colors ${
                  isSelected 
                    ? "bg-white border-white text-black font-black" 
                    : "bg-black border-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                <img src={team.logo} alt="" className="w-7 h-7 object-contain filter invert-0 rounded-full" onError={(e) => e.target.src = "https://placehold.co/40x40/000?text=FC"} />
                <span className="text-xs uppercase tracking-wider">{team.nom}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// BESOIN 2 : COURBE DE RATIO ET CERCLES DE CARTONS
// ==========================================
const CardRatioIndicator = ({ yellowCount, redCount }) => {
  const total = yellowCount + redCount;
  const redPercentage = total > 0 ? (redCount / total) * 100 : 0;

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-5 font-mono">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-6">
        <ShieldAlert size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">DISCIPLINE_RATIO</span>
      </div>
      <div className="flex items-center justify-around gap-4 mb-6">
        {/* Cercle Carton Jaune */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-yellow-500 flex items-center justify-center bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <span className="text-xl font-black text-yellow-500">{yellowCount}</span>
          </div>
          <span className="text-[9px] font-bold text-zinc-500 tracking-wider">JAUNES</span>
        </div>
        {/* Cercle Carton Rouge */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full border-2 border-red-600 flex items-center justify-center bg-red-600/5 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
            <span className="text-xl font-black text-red-600">{redCount}</span>
          </div>
          <span className="text-[9px] font-bold text-zinc-500 tracking-wider">ROUGES</span>
        </div>
      </div>
      {/* Simulation graphique linéaire de la courbe/barre de ratio */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] font-bold text-zinc-600">
          <span>INDICE_DISTRIBUTION</span>
          <span>{total > 0 ? `${Math.round(100 - redPercentage)}% JAUNES` : "0%"}</span>
        </div>
        <div className="w-full h-1 bg-yellow-500 overflow-hidden flex">
          <div style={{ width: `${redPercentage}%` }} className="h-full bg-red-600 transition-all duration-500"></div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BESOIN 3 & 4 & 5 : COMPOSANT MUTABLE DE TABLEAU DE JOUEURS
// ==========================================
const PlayersTable = ({ title, icon: Icon, players = [], cardType }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-3">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{title}</span>
        <span className="ml-auto text-[9px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 border border-zinc-850">REG: {players.length}</span>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
              <th className="py-2">N°</th>
              <th className="py-2">Nom du joueur</th>
              <th className="py-2 text-right">{cardType === "goals" ? "BUTS" : cardType === "yellow" ? "JAUNES" : "ROUGES"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/40 text-xs">
            {players.length > 0 ? (
              players.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-2 text-zinc-600 font-bold">#{String(p.dorsa || idx + 1).padStart(2, '0')}</td>
                  <td className="py-2 font-bold text-zinc-300 uppercase truncate max-w-[140px]">{p.nom}</td>
                  <td className="py-2 text-right font-black">
                    {cardType === "goals" ? (
                      <span className="text-white">{p.goals} ⚽</span>
                    ) : cardType === "yellow" ? (
                      <span className="text-yellow-500">+{p.count}</span>
                    ) : (
                      <span className="text-red-600">+{p.count}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-[10px] text-zinc-700 uppercase tracking-wide">AUCUNE_DONNÉE_ENREGISTRÉE</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// BESOIN 6 : COMPOSANT DE STATISTIQUES EFFECTIF GLOBAL / BUTEURS
// ==========================================
const ScorerEfficiency = ({ effectiveCount, scorersCount }) => {
  const percentage = effectiveCount > 0 ? (scorersCount / effectiveCount) * 100 : 0;

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
        <TrendingUp size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">EFFICACITÉ_EFFECTIF</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 border border-zinc-900 bg-black/40">
          <div className="text-[9px] font-bold text-zinc-600 uppercase">Effectif Total</div>
          <div className="text-xl font-black text-white">{effectiveCount}</div>
        </div>
        <div className="p-3 border border-zinc-900 bg-black/40">
          <div className="text-[9px] font-bold text-zinc-600 uppercase">Buteurs Actifs</div>
          <div className="text-xl font-black text-zinc-400">{scorersCount}</div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-bold text-zinc-600">
          <span>RATIO_IMPLICATION_BUTS</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 border border-zinc-850">
          <div style={{ width: `${percentage}%` }} className="h-full bg-white transition-all duration-500"></div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// BESOIN 7 : COMPOSANT AFFICHAGE TOP SCORER
// ==========================================
const TopScorerWidget = ({ topScorer }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono relative overflow-hidden group">
      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 text-zinc-900 pointer-events-none group-hover:text-zinc-850/60 transition-colors">
        <Award size={90} strokeWidth={1} />
      </div>
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
        <Award size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">MEILLEUR_BUTEUR</span>
      </div>
      {topScorer && topScorer.goals > 0 ? (
        <div className="space-y-2">
          <div className="text-[9px] text-zinc-600 font-bold uppercase">UNIT_PRODUCTION_MAX_⚽</div>
          <div className="text-lg font-black text-white uppercase tracking-tight truncate pr-16">{topScorer.nom}</div>
          <div className="flex items-center gap-4 pt-1">
            <div>
              <span className="text-[9px] block text-zinc-600 font-bold">DOSSARD</span>
              <span className="text-xs font-bold text-zinc-400">#{String(topScorer.dorsa || 0).padStart(2, '0')}</span>
            </div>
            <div className="border-l border-zinc-900 pl-4">
              <span className="text-[9px] block text-zinc-600 font-bold">RÉALISATIONS</span>
              <span className="text-base font-black text-white">{topScorer.goals} BUTS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-[10px] text-zinc-700 uppercase tracking-wide">AUCUN_BUTEUR_DÉTECTÉ</div>
      )}
    </div>
  );
};

// ==========================================
// COMPOSANT COMPLÉMENTAIRE : STATISTIQUES GLOBALES DE L'ÉQUIPE (MATCHS)
// ==========================================
const TeamOverviewStats = ({ stat }) => {
  const meta = [
    { label: "MJ", val: stat?.mj || 0, color: "text-zinc-400" },
    { label: "PTS", val: stat?.pts || 0, color: "text-white font-black" },
    { label: "V", val: stat?.g || 0, color: "text-zinc-300" },
    { label: "N", val: stat?.n || 0, color: "text-zinc-400" },
    { label: "P", val: stat?.p || 0, color: "text-zinc-500" },
    { label: "BM", val: stat?.bp || 0, color: "text-zinc-300" },
    { label: "BE", val: stat?.bc || 0, color: "text-zinc-500" },
    { label: "DB", val: stat?.db >= 0 ? `+${stat?.db}` : stat?.db || 0, color: "text-zinc-400" },
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-4 font-mono">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
        <Layers size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">VUE_ENSEMBLE_PERFORMANCES</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {meta.map((m, i) => (
          <div key={i} className="bg-black border border-zinc-900 p-2.5 text-center">
            <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider mb-0.5">{m.label}</div>
            <div className={`text-sm font-bold ${m.color}`}>{m.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPOSANT PRINCIPAL : CORPS DE PAGE
// ==========================================
export default function TeamStatPage() {
  const { teams, loading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // Définir l'équipe sélectionnée par défaut une fois les données chargées
  useMemo(() => {
    if (teams && teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Extraction chirurgicale des métriques et traitement de données de l'entité choisie
  const currentTeam = useMemo(() => {
    return teams?.find(t => t.id === selectedTeamId) || null;
  }, [teams, selectedTeamId]);

  // Agrégation des joueurs ayant reçu des cartons (compte par joueur)
  const processedCards = useMemo(() => {
    if (!currentTeam?.stat) return { yellow: [], red: [] };

    const getAggregatedPlayers = (cardsArray) => {
      const map = {};
      cardsArray?.forEach(c => {
        if (!c.player) return;
        if (!map[c.player.id]) {
          map[c.player.id] = { ...c.player, count: 0 };
        }
        map[c.player.id].count += 1;
      });
      return Object.values(map).sort((a, b) => b.count - a.count);
    };

    return {
      yellow: getAggregatedPlayers(currentTeam.stat.yellowCards),
      red: getAggregatedPlayers(currentTeam.stat.redCards)
    };
  }, [currentTeam]);

  // Extraction de la liste des buteurs ordonnée
  const scorersList = useMemo(() => {
    return currentTeam?.stat?.listOfScorers ? [...currentTeam.stat.listOfScorers].sort((a, b) => b.goals - a.goals) : [];
  }, [currentTeam]);

  return (
    <AdminLayout pageTitle={"STATISTIQUES"}>
      <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-4 text-zinc-200">
        
        {/* SÉLECTEUR D'ÉQUIPES HAUT DE PAGE */}
        <TeamsSelect 
          teams={teams} 
          selectedId={selectedTeamId} 
          onSelect={setSelectedTeamId} 
          loading={loading} 
        />

        {currentTeam ? (
          /* GRILLE MAÎTRESSE TOTALEMENT RESPONSIVE */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* COLONNE GAUCHE : VUE D'ENSEMBLE & INDICATEURS GRAPHIQUES */}
            <div className="lg:col-span-1 space-y-6">
              <TeamOverviewStats stat={currentTeam.stat} />
              
              <CardRatioIndicator 
                yellowCount={currentTeam.stat?.yellowCards?.length || 0} 
                redCount={currentTeam.stat?.redCards?.length || 0} 
              />

              <TopScorerWidget topScorer={currentTeam.stat?.topScorer} />

              <ScorerEfficiency 
                effectiveCount={currentTeam.members?.length || 0} 
                scorersCount={scorersList.length || 0} 
              />
            </div>

            {/* COLONNE DROITE / CENTRALE : LES TABLEAUX DE CLASSEMENT INDIVIDUELS */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Besoin 5 : Tableau des Buteurs */}
              <div className="sm:col-span-2">
                <PlayersTable 
                  title="REGISTRE_BUTEURS_ACTIFS" 
                  icon={Award} 
                  players={scorersList} 
                  cardType="goals" 
                />
              </div>

              {/* Besoin 3 : Tableau des Cartons Rouges */}
              <div className="col-span-1">
                <PlayersTable 
                  title="EXPULSIONS_CARTONS_ROUGES" 
                  icon={User} 
                  players={processedCards.red} 
                  cardType="red" 
                />
              </div>

              {/* Besoin 4 : Tableau des Cartons Jaunes */}
              <div className="col-span-1">
                <PlayersTable 
                  title="AVERTISSEMENTS_CARTONS_JAUNES" 
                  icon={User} 
                  players={processedCards.yellow} 
                  cardType="yellow" 
                />
              </div>
            </div>

          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 border border-dashed border-zinc-900 text-zinc-600 font-mono text-xs uppercase tracking-widest">
              INITIALISEZ_UNE_ENTITÉ_POUR_AFFICHER_LES_DONNÉES
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
}