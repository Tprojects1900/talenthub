// ==========================================
// COMPOSANT 2 : LISTE ET RECHERCHE DE MATCHS
// ==========================================
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
import Loader from '../../components/Loader';
// import { filterMap } from '@apollo/client/utilities/internal';
const MatchList = ({ searchQuery, setSearchQuery, filteredMatches, selectedMatch, handleSelectMatch ,loading=false}) => (
  
 <div className="space-y-1.5 max-h-40 overflow-y-auto mt-3">
  {loading ? (
    <Loader />
  ) : (
    filteredMatches
      ?.filter(
        (m) =>
          m.status?.toLowerCase() !== "cancelled" &&
          m.status?.toLowerCase() !== "finished"
      )
      .map((m) => (
        <button
          key={m.id || m._id}
          onClick={() => handleSelectMatch(m)}
          className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${
            selectedMatch?.id === (m.id || m._id)
              ? "bg-[#FFD700]/10 border-[#FFD700] text-white"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-400"
          }`}
        >
          <span className="font-bold">
            {m.homeTeam?.nom || m.homeTeam?.name} 🆚{" "}
            {m.awayTeam?.nom || m.awayTeam?.name}
          </span>
          <ChevronRight size={14} />
        </button>
      ))
  )}
</div>
);

export default MatchList;







