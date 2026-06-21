// ==========================================
// COMPOSANT 3 : ACCÈS FEUILLES DE MATCH
// ==========================================
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
const RosterButtons = ({ selectedMatch, homeRoster, awayRoster, isHomeSaved, isAwaySaved, openModal }) => (
  <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 space-y-3">
    <h2 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
      <Users size={12} /> Feuilles de Matchs
    </h2>
    <div className="space-y-2">
      <button onClick={() => openModal('home')} className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center ${isHomeSaved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800'}`}>
        <div>
          <p className="font-bold text-zinc-300">{selectedMatch.homeTeam?.nom || selectedMatch.homeTeam?.name}</p>
          <span className="text-[10px] text-zinc-500">{homeRoster.length} joueur(s) / membres</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isHomeSaved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-950 text-zinc-500'}`}>{isHomeSaved ? 'Prêt' : 'À remplir'}</span>
      </button>

      <button onClick={() => openModal('away')} className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center ${isAwaySaved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800'}`}>
        <div>
          <p className="font-bold text-zinc-300">{selectedMatch.awayTeam?.nom || selectedMatch.awayTeam?.name}</p>
          <span className="text-[10px] text-zinc-500">{awayRoster.length} joueur(s) / membres</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isAwaySaved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-950 text-zinc-500'}`}>{isAwaySaved ? 'Prêt' : 'À remplir'}</span>
      </button>
    </div>
  </div>
);

export default RosterButtons;