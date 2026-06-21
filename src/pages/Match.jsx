import React, { useState, useMemo } from 'react'
import { GroupTable } from '../components/tables/GroupTable'
import { MatchCard } from '../components/cards/MatchCard'
import { MainLayout } from '../layouts'
import { useScreen } from '../context/ScreenContext'
import { Inbox, CalendarX, Search, Trophy, Flame } from "lucide-react"
import { useGroups, useSchedules } from '../hooks/useCalls'
import FootballLoader from '../components/FootBallLoader'

export const MatchPage = () => {
    const { isMobile } = useScreen()
    const [activeTab, setActiveTab] = useState('tous')
    const [searchQuery, setSearchQuery] = useState('')

    // 1. Récupération des données réelles de l'API
    const { schedules, loaded_schedule, loa } = useSchedules()
    const { groups, group_loaded } = useGroups()

    // 2. Sécurité absolue sur le chargement
    const isSchedulesReady = loaded_schedule === true || loa === true || (schedules && schedules.length > 0);
    const isGroupsReady = group_loaded === true || (groups && groups.length > 0);
    const isFullyLoaded = isSchedulesReady && isGroupsReady;
    // console.log("load full",isGroupsReady,isSchedulesReady)
    // 3. Filtrage dynamique, Recherche, et Tri intelligent des matchs
    const filteredAndSortedMatches = useMemo(() => {
        if (!schedules) return [];

        return schedules
            .filter(match => {
                const status = String(match.status || '').toLowerCase();
                const homeName = String(match.homeTeam?.nom || match.homeTeam?.code || '').toLowerCase();
                const awayName = String(match.awayTeam?.nom || match.awayTeam?.code || '').toLowerCase();
                const groupName = String(match.groupName || '').toLowerCase();
                const query = searchQuery.toLowerCase();

                // Filtre d'onglet (Tous vs En Direct)
                if (activeTab === 'direct' && !(status === 'live' || status === 'half-time' || status === 'en cours')) {
                    return false;
                }

                // Filtre de recherche textuelle
                if (searchQuery.trim() !== '') {
                    return homeName.includes(query) || awayName.includes(query) || groupName.includes(query);
                }

                return true;
            })
            .sort((a, b) => {
                const statusA = String(a.status || '').toLowerCase();
                const statusB = String(b.status || '').toLowerCase();

                const isALive = statusA === 'live' || statusA === 'half-time' || statusA === 'en cours';
                const isBLive = statusB === 'live' || statusB === 'half-time' || statusB === 'en cours';

                // Règle 1 : Les matchs en direct passent en premier
                if (isALive && !isBLive) return -1;
                if (!isALive && isBLive) return 1;

                // Règle 2 : Tri par date (du plus récent ou chronologique)
                const dateA = a.date ? new Date(`${a.date}T${a.time || '00:00'}`) : new Date(0);
                const dateB = b.date ? new Date(`${b.date}T${b.time || '00:00'}`) : new Date(0);
                return dateB - dateA; 
            });
    }, [schedules, activeTab, searchQuery]);

    // 4. Association des équipes par groupe provenant de l'API
    const apiGroupsData = useMemo(() => {
        if (!groups) return [];
        return groups.map(group => {
            const groupMatches = filteredAndSortedMatches.filter(match => 
                String(match.groupId || match.groupName || '').toLowerCase() === String(group.id || group.name || '').toLowerCase()
            );
            return {
                ...group,
                teams: group.teams || [], 
                weekMatches: groupMatches
            };
        });
    }, [groups, filteredAndSortedMatches]);

    if (isFullyLoaded) {
        return (
            <MainLayout>
                <div className="flex h-[75vh] flex-col items-center justify-center gap-4 bg-zinc-950">
                    <FootballLoader />
                    <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase animate-pulse">
                        Synchronisation live...
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-orange-500/30 selection:text-orange-400">
                
                {/* HERO BANNER & SEARCH CONTROL */}
                <header className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono tracking-wider uppercase mb-1">
                                    <Trophy size={12} className="text-orange-500" />
                                    <span>Compétition Officielle</span>
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-white bg-clip-text">
                                    TOP FOOT <span className="text-orange-500 font-light">Edition 5</span>
                                </h1>
                            </div>

                            {/* BARRE DE RECHERCHE UNIVERSELLE */}
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher une équipe, une poule..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* ONGLETS NAV / FILTRES STATUS */}
                        <div className="flex items-center gap-3 mt-4 pt-2 border-t border-zinc-800/40">
                            <button
                                onClick={() => setActiveTab('tous')}
                                className={`px-4 py-1.5 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-200 ${
                                    activeTab === 'tous'
                                        ? 'bg-zinc-100 text-zinc-950 shadow-lg shadow-black/20'
                                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`}
                            >
                                Tous les matchs
                            </button>

                            <button
                                onClick={() => setActiveTab('direct')}
                                className={`px-4 py-1.5 rounded-lg font-semibold text-xs tracking-wide uppercase flex items-center gap-2 transition-all duration-200 ${
                                    activeTab === 'direct'
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full bg-current ${activeTab === 'direct' ? 'animate-ping' : ''}`}></span>
                                En direct
                            </button>
                        </div>
                    </div>
                </header>

                {/* CONTENU PRINCIPAL SÉPARÉ EN DEUX SECTIONS */}
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className={`flex ${isMobile ? 'flex-col-reverse gap-8' : 'md:flex-row gap-8'}`}>

                        {/* SECTION CLASSEMENTS ET POULES (65%) */}
                        <div className="w-full md:w-[62%] bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
                                    <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                                        Tableaux des Groupes
                                    </h2>
                                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                                        {apiGroupsData.length} Poules
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {apiGroupsData.length === 0 ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-600">
                                            <Inbox size={40} className="mb-3 text-zinc-700" />
                                            <p className="text-sm font-medium">Aucun groupe ne correspond</p>
                                        </div>
                                    ) : (
                                        apiGroupsData.map((group) => (
                                            <div key={group.id || group.name} className="transition-all hover:translate-y-[-2px] duration-300">
                                                <GroupTable group={group} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* SECTION FLUX DES MATCHS (38%) */}
                        <div className="w-full md:w-[38%] bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
                            <section>
                                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
                                    <h2 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                                        <span>Rencontres</span>
                                        {filteredAndSortedMatches.some(m => ['live', 'half-time'].includes(String(m.status).toLowerCase())) && (
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </h2>
                                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                                        {filteredAndSortedMatches.length} Matchs
                                    </span>
                                </div>

                                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                                    {filteredAndSortedMatches.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                                            <CalendarX size={40} className="mb-3 text-zinc-700" />
                                            <p className="text-sm font-medium">Aucun match trouvé</p>
                                            <p className="text-xs text-zinc-600 text-center mt-1">Ajustez vos filtres ou votre terme de recherche.</p>
                                        </div>
                                    ) : (
                                        filteredAndSortedMatches.map((match) => (
                                            <MatchCard key={match?.id || match?._id} match={match} />
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                    </div>
                </main>
            </div>
        </MainLayout>
    )
}