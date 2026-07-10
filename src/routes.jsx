import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { MatchPage } from "./pages/Match";
import TeamsPage from "./pages/Teams";
import RankingPage from "./pages/Ranking";
import CurrentMatchPage from "./pages/CurrentMatch";
import AdminLogin from "./pages/auth/Login";
import MatchConsoleManager from "./pages/MatchConsoleManager/index";
import TeamCreationManager from "./pages/EquipeConsoleManager";
import GroupAndMatchManager from "./pages/GroupConsoleManager";
import AdminDashboardPage from "./pages/admin/Dashboard";
import TeamMangerPage from "./pages/TeamManager";
import LogoutPage from "./pages/auth/Logout";
import TeamStatPage from "./pages/admin/TeamStat/index";
import MatchResultPoster from "./pages/MatchPlanche";
import AdminSettings from "./pages/AdminSettings";
import MatchAffichePage from "./pages/MatchAffiche";
import AddPlayerPage from "./pages/AddPlayerPage";
import TeamRosterPage from "./pages/TeamRosterPage";
import { LicenceCollectivePage } from "./pages/Licence/LicenceCollectivePage";
import CaissePage from "./pages/caisses";
import NotFound from "./pages/Notfound";
function AppRoutes() {
  return (
    <Routes>
  
        <Route path="/" element={<Home />} />
       
{/* <Route path="/" element={<div style={{color: 'white', padding: '20px'}}>Test Affichage iPad Réussi Merci !</div>} /> */}
        <Route path="/matchs" element={<MatchPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/classement" element={<RankingPage />} />
        <Route path="/:matchId/details" element={<CurrentMatchPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/match-gestion" element={<MatchConsoleManager />} />
        <Route path="/admin/equipes" element={<TeamMangerPage />} />
        <Route path="/admin/statistiques" element={<TeamStatPage />} />
        <Route path="/admin/equipe-gestion" element={<TeamCreationManager />} />
        <Route path="/admin/group-gestion" element={<GroupAndMatchManager />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/result" element={<MatchResultPoster />} />
        <Route path="/admin/parametres" element={<AdminSettings />} />
        <Route path="/admin/:matchId/affiches" element={<MatchAffichePage />} />
        <Route path="/:teamId/ajouter-joueur-staff" element={<AddPlayerPage />} />
        <Route path="/:teamId/licences/collectives" element={<LicenceCollectivePage />} />
        <Route path="/admin/:teamId/equipe-joueurs" element={<TeamRosterPage />} />
        <Route path="/admin/caisses" element={<CaissePage />} />
        <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;