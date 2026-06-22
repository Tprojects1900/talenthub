import { useMemo } from "react";
import CurrentMatchDetails from "../components/CurrentMatchDetails";
import { MainLayout } from "../layouts";
import { useParams, useNavigate } from "react-router-dom";
import { useSingleMatch, useTeamStat } from "../hooks/useCalls";
import FootballLoader from "../components/FootBallLoader";
import { formatDateTime } from "../utils/dateUtils";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function CurrentMatchPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const { match: apiMatch, match_loaded } = useSingleMatch(matchId);

  // 1. Récupération des IDs d'équipes du match courant (si disponible)
  const homeTeamId = apiMatch?.homeTeam?.id || apiMatch?.homeTeam?._id;
  const awayTeamId = apiMatch?.awayTeam?.id || apiMatch?.awayTeam?._id;

  // 2. Appel des hooks de statistiques pour chaque équipe
  const { teamStats: homeStats } = useTeamStat(homeTeamId);
  const { teamStats: awayStats } = useTeamStat(awayTeamId);

  const matchData = useMemo(() => {
    const match = apiMatch;
    
    // Sécurité : Si pas de match ou pas d'événements, on retourne null
    if (!match || !match.events) return null;

    // Extraction et formatage des événements de l'équipe à Domicile (Home)
    const homeEvents = match.events
      .filter((e) => e.teamSide === "home")
      .map((e) => {
        const baseEvent = {
          time: e.time,
          eventType: e.eventType,
          isSubstitution: e.isSubstitution,
          teamLogo: match.homeTeam?.logo,
        };

        if (e.isSubstitution) {
          return {
            ...baseEvent,
            playerIn: {
              name: e.playerIn?.name || e.playerIn?.nom || "",
              dorsa: e.playerIn?.dorsa,
            },
            playerOut: {
              name: e.playerOut?.name || e.playerOut?.nom || "",
              dorsa: e.playerOut?.dorsa,
            },
          };
        }

        return {
          ...baseEvent,
          player: {
            name: e.player?.name || e.player?.nom || "Joueur inconnu",
            dorsa: e.player?.dorsa,
            teamCode: match.homeTeam?.code,
          },
        };
      });

    // Extraction et formatage des événements de l'équipe à l'Extérieur (Away)
    const awayEvents = match.events
      .filter((e) => e.teamSide === "away")
      .map((e) => {
        const baseEvent = {
          time: e.time,
          eventType: e.eventType,
          isSubstitution: e.isSubstitution,
          teamLogo: match.awayTeam?.logo,
        };

        if (e.isSubstitution) {
          return {
            ...baseEvent,
            playerIn: {
              name: e.playerIn?.name || e.playerIn?.nom || "",
              dorsa: e.playerIn?.dorsa,
            },
            playerOut: {
              name: e.playerOut?.name || e.playerOut?.nom || "",
              dorsa: e.playerOut?.dorsa,
            },
          };
        }

        return {
          ...baseEvent,
          player: {
            name: e.player?.name || e.player?.nom || "Joueur inconnu",
            dorsa: e.player?.dorsa,
            teamCode: match.awayTeam?.code,
          },
        };
      });

    return {
      match,
      loading: match_loaded,
      matchType: match.typeConfrontation,
      date: formatDateTime(match.date, match.time),
      status: match.status,
      pitch: match.pitch,

      homeTeam: {
        name: match.homeTeam?.nom || match.homeTeam?.name,
        logo: match.homeTeam?.logo,
        score: (match.events || []).filter(
          (e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("but")
        ).length,
        played: homeStats?.mj || 0,
        points: homeStats?.pts || 0,
        goalsScored: homeStats?.bp || 0,
        goalsConceded: homeStats?.bc || 0,
        topScorer: {
          name: homeStats?.topScorer?.nom || "Aucun",
          goals: homeStats?.topScorer?.goals || 0,
        },
        teamEvents: homeEvents,
      },

      awayTeam: {
        name: match.awayTeam?.nom || match.awayTeam?.name,
        logo: match.awayTeam?.logo,
        score: (match.events || []).filter(
          (e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("but")
        ).length,
        played: awayStats?.mj || 0,
        points: awayStats?.pts || 0,
        goalsScored: awayStats?.bp || 0,
        goalsConceded: awayStats?.bc || 0,
        topScorer: {
          name: awayStats?.topScorer?.nom || "Aucun",
          goals: awayStats?.topScorer?.goals || 0,
        },
        teamEvents: awayEvents,
      },
    };
  }, [apiMatch, homeStats, awayStats, match_loaded]);

  // --- CONTRÔLE DU LOADER POUR LE POLLING ---
  // On affiche le loader de chargement initial uniquement s'il n'y a pas encore d'apiMatch en mémoire
  const isInitialLoading = match_loaded && !apiMatch;

  if (isInitialLoading) {
    return (
      <MainLayout>
        <div className="bg-zinc-950 min-h-[75vh] flex items-center justify-center">
          <FootballLoader />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-zinc-950 min-h-screen text-zinc-100">
        
        {/* PANEL / BANDEAU DE RETOUR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-all duration-200 group shadow-md"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200 text-orange-500" />
            <span>Retour</span>
          </button>
        </div>

        {/* CONDITION DU CONTENU : Si pas de données de match après chargement */}
        {!matchData ? (
          <div className="max-w-md mx-auto mt-12 p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col items-center text-center gap-4 shadow-xl">
            <AlertCircle size={40} className="text-zinc-500" />
            <div>
              <h3 className="text-base font-semibold text-zinc-200">Match introuvable</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Les détails de cette rencontre ne sont plus disponibles ou ont été modifiés.
              </p>
            </div>
          </div>
        ) : (
          /* DETAILS DU MATCH (S'affiche en continu sans clignoter grâce au polling contrôlé) */
          <CurrentMatchDetails {...matchData} />
        )}
        
      </div>
    </MainLayout>
  );
}