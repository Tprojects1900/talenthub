import { useMemo } from "react";
import TopFootHero from "../components/Hero";
import CurrentMatchDetails from "../components/CurrentMatchDetails";
import { useCurrentSchedule, useTeamStat } from "../hooks/useCalls";
import { MainLayout } from "../layouts";
import FootballLoader from "../components/FootBallLoader";
import { formatDateTime } from "../utils/dateUtils";

export default function Home() {
  const { currentSchedule, isLoadingCurrentSchedule } = useCurrentSchedule();

  // 1. Récupération des IDs d'équipes du match courant (si disponible)
  const homeTeamId = currentSchedule?.homeTeam?.id || currentSchedule?.homeTeam?._id;
  const awayTeamId = currentSchedule?.awayTeam?.id || currentSchedule?.awayTeam?._id;

  

  // 2. Appel des hooks de statistiques pour chaque équipe
  // const { teamStats: homeStats, t_loaded: homeLoading } = useTeamStat(homeTeamId);
  // const { teamStats: awayStats, t_loaded: awayLoading } = useTeamStat(awayTeamId);
  const homeStats=currentSchedule?.homeTeam?.stat || {}
  const awayStats=currentSchedule?.awayTeam?.stat || {}
  

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
      date: formatDateTime(match.date,match.time),
      status: match.status,
      pitch: match.pitch,

      homeTeam: {
        name: match.homeTeam?.nom || match.homeTeam?.name,
        logo: match.homeTeam?.logo,
        score: match.events.filter(
          (e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("but")
        ).length,
        // Données enrichies dynamiquement par ton service GraphQL
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
        score: match.events.filter(
          (e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("but")
        ).length,
        // Données enrichies dynamiquement par ton service GraphQL
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

  // Globalisation du chargement (calendrier courant + statistiques des deux équipes)
 // const isGlobalLoading = false;

  return (
    <MainLayout>
      <div className="w-full p-2">
        {!matchData ? (
          <FootballLoader />
        ) : matchData ? (
          <CurrentMatchDetails {...matchData} />
        ) : (
          <TopFootHero />
        )}
      </div>
    </MainLayout>
  );
}