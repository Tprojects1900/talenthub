import { useMemo } from "react";
import TopFootHero from "../components/Hero";
import CurrentMatchDetails from "../components/CurrentMatchDetails";
import { useCurrentSchedule } from "../hooks/useCalls";
import { MainLayout } from "../layouts";
import FootballLoader from "../components/FootBallLoader";
import { formatDateTime } from "../utils/dateUtils";

export default function Home() {
  // Ajoutez ou vérifiez si votre hook expose une propriété comme 'data' ou s'il permet de savoir
  // si c'est le tout premier chargement. Généralement avec SWR ou React Query, on utilise 'isLoading' vs 'isValidating'.
  const { currentSchedule, isLoadingCurrentSchedule } = useCurrentSchedule();

  const homeStats = currentSchedule?.homeTeam?.stat || {};
  const awayStats = currentSchedule?.awayTeam?.stat || {};

  const matchData = useMemo(() => {
    const match = currentSchedule;
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
  }, [currentSchedule, homeStats, awayStats]);

  // --- CONTRÔLE DU LOADER POUR LE POLLING ---
  // On affiche le loader UNIQUEMENT si l'API charge ET qu'on n'a encore aucune donnée en mémoire.
  const isInitialLoading = isLoadingCurrentSchedule && !currentSchedule;

  return (
    <MainLayout>
      <div className="w-full p-2">
        {isInitialLoading ? (
          /* S'affiche uniquement au tout premier chargement de la page */
          <FootballLoader />
        ) : matchData ? (
          /* Si on a des données (neuves ou issues du polling précédent), on affiche le match */
          <CurrentMatchDetails {...matchData} />
        ) : (
          /* Si le chargement est fini (ou en cours de polling) mais qu'il n'y a STRICTEMENT aucun match */
          <TopFootHero />
        )}
      </div>
    </MainLayout>
  );
}