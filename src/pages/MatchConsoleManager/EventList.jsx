// ==========================================
// COMPOSANT 7 : FIL DES ÉVÉNEMENTS
// ==========================================
import EventEditPanel from './EventEditPanel';
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
const EventList = ({ matchEvents, homeRoster, awayRoster, editingEventId, setEditingEventId, deleteEvent, handleSavedEditEvent }) => (
  <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4">
    <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase mb-3">Fil des événements</h3>
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {matchEvents.length === 0 ? (
        <p className="text-center py-6 text-zinc-600 text-xs font-medium">En attente d'événements de jeu...</p>
      ) : (
        matchEvents.map(ev => {
          const currentRoster = ev.teamSide === 'home' || ev.team === 'Dom.' ? homeRoster : awayRoster;
          const isEditing = editingEventId === ev.id;

          return (
            <div key={ev.id} className="space-y-1">
              <div
                onClick={() => setEditingEventId(isEditing ? null : ev.id)}
                className={`bg-zinc-950 border ${isEditing ? 'border-[#FFD700]' : 'border-zinc-850'} p-3 rounded-xl flex justify-between items-center text-xs group cursor-pointer hover:border-zinc-700 transition-all`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-zinc-900 text-[#FFD700] border border-zinc-800 px-1.5 py-0.5 rounded font-bold">{ev.time}</span>
                  <span className="text-zinc-500 font-semibold">[{ev.teamSide}]</span>
                  {ev.isSubstitution || ev.eventType === 'Changement' ? (
                    <span>
                      <b className="text-emerald-400">🟢 {ev.playerIn?.name || ev.playerIn?.nom}</b> remplace <b className="text-red-400">🔴 {ev.playerOut?.name || ev.playerOut?.nom}</b>
                    </span>
                  ) : (
                    <span>{ev.player?.name || ev.player?.nom} <b className="text-zinc-600 font-mono text-[11px]">(N°{ev.player?.dorsa})</b></span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-bold">{ev.eventType || ev.type}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }}
                    className="text-red-500 hover:text-red-400 transition-colors opacity-40 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <EventEditPanel
                  event={ev}
                  roster={currentRoster}
                  onCancel={() => setEditingEventId(null)}
                  onSave={handleSavedEditEvent}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default EventList;