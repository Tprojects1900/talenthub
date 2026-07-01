import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ProgrammedGame from "../../components/Game/Programmed";
import FinishedGame from "../../components/Game/Finished";
import { useSingleMatch, useTeamStat } from "../../hooks/useCalls";
import FootballLoader from "../../components/FootBallLoader";
import { formatDateTime } from "../../utils/dateUtils";
import { AlertCircle, ArrowLeft } from "lucide-react"; // Import d'icônes utilitaires

export default function MatchAffichePage() {
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
            venue: match.pitch,
            broadcast: '5eme Edition',
            stage: match?.typeConfrontation,
            isLive: match?.status == 'live',
            time: match?.time,

            homeTeam: {
                name: match.homeTeam?.nom || match.homeTeam?.name,
                logo: match.homeTeam?.logo,
                location: match.homeTeam?.quartier || "",
                scorers: (match.events || [])
                    .filter((e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("but"))
                    .map((e) => ({
                        name: e.playerName || e.player?.name || "Buteur",
                        dorsa: e.player?.dorsa,
                        minute: e.time ? `${e.time}'` : ""
                    })),
                stats:
                {
                    yellowCards: (match?.events || []).filter((e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("carton jaune")).length,
                    redCards: (match?.events || []).filter((e) => e.teamSide === "home" && e.eventType?.toLowerCase().includes("carton rouge")).length,
                },
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
                location: match.awayTeam?.quartier || "",
                scorers: (match.events || [])
                    .filter((e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("but"))
                    .map((e) => ({
                        name: e.playerName || e.player?.name || "Buteur",
                        dorsa: e.player?.dorsa,
                        minute: e.time ? `${e.time}'` : ""
                    })),
                score: (match.events || []).filter(
                    (e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("but")
                ).length,
                stats: {
                    yellowCards: (match?.events || []).filter((e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("carton jaune")).length,
                    redCards: (match?.events || []).filter((e) => e.teamSide === "away" && e.eventType?.toLowerCase().includes("carton rouge")).length,
                },
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
    const isInitialLoading = match_loaded && !apiMatch;

    if (isInitialLoading) {
        return (
            <AdminLayout pageTitle="Chargement...">
                <div className="bg-zinc-950 min-h-[75vh] flex items-center justify-center rounded-xl">
                    <FootballLoader />
                </div>
            </AdminLayout>
        );
    }

    // --- SÉCURITÉ : AUCUN MATCH TROUVÉ ---
    if (!apiMatch || !matchData) {
        return (
            <AdminLayout pageTitle="Affiche non trouvée">
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40 rounded-2xl border border-zinc-800 backdrop-blur-md max-w-xl mx-auto my-8 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Aucun match trouvé</h3>
                        <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                            Les données de cette rencontre sont introuvables ou le match n'existe pas.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-2 flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 text-zinc-300 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retourner aux matchs</span>
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Affiches Début / Fin de match">
            <div className="m-0 p-0 w-full grid grid-cols-1 md:grid-cols-2 scrollbar-hide">
                <ProgrammedGame game={matchData} />
                <FinishedGame game={matchData} />
            </div>
        </AdminLayout>
    );
}