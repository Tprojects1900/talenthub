import { useState, useMemo } from 'react'
import { useEvents } from '../hooks/useEvents'
import { Section, Container } from '../components/Layout/Container'
import  TopFootHero  from '../components/Hero'
import { YearCalendar } from '../components/Calendar/YearCalendar'
import { EventCard } from '../components/Events/EventCard'
import { InfoCard, InfoSection } from '../components/Info/InfoCard'
import { AdBanner } from '../components/Info/AdBanner'
import { EventModal } from '../components/modals/EventModal'
import { useSwitch } from '../context/SwitchContext'
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

import {
  TournamentInfo,
  PrizeSection,
  RegisterTeam,
  SupportTournament,
  NeighborhoodImpact
} from '../components/Features/FeaturesSections'
import calendarData from '../data/calendar.json'
import infoData from '../data/info.json'
import { flexColCenter } from '../utils/tailwindHelpers'

/**
 * Home - Page principale spectateurs
 */
import { MainLayout } from '../components/Layout/MainLayout'
export default function Home() {
  const { events, loading } = useEvents()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [expandedEvent, setExpandedEvent] = useState(null)

  const {enabled, setEnabled}= useSwitch()
    // const [isModalOpen, setIsModalOpen] = useState(enabled);

  // Exemple d'événement à venir (Date dynamique pour le test)
  const tournamentEvent = {
    title: "Le Choc des Champions 2026",
    description: "Le tournoi inter-quartiers tant attendu commence bientôt. 16 équipes, 1 seul trophée !",
    day: 28,
    month: 6, // Juin
    year: 2026,
    hour: "14:00",
  };

 

  // Exemple de liste d'équipes (avec des quartiers)
  const participatingTeams = [
    { name: "Talent FC", from: "ADAMAVO", logo: t1 },
    { name: "Vapeur Foot", from: "ENFAME", logo: t2 },
    { name: "FC warriors", from: "TOKOIN", logo: t3},
    { name: "New Start", from: "ZONGO", logo: t4 },
    { name: "AS Talent", from: "AVEPOZO", logo: t5 },
    { name: "Blue Lock", from: "KEGUE", logo:t6 },
    { name: "Futurs Etoile", from: "ADAMAVO", logo: t7 },
    { name: "IRON BULLS FC", from: "AGOE LONKUVI", logo: t8 },
    { name: "Machalla", from: "ADAKPAME", logo: t9 },
    { name: "Atlantic FC", from: "BAGUIDA", logo: t10 },
    { name: "Union AC", from: "ADAKPAME", logo: t11 },
    { name: "Africa Sport ", from: "NOUDO-KOPE", logo: t12 },
    { name: "VICTORIA FC", from: "ADAMAVO", logo: t13 },
    { name: "BSB FC", from: "KPOGAN", logo: t14 },
    { name: "Tudor FC", from: "TOKOIN", logo: t15 },
    { name: "Réveil Espoir FC", from: "BE KPOTA", logo: t16 },
  ];

  // Récupérer les événements du jour sélectionné
  const eventsForSelectedDate = useMemo(() => {
    const dateString = selectedDate.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }, [selectedDate, events])

  // Vérifier s'il y a des événements
  const hasEvents = eventsForSelectedDate.length > 0

  // Trier les infos par ordre
  const sortedInfos = useMemo(() => {
    return [...(infoData.dynamicInfo || [])].sort((a, b) => a.order - b.order)
  }, [])

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setExpandedEvent(null)
  }

  const handleViewDetails = (event) => {
    setExpandedEvent(expandedEvent?.id === event.id ? null : event)
  }

  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('calendar-section')
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <MainLayout>
    <div className="w-full">
      {/* Hero Section */}
      <EventModal
        isVisible={enabled}
        eventComing={tournamentEvent}
        teams={participatingTeams}
        onClose={() => setEnabled(false)}
      />
      <TopFootHero />

      

     
    </div>
    </MainLayout>
  )
}
