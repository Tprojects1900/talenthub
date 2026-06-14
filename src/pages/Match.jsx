import React, { useState } from 'react'
import { GroupTable } from '../components/tables/GroupTable'
import { MatchCard } from '../components/cards/MatchCard'
import { MainLayout } from '../layouts'
import { useScreen } from '../context/ScreenContext'
import { Inbox, CalendarX } from "lucide-react"
import t1 from "../assets/images/t1.png"
import t2 from "../assets/images/t2.png"
import t3 from "../assets/images/t3.png"
import t4 from "../assets/images/t4.png"
import t5 from "../assets/images/t5.png"
import t6 from "../assets/images/t6.png"
import t7 from "../assets/images/t7.png"
import t8 from "../assets/images/t8.png"
import t9 from "../assets/images/t9.png"
import t10 from "../assets/images/t10.png"
import t11 from "../assets/images/t11.png"
import t12 from "../assets/images/t12.png"
import t13 from "../assets/images/t13.png"
import t14 from "../assets/images/t14.png"
import t15 from "../assets/images/t15.png"
import t16 from "../assets/images/t16.png"
// Données fictives
const MOCK_GROUPS_DATA = [
    {
        name: "Poule A",
        teams: [
            {
                name: "TALENT FC",
                code: "TAL",
                logo: t1,
                from: "ADAMAVO"
            },
            {
                name: "VAPEUR FOOT",
                code: "VAP",
                logo: t2,
                from: "ENFAME"
            },
            {
                name: "FC WARRIORS",
                code: "FC",
                logo: t3,
                from: "TOKOIN"
            },
            {
                name: "NEW START",
                code: "NEW",
                logo:t4,
                from: "ZONGO"
            }
        ],
       
        weekMatches: [
            {
                id: "m4",
                teamA: {
                    name: "TALENT FC",
                    code: "TAL",
                    logo: t1
                },
                teamB: {
                    name: "VAPEUR FOOT",
                    code: "VAP",
                    logo: t2
                },
                scoreA: 0,
                scoreB: 2,
                status: "Terminé",
                dateInfo: "Dimanche - 21:00",
                groupName: "Groupe A"
            },
            {
                id: "m3",
                teamA: {
                    name: "FC WARRIORS",
                    code: "FC",
                    logo: t3
                },
                teamB: {
                    name: "NEW START",
                    code: "NEW",
                    logo: t4
                },
                scoreA: 2,
                scoreB: 1,
                status: "Terminé",
                dateInfo: "Dimanche - 18:00",
                groupName: "Groupe A"
            },
            {
                id: "m2",
                teamA: {
                    name: "TALENT FC",
                    code: "TAL",
                    logo: t1
                },
                teamB: {
                    name: "FC WARRIORS",
                    code: "FC",
                    logo: t3
                },
                scoreA: 1,
                scoreB: 1,
                status: "Mi-temps",
                dateInfo: "Samedi - 21:00",
                groupName: "Groupe A"
            },
            {
                id: "m1",
                teamA: {
                    name: "NEW START",
                    code: "NEW",
                    logo: t4
                },
                teamB: {
                    name: "VAPEUR FOOT",
                    code: "VAP",
                    logo: t2
                },
                status: "Bientôt",
                dateInfo: "Samedi - 15:00",
                groupName: "Groupe A"
            }
        ]
    },
    {
        name: "Poule B",
        teams: [
            {
                name: "AS TALENT",
                code: "AS",
                logo: t5,
                from: "AVEPOZO"
            },
            {
                name: "BLUE LOCK",
                code: "BLU",
                logo: t6,
                from: "KEGUE"
            },
            {
                name: "FUTURS ETOILES",
                code: "FUT",
                logo: t7,
                from: "ADAMAVO"
            },
            {
                name: "IRON BULLS",
                code: "IRO",
                logo: t8,
                from: "AGOE LONKUVI"
            }
        ],
        weekMatches: [
            {
                id: "m8",
                teamA: {
                    name: "FUTURS ETOILES",
                    code: "FUT",
                    logo: t7
                },
                teamB: {
                    name: "IRON BULLS",
                    code: "IRO",
                    logo: t8
                },
                scoreA: 3,
                scoreB: 3,
                status: "En cours",
                dateInfo: "Dimanche - 22:30",
                groupName: "Groupe B"
            },
            {
                id: "m7",
                teamA: {
                    name: "AS TALENT",
                    code: "AS",
                    logo: t5
                },
                teamB: {
                    name: "BLUE LOCK",
                    code: "BLU",
                    logo: t6
                },
                scoreA: 1,
                scoreB: 0,
                status: "Terminé",
                dateInfo: "Dimanche - 16:00",
                groupName: "Groupe B"
            },
            {
                id: "m6",
                teamA: {
                    name: "AS TALENT",
                    code: "AS",
                    logo: t5
                },
                teamB: {
                    name: "FUTURS ETOILES",
                    code: "FUT",
                    logo: t7
                },
                scoreA: 0,
                scoreB: 2,
                status: "Terminé",
                dateInfo: "Samedi - 20:00",
                groupName: "Groupe B"
            },
            {
                id: "m5",
                teamA: {
                    name: "BLUE LOCK",
                    code: "BLU",
                    logo: t6
                },
                teamB: {
                    name: "IRON BULLS",
                    code: "IRO",
                    logo: t8
                },
                scoreA: 0,
                scoreB: 1,
                status: "Terminé",
                dateInfo: "Samedi - 14:00",
                groupName: "Groupe B"
            }
        ]
       
    }
]

