import React, { useState } from 'react';
import {
    Tv, Clock, Award, Shield,
    ChevronRight, Activity, TrendingUp, Goal,
    RefreshCcw, Square, CircleAlert, Map
} from 'lucide-react';

import { useScreen } from '../context/ScreenContext';
import MatchStatusBadge from './MatchStatusBadge';

const CurrentMatchDetails = ({
    homeTeam,
    awayTeam,
    matchType,
    date,
    status,
    pitch
}) => {
    const { isMobile } = useScreen();
    const [activeTab, setActiveTab] = useState('live');

    // SÉCURITÉ : Ajout d'une valeur par défaut pour le tri afin d'éviter le crash de localeCompare
    const allEvents = [
        ...(homeTeam.teamEvents || []).map(e => ({ ...e, side: 'home' })),
        ...(awayTeam.teamEvents || []).map(e => ({ ...e, side: 'away' }))
    ].sort((a, b) => (a.time || "").localeCompare(b.time || ""));

    const renderEventIcon = (type = "") => {
        if (type.includes("But")) {
            return <Goal className="w-5 h-5 text-emerald-500" />;
        }
        if (type.includes("Carton Jaune")) {
            return (
                <Square
                    className="w-4 h-5 text-yellow-400 fill-yellow-400"
                    strokeWidth={1.5}
                />
            );
        }
        if (type.includes("Carton Rouge")) {
            return (
                <Square
                    className="w-4 h-5 text-red-500 fill-red-500"
                    strokeWidth={1.5}
                />
            );
        }
        if (type.includes("Changement")) {
            return (
                <RefreshCcw
                    className="w-4 h-4 text-blue-500"
                    strokeWidth={2.5}
                />
            );
        }
        return (
            <CircleAlert
                className="w-4 h-4 text-zinc-400"
                strokeWidth={1.5}
            />
        );
    };

    // VÉRIFICATION CORRIGÉE : S'aligne sur ton énumération backend ('live')
    const isLive = status === 'live' || status === 'En cours';

    return (
        <div className="w-full max-w-4xl mx-auto bg-zinc-950 text-white rounded-0 shadow-2xl border-0 border-zinc-800/80 overflow-hidden font-sans">
            
            {/* HEADER */}
            <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase border border-[#FFD700]/20">
                        {matchType || 'Match'}
                    </span>
                    <span className="text-zinc-400 text-xs flex items-center gap-1">• {date}</span>
                </div>
                <div><MatchStatusBadge status={status}/></div>
            </div>

            {/* SCOREBOARD PRINCIPAL */}
            <div className="relative px-4 py-8 sm:p-10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FFD700]/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="grid grid-cols-3 items-center justify-center relative z-10">
                    {/* Home */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-3 sm:p-4 shadow-xl transition-transform hover:scale-105">
                            {homeTeam.logo ? <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-contain" /> : <Shield size={40} className="text-zinc-600" />}
                        </div>
                        <h3 className="mt-3 font-bold text-sm sm:text-lg text-zinc-100 line-clamp-1">{homeTeam.name}</h3>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-3 sm:gap-6 font-mono text-4xl sm:text-6xl font-black tracking-tight">
                            <span className={isLive ? 'text-emerald-400 animate-pulse' : 'text-white'}>{homeTeam.score ?? 0}</span>
                            <span className="text-[#FFD700] text-2xl sm:text-4xl font-light opacity-60">:</span>
                            <span className={isLive ? 'text-emerald-400 animate-pulse' : 'text-white'}>{awayTeam.score ?? 0}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                            <Map size={12} className="text-[#FFD700]" /> {pitch}
                        </div>
                    </div>

                    {/* Away */}
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-3 sm:p-4 shadow-xl transition-transform hover:scale-105">
                            {awayTeam.logo ? <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-contain" /> : <Shield size={40} className="text-zinc-600" />}
                        </div>
                        <h3 className="mt-3 font-bold text-sm sm:text-lg text-zinc-100 line-clamp-1">{awayTeam.name}</h3>
                    </div>
                </div>
            </div>

            {/* ONGLETS */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-4">
                <button onClick={() => setActiveTab('live')} className={`flex-1 sm:flex-none px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'live' ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5' : 'border-transparent text-zinc-400 hover:text-white'}`}>Fil du Match</button>
                <button onClick={() => setActiveTab('stats')} className={`flex-1 sm:flex-none px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'stats' ? 'border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5' : 'border-transparent text-zinc-400 hover:text-white'}`}>Classement</button>
            </div>

            {/* CONTENU */}
            <div className="p-4 sm:p-6 min-h-[250px]">
                {activeTab === 'live' && (
                    <div className="space-y-4">
                        {allEvents.length === 0 ? (
                            <div className="text-center py-10 text-zinc-500 text-sm">Aucun événement majeur pour le moment.</div>
                        ) : (
                            <div className="relative border-l sm:border-l-0 sm:before:absolute sm:before:left-1/2 sm:before:top-0 sm:before:bottom-0 sm:before:w-[1px] sm:before:bg-zinc-800 pl-4 sm:pl-0 space-y-6">
                                {allEvents.map((event, index) => {
                                    const isHome = event.side === 'home';
                                    return (
                                        <div key={index} className={`flex flex-col sm:flex-row items-start sm:items-center ${isHome ? 'sm:flex-row-reverse' : ''} relative`}>
                                            
                                            {/* Temps au milieu */}
                                            <div className="absolute -left-[25px] sm:left-1/2 sm:-translate-x-1/2 bg-zinc-900 border border-zinc-700 text-[#FFD700] text-[10px] font-mono px-1.5 py-0.5 rounded-md z-10 shadow-md">
                                                {event.time}
                                            </div>

                                            {/* Carte de l'Événement */}
                                            <div className={`w-full sm:w-1/2 ${isHome ? 'sm:pl-8' : 'sm:pr-8'} flex ${isHome ? 'justify-start' : 'sm:justify-end'}`}>
                                                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3 max-w-sm w-full shadow-md hover:border-zinc-700/50 transition-all relative overflow-hidden">
                                                    
                                                    {event.teamLogo && (
                                                        <img src={event.teamLogo} alt="" className="w-5 h-5 object-contain opacity-80 flex-shrink-0" />
                                                    )}

                                                    <div className="bg-zinc-800 p-2 rounded-lg flex-shrink-0">
                                                        {renderEventIcon(event.eventType)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">{event.eventType}</p>
                                                        
                                                        {event.isSubstitution ? (
                                                            <div className="space-y-0.5 mt-0.5">
                                                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                                                                    <span>▲</span> 
                                                                    <span className="truncate">{event.playerIn?.name}</span>
                                                                    {event.playerIn?.dorsa && <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1 rounded">N°{event.playerIn.dorsa}</span>}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium opacity-80">
                                                                    <span>▼</span> 
                                                                    <span className="truncate">{event.playerOut?.name}</span>
                                                                    {event.playerOut?.dorsa && <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1 rounded">N°{event.playerOut.dorsa}</span>}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-bold text-white truncate">{event.player?.name || 'Joueur inconnu'}</p>
                                                                {event.player?.dorsa && (
                                                                    <span className="inline-block mt-0.5 text-[10px] font-mono bg-zinc-800 text-[#FFD700] px-1.5 py-0.2 rounded">
                                                                        N°{event.player.dorsa}
                                                                    </span>
                                                                )}
                                                        </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hidden sm:block sm:w-1/2" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB STATS */}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm overflow">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                                        <th className="py-3 px-2">Équipe</th>
                                        <th className="py-3 px-2 text-center">MJ</th>
                                        <th className="py-3 px-2 text-center text-[#FFD700]">Pts</th>
                                        <th className="py-3 px-2 text-center text-emerald-400">BP</th>
                                        <th className="py-3 px-2 text-center text-red-400">BC</th>
                                        <th className="py-3 px-2 text-center ">Diff</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900 font-medium">
                                    <tr className="hover:bg-zinc-900/30 transition-colors">
                                        <td className="py-3 px-2 flex items-center gap-2 font-bold text-white"><span className="w-2 h-2 bg-blue-500 rounded-full" /> {homeTeam.name}</td>
                                        <td className="py-3 px-2 text-center text-zinc-300">{homeTeam.played ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-[#FFD700] font-black">{homeTeam.points ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-zinc-300">{homeTeam.goalsScored ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-zinc-500">{homeTeam.goalsConceded ?? 0}</td>
                                        <td className="py-3 px-2 text-center  text-zinc-400">{(homeTeam.goalsScored || 0) - (homeTeam.goalsConceded || 0)}</td>
                                    </tr>
                                    <tr className="hover:bg-zinc-900/30 transition-colors">
                                        <td className="py-3 px-2 flex items-center gap-2 font-bold text-white"><span className="w-2 h-2 bg-orange-500 rounded-full" /> {awayTeam.name}</td>
                                        <td className="py-3 px-2 text-center text-zinc-300">{awayTeam.played ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-[#FFD700] font-black">{awayTeam.points ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-zinc-300">{awayTeam.goalsScored ?? 0}</td>
                                        <td className="py-3 px-2 text-center text-zinc-500">{awayTeam.goalsConceded ?? 0}</td>
                                        <td className="py-3 px-2 text-center  text-zinc-400">{(awayTeam.goalsScored || 0) - (awayTeam.goalsConceded || 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr className="border-zinc-800" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]"><Award size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Meilleur Buteur - {homeTeam.name}</p>
                                        <p className="text-sm font-black text-white">{homeTeam.topScorer?.name || 'Aucun'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-[#FFD700]">{homeTeam.topScorer?.goals || 0}</span>
                                    <span className="text-xs text-zinc-400 block -mt-1">Buts</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]"><Award size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Meilleur Buteur - {awayTeam.name}</p>
                                        <p className="text-sm font-black text-white">{awayTeam.topScorer?.name || 'Aucun'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-[#FFD700]">{awayTeam.topScorer?.goals || 0}</span>
                                    <span className="text-xs text-zinc-400 block -mt-1">Buts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentMatchDetails;