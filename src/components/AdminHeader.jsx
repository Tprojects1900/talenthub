import React, { useContext} from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useScreen } from '../context/ScreenContext';
import { useSidebar } from '../context/SidebarContext';
import { AuthContext } from '../context/AuthContext';

const Header = ({ pageTitle = "Tableau de Bord", adminName = "Anonyme", avatarUrl }) => {
  const { isMobile, isTablet } = useScreen();
  const { toggleSidebar } = useSidebar();
  const {user}=useContext(AuthContext);
 const auth=user?.user

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Zone Gauche : Déclencheur Mobile + Titre */}
      <div className="flex items-center gap-3">
        {/* Bouton Menu Burger : Visible uniquement sur Mobile et Tablette */}
        {(isMobile || isTablet) && (
          <button 
            onClick={toggleSidebar}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-all"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Titre dynamique de la section courante */}
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System</h2>
          <h1 className="text-xs sm:text-sm font-bold text-zinc-100 mt-0.5">{pageTitle}</h1>
        </div>
      </div>

      {/* Profil Utilisateur & Notifications */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Icône Notification épurée */}
        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD700] rounded-full"></span>
        </button>

        {/* Séparateur minimal */}
        <div className="w-[1px] h-6 bg-zinc-850"></div>

        {/* Bloc Utilisateur */}
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{auth?.username}</p>
            <p className="text-[10px] text-[#FFD700] font-medium tracking-wide">TopFoot</p>
          </div>
          
          {/* Avatar avec fallback si l'image est absente */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#FFD700] to-yellow-600 p-[1px] shadow-md">
            {avatarUrl ? (
              <img src={avatarUrl} alt={adminName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black text-zinc-200 uppercase">
                {adminName.substring(0, 2)}
              </div>
            )}
          </div>
          <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-300 transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;