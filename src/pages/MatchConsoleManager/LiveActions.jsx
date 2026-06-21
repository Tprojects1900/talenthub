// ==========================================
// COMPOSANT 5 : BOUTONS D'ACTIONS ACTIONS LIVE
// ==========================================
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
const LiveActions = ({ selectedMatch, matchStatus, openPlayerSelectModal, getLiveRosterBySide ,loading=false}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
      <p className="text-xs font-black text-blue-400 mb-2 border-l-2 border-blue-500 pl-2 uppercase">{selectedMatch.homeTeam?.nom || selectedMatch.homeTeam?.name}</p>
      <div className="grid grid-cols-2 gap-1.5">
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('But ⚽', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold hover:border-zinc-700 disabled:opacity-30">⚽ But</button>
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('Carton Jaune 🟨', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-yellow-500 disabled:opacity-30">🟨 Jaune</button>
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('Carton Rouge 🟥', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-30">🟥 Rouge</button>
        <button
          disabled={matchStatus !== 'live' || loading || !getLiveRosterBySide('home').some(p => p.role === 'Remplaçant')}
          onClick={() => openPlayerSelectModal('Changement', 'home')}
          className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-30 flex items-center justify-between"
        >
          <span>🔄 Remplacer</span>
        </button>
      </div>
    </div>

    <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
      <p className="text-xs font-black text-orange-400 mb-2 border-l-2 border-orange-500 pl-2 uppercase">{selectedMatch.awayTeam?.nom || selectedMatch.awayTeam?.name}</p>
      <div className="grid grid-cols-2 gap-1.5">
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('But ⚽', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold hover:border-zinc-700 disabled:opacity-30">⚽ But</button>
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('Carton Jaune 🟨', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-yellow-500 disabled:opacity-30">🟨 Jaune</button>
        <button disabled={matchStatus !== 'live' || loading} onClick={() => openPlayerSelectModal('Carton Rouge 🟥', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-30">🟥 Rouge</button>
        <button
          disabled={matchStatus !== 'live' || loading || !getLiveRosterBySide('away').some(p => p.role === 'Remplaçant')}
          onClick={() => openPlayerSelectModal('Changement', 'away')}
          className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-30 flex items-center justify-between"
        >
          <span>🔄 Remplacer</span>
        </button>
      </div>
    </div>
  </div>
);
export default LiveActions;