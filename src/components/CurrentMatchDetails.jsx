import React, { useState, useMemo } from 'react';
import { useSingleRoster } from '../hooks/useCalls';
import {
    Tv, Clock, Award, Shield,
    ChevronRight, Activity, TrendingUp, Goal,
    RefreshCcw, Square, CircleAlert, Map, Users, Info
} from 'lucide-react';

import { useScreen } from '../context/ScreenContext';
import MatchStatusBadge from './MatchStatusBadge';
import MatchTimer from './MatchTimer';
import Loader from "./Loader"
import MatchLineups from './LineUps';

const CurrentMatchDetails = ({
    homeTeam = {},
    awayTeam = {},
    matchType,
    date,
    status,
    pitch,
    match,
    loading
}) => {
    const { isMobile } = useScreen();
    const [activeTab, setActiveTab] = useState('live');
    const timer = match?.timer || "00:00";
    const globaltime = match?.eachHalf * 2;
    const matchId= match?.id || match?._id;
    const homeTeamId=homeTeam?.id || homeTeam?._id;
    const awayTeamId=awayTeam?.id || awayTeam?._id;

    const {roster:home_roster,loaded_roster:home_rostered}=useSingleRoster(matchId,homeTeamId);
    const {roster:away_roster,loaded_roster:away_rostered}=useSingleRoster(matchId,awayTeamId);
    const isRostered = home_rostered || away_rostered;
    const teamAName=homeTeam?.nom || homeTeam?.name;
    const teamBName=awayTeam?.nom || awayTeam?.name;
    const codeA=homeTeam?.code;
    const codeB=awayTeam?.code;

    // console.log("timer", timer, match)

    let totalSeconds = 0;

    // 1. Extraction propre des secondes selon le format (Normal ou Additionnel)
    if (timer.includes("+")) {
        // Cas "35:00 + 01:24"
        const [partNormal, partExtra] = timer.split("+").map(str => str.trim());

        const [nMins, nSecs] = partNormal.split(":").map(Number);
        const [eMins, eSecs] = partExtra.split(":").map(Number);

        const normalSecs = (!isNaN(nMins) && !isNaN(nSecs)) ? (nMins * 60 + nSecs) : 0;
        const extraSecs = (!isNaN(eMins) && !isNaN(eSecs)) ? (eMins * 60 + eSecs) : 0;

        totalSeconds = normalSecs + extraSecs;
    } else if (timer.includes(":")) {
        // Cas classique "24:12"
        const [minutes, seconds] = timer.split(":").map(Number);
        if (!isNaN(minutes) && !isNaN(seconds)) {
            totalSeconds = minutes * 60 + seconds;
        }
    }

    // 2. Calcul du temps total réglementaire du match EN SECONDES (ex: 35 min * 2 * 60 = 4200 secondes)
    const eachHalfMinutes = match?.eachHalf || 45;
    const totalMatchSeconds = eachHalfMinutes * 2 * 60;

    // 3. Calcul du pourcentage (plafonné à 100% max pour ne pas dépasser de la barre)
    const percentage = Math.min((totalSeconds / totalMatchSeconds) * 100, 100);

    // console.log("percentage", percentage)

    // Sécurisation de la liste des événements triés par temps
    const allEvents = useMemo(() => {
        const events = [
            ...(homeTeam.teamEvents || []).map(e => ({ ...e, side: 'home' })),
            ...(awayTeam.teamEvents || []).map(e => ({ ...e, side: 'away' }))
        ];
        return events.sort((a, b) => {
            const timeA = (a.time || "").toString();
            const timeB = (b.time || "").toString();
            return timeA.localeCompare(timeB, undefined, { numeric: true });
        });
    }, [homeTeam.teamEvents, awayTeam.teamEvents]);

    const renderEventIcon = (type = "") => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes("but") || lowerType.includes("goal")) {
            return <Goal className="w-4 h-4 text-emerald-400 animate-bounce" />;
        }
        if (lowerType.includes("jaune") || lowerType.includes("yellow")) {
            return <Square className="w-3.5 h-4 text-amber-400 fill-amber-400 rounded-sm" strokeWidth={1} />;
        }
        if (lowerType.includes("rouge") || lowerType.includes("red")) {
            return <Square className="w-3.5 h-4 text-rose-500 fill-rose-500 rounded-sm" strokeWidth={1} />;
        }
        if (lowerType.includes("changement") || lowerType.includes("sub")) {
            return <RefreshCcw className="w-4 h-4 text-sky-400" strokeWidth={2.5} />;
        }
        return <CircleAlert className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />;
    };

    const isLive = status === 'live' || status === 'En cours';
    const isProg = status === "programmed" || status === "programmé";

    const statusText = (status) => {
        switch (status?.toLowerCase()) {
            case "programmed":
                return "Match programmé";

            case "live":
                return "Match en direct";

            case "half-time":
                return "Mi-temps";

            case "finished":
                return "Match terminé";

            default:
                return "Statut indisponible";
        }
    };

    // Extraction des buteurs pour affichage direct sous le score (comme sur la maquette UEFA)
    const goalsEvents = useMemo(() => {
        return allEvents.filter(e => e.eventType?.toLowerCase().includes("but"));
    }, [allEvents]);

    return (
        loading ? (
            <Loader />
        ) :
            (
                <div className="w-full max-w-7xl mx-auto bg-[#0d0d0e] text-zinc-100 rounded-2xl border border-zinc-800/60 shadow-2xl overflow-hidden font-sans">

                    {/* EN-TÊTE ÉPURÉ */}
                    <div className="bg-[#121214]/80 backdrop-blur-md px-6 py-4 border-b border-zinc-800/60
                flex flex-wrap sm:flex-nowrap
                sm:justify-between items-center">

                        <div className="w-1/2 flex justify-center sm:w-auto sm:justify-start">
                            <span className="text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border border-[#FFD700]/20">
                                {matchType || 'Match'}
                            </span>
                        </div>

                        <div className="w-1/2 flex justify-center sm:w-auto">
                            <span className="text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                                <Clock size={12} className="text-zinc-500" />
                                {date}
                            </span>
                        </div>

                        <div className="w-full mt-2 flex justify-center sm:w-auto sm:mt-0">
                            <MatchStatusBadge status={status} />
                        </div>

                    </div>

                    {/* VUE PRINCIPALE DESKTOP / MOBILE */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-900">

                        {/* BLOC GAUCHE : LE JEU (SCOREBOARD & TERRAIN ISOMÉTRIQUE) - Prend 7 colonnes sur 12 en Desktop */}
                        <div className="lg:col-span-7 bg-gradient-to-b from-[#121214] to-[#0d0d0e] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">

                            {/* Halo lumineux dynamique vert/jaune en fond */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                            {/* Tableau d'affichage de score façon UEFA */}
                            <div className="relative z-10 grid grid-cols-3 items-center justify-between my-4">
                                {/* Équipe Domicile */}
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 overflow-hidden shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-zinc-700">
                                        {homeTeam.logo ? (
                                            <img
                                                src={homeTeam.logo}
                                                alt={homeTeam.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Shield size={36} className="text-zinc-600" />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="mt-3 font-bold text-xs sm:text-sm md:text-base text-white tracking-wide line-clamp-1">
                                        {homeTeam.name}
                                    </h3>
                                </div>

                                {/* Zone du Score & Timer */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-center gap-3 sm:gap-5 font-mono text-4xl sm:text-5xl font-black tracking-tighter">
                                        <span className={isLive ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'text-white'}>
                                            {homeTeam.score ?? 0}
                                        </span>
                                        <span className="text-zinc-600 font-light text-2xl sm:text-3xl">:</span>
                                        <span className={isLive ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'text-white'}>
                                            {awayTeam.score ?? 0}
                                        </span>
                                    </div>
                                    <div className="mt-1">
                                        <MatchTimer selectedMatch={match} size='text-xs' loading={loading} />
                                    </div>
                                    <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-900/60 px-2.5 py-1 rounded-full border border-zinc-800/50 uppercase tracking-widest font-semibold">
                                        <Map size={10} className="text-[#FFD700]" /> {pitch || 'Terrain principal'}
                                    </div>
                                </div>

                                {/* Équipe Extérieur */}
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 overflow-hidden shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-zinc-700">
                                        {awayTeam.logo ? (
                                            <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Shield size={36} className="text-zinc-600" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-3 font-bold text-xs sm:text-sm md:text-base text-white tracking-wide line-clamp-1">{awayTeam.name}</h3>
                                </div>
                            </div>

                            {/* BUTEURS DU MATCH (SOUS LE SCORE) */}
                            {goalsEvents.length > 0 && (
                                <div className="border-t border-zinc-900/80 pt-3 pb-2 px-4 flex justify-between gap-4 text-[11px] text-zinc-400">
                                    <div className="w-1/2 text-left space-y-1">
                                        {goalsEvents.filter(e => e.side === 'home').map((e, i) => (
                                            <p key={i} className="truncate">⚽ {e.player?.name} <span className="text-[9px] text-zinc-500">({e.time})</span></p>
                                        ))}
                                    </div>
                                    <div className="w-1/2 text-right space-y-1">
                                        {goalsEvents.filter(e => e.side === 'away').map((e, i) => (
                                            <p key={i} className="truncate"><span className="text-[9px] text-zinc-500">({e.time})</span> {e.player?.name} ⚽</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TERRAIN ISOMÉTRIQUE EN 3D (Sublime représentation comme l'écran UEFA) */}
                            <div className="mt-6 mb-2 flex flex-col items-center">
                                <div className="relative w-full max-w-[400px] aspect-[16/10] overflow-hidden rounded-xl border border-emerald-950/20 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.15)] bg-emerald-950/5">
                                    {/* SVG de terrain de foot isométrique réaliste */}
                                    <svg viewBox="0 0 400 250" className="w-full h-full opacity-85">
                                        <defs>
                                            <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stopColor="#1e541f" />
                                                <stop offset="100%" stopColor="#0d2810" />
                                            </radialGradient>
                                        </defs>
                                        {/* Surface du terrain */}
                                        <polygon points="200,30 380,125 200,220 20,125" fill="url(#fieldGrad)" stroke="#58a05b" strokeWidth="2" />
                                        {/* Ligne médiane */}
                                        <line x1="200" y1="30" x2="200" y2="220" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                                        {/* Cercle central */}
                                        <ellipse cx="200" cy="125" rx="35" ry="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                                        <circle cx="200" cy="125" r="2" fill="rgba(255,255,255,0.8)" />
                                        {/* But Gauche */}
                                        <polygon points="20,125 50,110 50,140" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                                        <path d="M 5,115 L 20,125 L 5,135 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                        {/* But Droite */}
                                        <polygon points="380,125 350,110 350,140" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                                        <path d="M 395,115 L 380,125 L 395,135 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                    </svg>
                                    {/* Indicateurs interactifs */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </div>
                                </div>

                                {/* Barre de chronologie du match (Timeline) */}
                                <div className="w-full mt-4 px-2">
                                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mb-1">
                                        <span>0'</span>
                                        <span className="text-emerald-500 font-bold">
                                            {statusText(status)}
                                        </span>
                                        <span>{globaltime}'</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full relative w-full overflow-visible">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                        {/* Marqueurs d'événements */}
                                        {allEvents.slice(-10).map((e, index) => {
                                            const parsedTime = parseInt(e.time, 10) || 45;
                                            const positionPercentage = Math.min(Math.max((parsedTime / 90) * 100, 5), 100);
                                            return (
                                                <div
                                                    key={index}
                                                    className="absolute -top-1.5 w-4 h-4 -ml-2 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-125 transition-transform"
                                                    style={{ left: `${positionPercentage}%` }}
                                                    title={`${e.eventType} - ${e.time}`}
                                                >
                                                    <span className="scale-[0.7]">{renderEventIcon(e.eventType)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BLOC DROITE : CONTENU DES ONGLETS (FIL DU MATCH, STATS / CLASSEMENT) - Prend 5 colonnes */}
                        <div className="lg:col-span-5 bg-[#0f0f11] flex flex-col border-t lg:border-t-0 lg:border-l border-zinc-800/80">

                            {/* Navigation des Onglets Internes */}
                            <div className="flex border-b border-zinc-800 bg-zinc-950/40 p-2">
                                <button
                                    onClick={() => setActiveTab('live')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'live' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Fil du Match
                                </button>
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'stats' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Classement
                                </button>

                                <button
                                    onClick={() => setActiveTab('line-ups')}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'line-ups' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Composition
                                </button>
                            </div>

                            {/* Zone de défilement du contenu */}
                            <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[460px] custom-scrollbar scrollbar-hide">

                                {/* 1. Onglet Fil du Match */}
                                {activeTab === 'line-ups' ? (
                                    <MatchLineups 
                                    loading={isRostered}
                                    homeRoster={home_roster}
                                    awayRoster={away_roster}
                                    teamA={teamAName}
                                    teamB={teamBName}
                                    codeA={codeA}
                                    codeB={codeB}
                                    />
                                ) : activeTab === 'live' ? (
                                    <div className="space-y-4">
                                        {allEvents.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
                                                <Info size={32} className="text-zinc-700 mb-2" />
                                                <p className="text-sm">Aucun événement marquant enregistré.</p>
                                            </div>
                                        ) : (
                                            <div className="relative border-l border-zinc-800/80 ml-3 pl-5 space-y-5">
                                                {allEvents.map((event, index) => {
                                                    const isHome = event.side === 'home';
                                                    return (
                                                        <div key={index} className="relative group">
                                                            {/* Badge du chronomètre */}
                                                            <div className="absolute -left-[31px] top-1 bg-[#121214] border border-zinc-800 text-[#FFD700] text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold shadow">
                                                                {event.time || "0'"}
                                                            </div>

                                                            {/* Carte de l'Événement */}
                                                            <div className="bg-[#151518]/90 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-zinc-700/80 transition-all shadow-sm">
                                                                {event.teamLogo && (
                                                                    <img src={event.teamLogo} alt="" className="w-5 h-5 object-contain opacity-70 flex-shrink-0" />
                                                                )}

                                                                <div className="bg-zinc-800/50 p-2 rounded-lg flex-shrink-0">
                                                                    {renderEventIcon(event.eventType)}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between items-start">
                                                                        <p className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
                                                                            {event.eventType}
                                                                        </p>
                                                                        <span className="text-[9px] text-zinc-500 font-semibold uppercase">
                                                                            {isHome ? 'DOM' : 'EXT'}
                                                                        </span>
                                                                    </div>

                                                                    {event.isSubstitution ? (
                                                                        <div className="space-y-0.5 mt-1">
                                                                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                                                                                <span>▲</span>
                                                                                <span className="truncate">{event.playerIn?.name}</span>
                                                                                {event.playerIn?.dorsa && (
                                                                                    <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1 rounded">
                                                                                        N°{event.playerIn.dorsa}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium opacity-80">
                                                                                <span>▼</span>
                                                                                <span className="truncate">{event.playerOut?.name}</span>
                                                                                {event.playerOut?.dorsa && (
                                                                                    <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1 rounded">
                                                                                        N°{event.playerOut.dorsa}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-1.5 mt-1">
                                                                            <p className="text-xs font-bold text-white truncate">
                                                                                {event.player?.name || 'Joueur'}
                                                                            </p>
                                                                            {event.player?.dorsa && (
                                                                                <span className="text-[9px] font-mono bg-zinc-800 text-[#FFD700] px-1 rounded">
                                                                                    N°{event.player.dorsa}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                {/* 2. Onglet Classement */}
                                {activeTab === 'stats' && (
                                    <div className="space-y-5 animate-fadeIn">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs font-semibold">
                                                <thead>
                                                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-[9px] font-black">
                                                        <th className="py-3 px-2">Équipe</th>
                                                        <th className="py-3 px-1 text-center">MJ</th>
                                                        <th className="py-3 px-1 text-center text-[#FFD700]">Pts</th>
                                                        <th className="py-3 px-1 text-center text-emerald-400">BP</th>
                                                        <th className="py-3 px-1 text-center text-rose-400">BC</th>
                                                        <th className="py-3 px-1 text-center">Diff</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-900 font-medium">
                                                    {/* Home Team */}
                                                    <tr className="hover:bg-zinc-800/20 transition-colors">
                                                        <td className="py-3.5 px-2 flex items-center gap-2 font-bold text-white">
                                                            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                                            {homeTeam.name}
                                                        </td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-300">{homeTeam.played ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-[#FFD700] font-black">{homeTeam.points ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-300">{homeTeam.goalsScored ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-500">{homeTeam.goalsConceded ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-400">{(homeTeam.goalsScored || 0) - (homeTeam.goalsConceded || 0)}</td>
                                                    </tr>
                                                    {/* Away Team */}
                                                    <tr className="hover:bg-zinc-800/20 transition-colors">
                                                        <td className="py-3.5 px-2 flex items-center gap-2 font-bold text-white">
                                                            <span className="w-2 h-2 bg-rose-500 rounded-full" />
                                                            {awayTeam.name}
                                                        </td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-300">{awayTeam.played ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-[#FFD700] font-black">{awayTeam.points ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-300">{awayTeam.goalsScored ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-500">{awayTeam.goalsConceded ?? 0}</td>
                                                        <td className="py-3.5 px-1 text-center text-zinc-400">{(awayTeam.goalsScored || 0) - (awayTeam.goalsConceded || 0)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <hr className="border-zinc-800/80" />

                                        {/* Buteurs Vedettes */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Meilleurs Buteurs</h4>

                                            <div className="space-y-2.5">
                                                {/* Buteur Domicile */}
                                                <div className="bg-[#151518]/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]"><Award size={16} /></div>
                                                        <div>
                                                            <p className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">{homeTeam.name}</p>
                                                            <p className="text-xs font-bold text-white">{homeTeam.topScorer?.name || 'Aucun'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-base font-black text-[#FFD700]">{homeTeam.topScorer?.goals || 0}</span>
                                                        <span className="text-[8px] text-zinc-500 uppercase font-extrabold block">Buts</span>
                                                    </div>
                                                </div>

                                                {/* Buteur Extérieur */}
                                                <div className="bg-[#151518]/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]"><Award size={16} /></div>
                                                        <div>
                                                            <p className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">{awayTeam.name}</p>
                                                            <p className="text-xs font-bold text-white">{awayTeam.topScorer?.name || 'Aucun'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-base font-black text-[#FFD700]">{awayTeam.topScorer?.goals || 0}</span>
                                                        <span className="text-[8px] text-zinc-500 uppercase font-extrabold block">Buts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
    );
};

export default CurrentMatchDetails;