// ==========================================
// COMPOSANT 4 : BLOC CHRONOMÈTRE CENTRALE
// ==========================================
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
const TimerPanel = ({ seconds, formatTime, matchStatus, isHomeSaved, isAwaySaved, switchMode, onFinishClick }) => (
  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 text-center">
    <div className="font-mono text-4xl font-black text-zinc-100 flex items-center justify-center gap-2">
      <Clock className="text-[#FFD700]" size={28} /> {formatTime(seconds)}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
      <button
        disabled={(!isHomeSaved || !isAwaySaved) || matchStatus !== 'programmed'}
        onClick={() => switchMode('live')}
        className="py-2 bg-[#FFD700] text-black font-black text-xs rounded-lg uppercase tracking-wide disabled:opacity-20 transition-all"
      >
        Démarrer
      </button>

      <button
        disabled={matchStatus !== 'live'}
        onClick={() => switchMode('half-time')}
        className="py-2 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-lg uppercase disabled:opacity-20 transition-all"
      >
        Mi-temps
      </button>

      <button
        disabled={matchStatus !== 'half-time'}
        onClick={() => switchMode('live')}
        className="py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg uppercase disabled:opacity-20 transition-all"
      >
        Reprendre
      </button>

      <button
        disabled={matchStatus !== 'live' && matchStatus !== 'half-time'}
        onClick={onFinishClick}
        className="py-2 bg-red-600 text-white font-bold text-xs rounded-lg uppercase disabled:opacity-20 transition-all"
      >
        Fin Match
      </button>
    </div>
  </div>
);
export default TimerPanel