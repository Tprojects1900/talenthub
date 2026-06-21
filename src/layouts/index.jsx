
/**
 * MainLayout - Layout principal pour toutes les pages
 */
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useSwitch } from '../context/SwitchContext'
import { EventModal } from '../components/modals/EventModal'
import { useTeams } from '../hooks/useCalls'

import { useSchedules } from '../hooks/useCalls'
export const MainLayout = ({ children, onAdminClick }) => {
    const {enabled, setEnabled}= useSwitch()
    const {teams,loading}=useTeams()

      const tournamentEvent = {
        title: "Première réunion",
        description: "La première réunion de prise de contact, de collectes des frais et de tirages au sort",
        day: 28,
        month: 6, // Juin
        year: 2026,
        hour: "14:00",
      };
    
     
    
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar key="navbar"/>
         <EventModal
        isVisible={enabled}
        eventComing={tournamentEvent}
        teams={teams}
        onClose={() => setEnabled(false)}
      />
      {/* Main Content */}
      <main key={"main"} className="flex-1 w-full pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
