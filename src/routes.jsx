import React from "react";
import { Switch, Route } from "react-router-dom";

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
    <Switch>

      <Route exact path="/" component={Home} />

      <Route path="/matchs" component={MatchPage} />

      <Route path="/equipes" component={TeamsPage} />

      <Route path="/classement" component={RankingPage} />

      <Route path="/:matchId/details" component={CurrentMatchPage} />

      <Route path="/logout" component={LogoutPage} />

      <Route path="/login" component={AdminLogin} />

      <Route path="/admin/match-gestion" component={MatchConsoleManager} />

      <Route path="/admin/equipes" component={TeamMangerPage} />

      <Route path="/admin/statistiques" component={TeamStatPage} />

      <Route path="/admin/equipe-gestion" component={TeamCreationManager} />

      <Route path="/admin/group-gestion" component={GroupAndMatchManager} />

      <Route path="/dashboard" component={AdminDashboardPage} />

      <Route path="/result" component={MatchResultPoster} />

      <Route path="/admin/parametres" component={AdminSettings} />

      <Route path="/admin/:matchId/affiches" component={MatchAffichePage} />

      <Route path="/:teamId/ajouter-joueur-staff" component={AddPlayerPage} />

      <Route path="/:teamId/licences/collectives" component={LicenceCollectivePage} />

      <Route path="/admin/:teamId/equipe-joueurs" component={TeamRosterPage} />

      <Route path="/admin/caisses" component={CaissePage} />

      <Route component={NotFound} />

    </Switch>
  );
}

export default AppRoutes;