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


function AppRoutes() {
  return (
    <Routes>
  
        <Route path="/" element={<Home />} />
        <Route path="/matchs" element={<MatchPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/classement" element={<RankingPage />} />
        <Route path="/:matchId/details" element={<CurrentMatchPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/match-gestion" element={<MatchConsoleManager />} />
        <Route path="/admin/equipes" element={<TeamMangerPage />} />
        <Route path="/admin/equipe-gestion" element={<TeamCreationManager />} />
        <Route path="/admin/group-gestion" element={<GroupAndMatchManager />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default AppRoutes;