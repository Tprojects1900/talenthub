// ==========================================
// COMPOSANT 2 : LISTE ET RECHERCHE DE MATCHS
// ==========================================
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
const MatchList = ({ searchQuery, setSearchQuery, filteredMatches, selectedMatch, handleSelectMatch }) => (
  <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4">
    <input
      type="text" placeholder="Rechercher match..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#FFD700] placeholder-zinc-700"
    />
    <div className="space-y-1.5 max-h-40 overflow-y-auto mt-3">
      {filteredMatches.map(m => (
        <button
          key={m.id || m._id}
          onClick={() => handleSelectMatch(m)}
          className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${selectedMatch?.id === (m.id || m._id) ? 'bg-[#FFD700]/10 border-[#FFD700] text-white' : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'}`}
        >
          <span className="font-bold">{m.homeTeam?.nom || m.homeTeam?.name} 🆚 {m.awayTeam?.nom || m.awayTeam?.name}</span>
          <ChevronRight size={14} />
        </button>
      ))}
    </div>
  </div>
);

export default MatchList;







