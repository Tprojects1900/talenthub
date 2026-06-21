import React from 'react';
import TeamsTable from '../components/tables/TeamsTable';
import { MainLayout } from '../layouts'
import { useScreen } from '../context/ScreenContext';

import trophy from "../assets/images/trophy.png"
import { useTeams } from '../hooks/useCalls';



const columns = [
  {
    key: "logo",        // identifiant unique de la colonne (important)
    label: "# LOGO",     // texte header
    render: (row) => (   // optionnel
      <img src={row.logo} className="w-10 h-10 rounded-full" />
    )
  },
  {
    key: "nom",
    label: "NOM"
    // pas de render → affichage automatique row.name
  },
  {
    key: "quartier",
    label: "QUARTIER"
  },
  {
    key: "code",
    label: "CODE",
  //  render: (row) => row.name.substring(0, 3).toUpperCase()
  },
  {
    key: "slogan",
    label: "SLOGAN"
  }
];
const TeamsPage = () => {
    const {isMobile}=useScreen();
    const {teams,refetchTeams,loading}=useTeams();
  return (
    <MainLayout>
    <div className="min-h-screen bg-zinc-950/50">
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
      <main className={`w-full p-4 max-w-7xl mx-auto -mt-10 relative z-10  `}>
        <TeamsTable searchKey='nom' columns={columns} data={teams} title='équipes ' loading={loading} />
        
        
      </main>
    </div>
    </MainLayout>
  );
};

export default TeamsPage;