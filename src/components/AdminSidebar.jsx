import React from 'react';
import { 
  LayoutGrid, Users, Calendar, Settings, LogOut, 
  Layers, BarChart3, ShieldAlert, X, Radio ,SlidersHorizontal
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useScreen } from '../context/ScreenContext';

const Sidebar = ({ onNavigate }) => {
  const { closeSidebar } = useSidebar();
  const { isMobile, isTablet } = useScreen();
  const location = useLocation();

  // Liste des menus configurée proprement
  const menuItems = [
    { href: "/dashboard", id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutGrid },
     { 
      href: "/admin/match-gestion", 
      id: 'ges-match', 
      label: 'Match en cours..', 
      icon: Radio, // Changement pour l'icône Radio (Live)
      isLive: true // Flag pour appliquer le style spécifique rouge
    },
    { href: "/admin/equipe-gestion", id: 'ges-equipes', label: 'Gestion Équipes', icon: Users },
   
    { href: "/admin/group-gestion", id: 'tournois', label: 'Poules & Planification', icon: Layers },
    { href: "/admin/equipes", id: 'equipes', label: 'Ajustements', icon: SlidersHorizontal },
    // { href: "/admin/planification", id: 'calendrier', label: 'Planification', icon: Calendar },
    { href: "/admin/statistiques", id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { href: "/admin/parametres", id: 'configuration', label: 'Paramètres', icon: Settings },
  ];

  const handleMenuClick = (id, label) => {
    // Exécute la callback si elle existe sans bloquer le comportement naturel du <Link>
    if (onNavigate) {
      onNavigate(id, label);
    }
    // Fermeture propre du menu sur mobile
    if (isMobile || isTablet) {
      closeSidebar();
    }
  };

  return (
    <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 select-none">
      <div>
        {/* Header de la Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FFD700] rounded-lg flex items-center justify-center text-zinc-950">
              <ShieldAlert size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-wider text-zinc-100">
                GES<span className="text-[#FFD700]">-TOPFOOT</span>
              </h1>
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest -mt-0.5">Control Panel</p>
            </div>
          </div>

          {(isMobile || isTablet) && (
            <button onClick={closeSidebar} className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            // Détermination dynamique des classes CSS selon le statut actif et "Live"
            let itemStyles = "";
            let iconStyles = "";

            if (isActive) {
              if (item.isLive) {
                // Style Actif + LIVE (Rouge)
                itemStyles = "bg-red-600 text-white font-black shadow-lg shadow-red-900/20";
                iconStyles = "animate-pulse text-white";
              } else {
                // Style Actif Classique (Jaune)
                itemStyles = "bg-[#FFD700] text-zinc-950 font-black";
                iconStyles = "text-zinc-950";
              }
            } else {
              if (item.isLive) {
                // Style Inactif mais item LIVE (Texte rouge discret + icône qui clignote)
                itemStyles = "text-red-400/90 hover:text-red-400 hover:bg-red-950/20";
                iconStyles = "animate-pulse text-red-500";
              } else {
                // Style Inactif Classique
                itemStyles = "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50";
                iconStyles = "text-zinc-400 group-hover:text-zinc-200";
              }
            }

            return (
              <Link
                key={item.href} // Clé unique basée sur le href (plus stable que l'index)
                to={item.href}
                onClick={() => handleMenuClick(item.id, item.label)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${itemStyles}`}
              >
                <Icon 
                  size={16} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={iconStyles}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bouton de Déconnexion */}
      <div className="p-4 border-t border-zinc-900">
        <Link 
          to="/logout"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;