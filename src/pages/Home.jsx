import { useState, useMemo } from 'react'
import  TopFootHero  from '../components/Hero'
import CurrentMatchDetails from '../components/CurrentMatchDetails'
import {
  TournamentInfo,
  PrizeSection,
  RegisterTeam,
  SupportTournament,
  NeighborhoodImpact
} from '../components/Features/FeaturesSections'

import { MainLayout } from '../layouts'
import t1 from "../assets/images/t1.png"
import t4 from "../assets/images/t4.png"
export default function Home() {
  const [isStart,setIsStart]=useState(true);

     const matchPropsExample = {
    matchType: "Demi-Finale",
    date: "Dimanche 5 Juillet 2026 à 16:00",
    status: "En cours", // Options: "En cours", "Goal Checking", "Mi-temps", "Terminé"
    homeTeam: {
      name: "TALENT FC",
      logo: t1, // Mettre lien logo réel
      score: 2,
      played: 5,
      points: 12,
      goalsScored: 11,
      goalsConceded: 4,
      topScorer: { name: "K. Agbala", goals: 5 },
      teamEvents: [
        { time: "14:20", eventType: "Carton Jaune", player: { name: "A. Mensah", dorsa: 4 ,teamCode:"TAL"}},
        { time: "32:10", eventType: "But", player: { name: "K. Agbala", dorsa: 9 ,teamCode:"TAL" } },
        { time: "75:00", eventType: "Changement", player: { name: "E. Togbé (Entrée)", dorsa: 14,teamCode:"TAL"  }, },
        { time: "75:00", eventType: "Changement", player: { name: "E. Toress (Sortie)", dorsa: 24 ,teamCode:"TAL"}  }
      ]
    },
    awayTeam: {
      name: "NEW STAR",
      logo: t4, // Test fallback avec icône par défaut
      score: 1,
      played: 5,
      points: 9,
      goalsScored: 8,
      goalsConceded: 6,
      topScorer: { name: "J. Ayité", goals: 4 },
      teamEvents: [
        { time: "44:55", eventType: "But", player: { name: "J. Ayité", dorsa: 10,teamCode:"NEW" },  },
        { time: "61:15", eventType: "Carton Rouge", player: { name: "P. Kouma", dorsa: 5 ,teamCode:"NEW"},  }
      ]
    }
  };


  return (
    <MainLayout>
    <div className="w-full">
      {/* Hero Section */}
     {!isStart ? ( <TopFootHero />) : ( <CurrentMatchDetails {...matchPropsExample}/> ) }

      

     
    </div>
    </MainLayout>
  )
}
