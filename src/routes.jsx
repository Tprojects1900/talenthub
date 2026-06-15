import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { MatchPage } from "./pages/Match";
import TeamsPage from "./pages/Teams";
import RankingPage from "./pages/Ranking";
import CurrentMatchPage from "./pages/CurrentMatch";

function AppRoutes() {
  return (
    <Routes>
  
        <Route path="/" element={<Home />} />
        <Route path="/matchs" element={<MatchPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/classement" element={<RankingPage />} />
        <Route path="/details" element={<CurrentMatchPage />} />
    </Routes>
  );
}

export default AppRoutes;