export const MatchPage = () => {
    const { isMobile, isTablet, isDesktop } = useScreen()
    const [activeTab, setActiveTab] = useState('tous')

    const filteredGroups = MOCK_GROUPS_DATA.map((group) => {
        if (activeTab === 'direct') {
            return {
                ...group,
                weekMatches: group.weekMatches.filter(
                    (match) =>
                        match.status === 'En cours' ||
                        match.status === 'Mi-temps'
                ),
            }
        }

        return group
    })

    const allMatches = filteredGroups.flatMap(
        (group) => group.weekMatches
    )


    return (
        <MainLayout>
            <div className=" bg-gray-50">
                {/* Header */}
                <header className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white border-b sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-zinc-50">
                            Tournoi de football
                        </h1>

                        <span className="bg-orange-600/25 px-3 py-1 rounded-lg text-sm text-zinc-50">
                            TOP FOOT Edition 5
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mb-8 p-4">
                        <button
                            onClick={() => setActiveTab('tous')}
                            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'tous'
                                ? 'bg-green-500 shadow text-white'
                                : 'bg-gray-700 text-zinc-50'
                                }`}
                        >
                            Tous les matchs
                        </button>

                        <button
                            onClick={() => setActiveTab('direct')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'direct'
                                ? 'bg-[#009966] shadow text-red-500'
                                : 'bg-gray-700 text-'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            En direct
                        </button>
                    </div>
                </header>

                <main className="w-full max-w-full mx-auto px-4 py-8">

                    {/* Filtres */}



                    <div className={`flex ${isMobile ? 'flex-col-reverse' : ''} md:flex-row`}>

                        {/* LEFT */}
                        <div className="w-full md:w-[71.428%] bg-zinc-50 shadow-sm p-4">
                            <section className="mt-12">
                                <h2 className="text-2xl font-bold mb-6 text-orange-400">
                                    Classement des groupes
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {filteredGroups.length === 0 ? (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                                            <Inbox size={48} className="mb-3 text-gray-400" />
                                            <p className="text-lg font-semibold">
                                                Aucun groupe disponible
                                            </p>
                                            <p className="text-sm">
                                                Les groupes apparaîtront ici dès qu’ils seront créés.
                                            </p>
                                        </div>
                                    ) : (
                                        filteredGroups.map((group) => (
                                            <GroupTable key={group.name} group={group} />
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT */}
                        <div className="w-full md:w-[28.572%] bg-gray-100 shadow-lg p-4">
                            <section>
                                <h2 className="text-2xl font-bold mb-6 text-black">
                                    Matchs du week-end
                                </h2>

                                <div className="flex flex-col gap-2">
                                    {allMatches.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                            <CalendarX size={48} className="mb-3 text-gray-400" />
                                            <p className="text-lg font-semibold">
                                                Aucun match disponible
                                            </p>
                                            <p className="text-sm">
                                                Revenez plus tard pour voir les rencontres.
                                            </p>
                                        </div>
                                    ) : (
                                        allMatches.map((match) => (
                                            <MatchCard key={match.id} match={match} />
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