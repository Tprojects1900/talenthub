
/**
 * MainLayout - Layout principal pour toutes les pages
 */
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useSwitch } from '../context/SwitchContext'
import { EventModal } from '../components/modals/EventModal'
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
export const MainLayout = ({ children, onAdminClick }) => {
    const {enabled, setEnabled}= useSwitch()

      const tournamentEvent = {
        title: "Première réunion",
        description: "La première réunion de prise de contact, de collectes des frais et de tirages au sort",
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
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar key="navbar"/>
         <EventModal
        isVisible={enabled}
        eventComing={tournamentEvent}
        teams={participatingTeams}
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
