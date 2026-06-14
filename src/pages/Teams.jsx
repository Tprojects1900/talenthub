import React from 'react';
import TeamsTable from '../components/tables/TeamsTable';
import { MainLayout } from '../layouts'
import { useScreen } from '../context/ScreenContext';
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
import trophy from "../assets/images/trophy.png"

const participatingTeams = [
    { name: "Talent FC", from: "ADAMAVO", slogan: "toujours confiant", logo: t1 },
    { name: "Vapeur Foot", from: "ENFAME", slogan: "Toujours sous pression", logo: t2 },
    { name: "FC warriors", from: "TOKOIN", slogan: "Le combat jusqu'au bout", logo: t3 },
    { name: "New Start", from: "ZONGO", slogan: "Un nouveau départ", logo: t4 },
    { name: "AS Talent", from: "AVEPOZO", slogan: "Révélateur de génies", logo: t5 },
    { name: "Blue Lock", from: "KEGUE", slogan: "L'égoïsme au service du but", logo: t6 },
    { name: "Futurs Etoile", from: "ADAMAVO", slogan: "Briller demain", logo: t7 },
    { name: "IRON BULLS FC", from: "AGOE LONKUVI", slogan: "La force du fer", logo: t8 },
    { name: "Machalla", from: "ADAKPAME", slogan: "Bénis pour gagner", logo: t9 },
    { name: "Atlantic FC", from: "BAGUIDA", slogan: "La vague de la victoire", logo: t10 },
    { name: "Union AC", from: "ADAKPAME", slogan: "L'unité fait la puissance", logo: t11},
    { name: "Africa Sport", from: "NOUDO-KOPE", slogan: "Le coeur de l'Afrique", logo: t12 },
    { name: "VICTORIA FC", from: "ADAMAVO", slogan: "Nés pour vaincre", logo: t13 },
    { name: "BSB FC", from: "KPOGAN", slogan: "Savoir-faire et Discipline", logo: t14 },
    { name: "Tudor FC", from: "TOKOIN", slogan: "L'héritage du football", logo: t15 },
    { name: "Réveil Espoir FC", from: "BE KPOTA", slogan: "L'espoir se lève enfin", logo: t16 },
];

const columns = [
  {
    key: "logo",        // identifiant unique de la colonne (important)
    label: "# LOGO",     // texte header
    render: (row) => (   // optionnel
      <img src={row.logo} className="w-10 h-10 rounded-full" />
    )
  },
  {
    key: "name",
    label: "NOM"
    // pas de render → affichage automatique row.name
  },
  {
    key: "from",
    label: "QUARTIER"
  },
  {
    key: "code",
    label: "CODE",
    render: (row) => row.name.substring(0, 3).toUpperCase()
  },
  {
    key: "slogan",
    label: "SLOGAN"
  }
];
const TeamsPage = () => {
    const {isMobile}=useScreen();
  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-100">
      {/* Header Full Width - Image de la Coupe */}
  <header className="relative w-full h-[250px] sm:h-[320px] md:h-[400px] overflow-hidden shadow-inner">
  <img
    src={trophy}
    alt="Golden Trophy"
    className="w-full h-full object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-4">

    <div className="max-w-4xl">

      {/* Titre */}
      <h1 className="text-white font-black uppercase italic tracking-tighter leading-none
                     text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Tournoi <span className="text-[#FFD700]">Top Foot</span>
      </h1>

      {/* Sous-titre */}
      <p className="text-[#FFD700] font-bold tracking-widest mt-3 uppercase
                    text-xs sm:text-sm md:text-base lg:text-xl">
        Édition 5 (2026)• Les Équipes Participantes
      </p>

    </div>

  </div>
</header>

      {/* Main Content - Tableau avec p-4 */}
      <main className={`w-full p-4 max-w-7xl mx-auto -mt-10 relative z-10 `}>
        <TeamsTable columns={columns} data={participatingTeams} title='équipes ' />
        
        
      </main>
    </div>
    </MainLayout>
  );
};

export default TeamsPage;