import { 
  LayoutGrid, Users, Calendar, Settings, LogOut, 
  Layers, BarChart3, ShieldAlert, X, Radio ,SlidersHorizontal,CalendarDays,Wallet,
  File,Timer,
} from 'lucide-react';
  
  // Liste des menus configurée proprement
  export const menuItems = [
    { href: "/dashboard", id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutGrid },
     { 
      href: "/admin/match-gestion", 
      id: 'ges-match', 
      label: 'Match en cours..', 
      icon: Radio, // Changement pour l'icône Radio (Live)
      isLive: true // Flag pour appliquer le style spécifique rouge
    },
// Exemple d'élément de sidebar :
{
  label: "Temps de jeu",
  id:"temps_jeux",
  icon: Timer,
  href: "/admin/parametre-temps-de-jeux" // ou l'ID de votre onglet
},
    { href: "/admin/equipe-gestion", id: 'ges-equipes', label: 'Gestion Équipes', icon: Users },
   
    { href: "/admin/group-gestion", id: 'tournois', label: 'Poules & Planification', icon: Layers },
    { href: "/admin/equipes", id: 'equipes', label: 'Ajustements', icon: SlidersHorizontal },
    // { href: "/admin/affiches", id: 'affiches', label: 'Affiches des matchs', icon: CalendarDays },
    // { href: "/admin/planification", id: 'calendrier', label: 'Planification', icon: Calendar },
    { href: "/admin/statistiques", id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { href: "/admin/caisses", id: 'caisses', label: 'Topfoot Caisse', icon: Wallet },
    { href: "/admin/tickets", id: 'tickets', label: 'Topfoot Tickets', icon: Wallet },
    { href: "/admin/fiche-du-match", id: 'fiches-du-match', label: 'Fiche du match', icon: File },
    { href: "/admin/parametres", id: 'configuration', label: 'Paramètres', icon: Settings },
  ];