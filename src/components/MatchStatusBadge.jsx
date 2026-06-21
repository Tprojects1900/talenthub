import React from 'react';
import { Radio, CalendarDays, CheckCircle2, XCircle, Calendar } from 'lucide-react';

export default function MatchStatusBadge({ status }) {
  // Passage en minuscules et nettoyage des espaces pour éviter les bugs de casse
  const normalizedStatus = String(status || '').trim().toLowerCase();

  switch (normalizedStatus) {
    case 'live':
    case 'en cours':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white font-bold text-sm rounded-xl uppercase tracking-wider shadow-sm select-none">
          {/* L'icône clignote grâce à animate-pulse */}
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Live</span>
        </div>
      );

    case 'half-time':
    case 'mi-temps':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white font-bold text-sm rounded-xl uppercase tracking-wider shadow-sm select-none">
          <CalendarDays className="w-4 h-4 animate-bounce" style={{ animationDuration: '2s' }} />
          <span>Mi-temps</span>
        </div>
      );

    case 'programmed':
    case 'bientôt':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm rounded-xl uppercase tracking-wider shadow-md select-none">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Programmé</span>
        </div>
      );

    case 'finished':
    case 'terminé':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-zinc-400 font-semibold text-sm rounded-xl uppercase tracking-wider border border-zinc-800 select-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Terminé</span>
        </div>
      );

    case 'cancelled':
    case 'annulé':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 text-zinc-600 border border-zinc-900 font-medium text-sm rounded-xl uppercase tracking-wider line-through select-none">
          <XCircle className="w-4 h-4 text-zinc-700" />
          <span>Annulé</span>
        </div>
      );

    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-400 font-medium text-sm rounded-xl uppercase tracking-wider border border-zinc-700 select-none">
          <span>{status || 'N/A'}</span>
        </div>
      );
  }
}