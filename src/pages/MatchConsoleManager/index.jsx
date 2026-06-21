// ==========================================
// COMPOSANT UNIQUE : COMPOSANT PRINCIPAL
// ==========================================

import React, { useEffect, useState } from 'react';
import { useMatchConsole } from './hook';
import {
  Play, Clock, X, Trash2, ChevronRight, User, Users, AlertTriangle, ArrowRightLeft, CheckCircle, Edit3, RotateCcw
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import UserSelect from '../../components/UserSelect';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import MatchList from './MatchList';
import LiveActions from './LiveActions';
import SubstitutionConfig from './Sub';
import TimerPanel from './TimerPanel';
import EventEditPanel from './EventEditPanel';
import RosterButtons from './RosterButtons';
import EventList from './EventList';
import MatchStatusBadge from '../../components/MatchStatusBadge';

const MatchConsoleManager = () => {
  const {
    selectedMatch, handleSelectMatch, searchQuery, setSearchQuery, filteredMatches,
    matchStatus, seconds, isActive, formatTime, matchEvents, openPlayerSelectModal,
    eventTriggerConfig, setEventTriggerConfig, submitStandardEvent, submitMultipleSubstitutionEvents,
    deleteEvent, isModalOpen, setIsModalOpen, activeTeamType, setActiveTeamType,
    formType, setFormType, assignmentForm, setAssignmentForm, homeRoster, awayRoster,
    isHomeSaved, isAwaySaved, currentProvisionalList, currentStats, availableUsersFromDb,
    addMemberToProvisionalList, removeMemberFromProvisionalList, saveFinalRoster,event_droped,
    getLiveRosterBySide, updateMatchEvent, roster_added, switchMode, add_stan, add_sub,handleCloseEventDrop,handleDropOpen,eventDropId,eventShow  } = useMatchConsole();

  const [editingEventId, setEditingEventId] = useState(null);
  const [multipleSubsOut, setMultipleSubsOut] = useState([]);
  const [multipleSubsIn, setMultipleSubsIn] = useState([]);
  const [openFinished, setOpenFinished] = useState(false);

  const closeActionPanel = () => {
    setEventTriggerConfig(null);
    setMultipleSubsOut([]);
    setMultipleSubsIn([]);
  };

  const handleDynamicPlayerClick = (player, eventType) => {
    if (eventType !== 'Changement') {
      submitStandardEvent(player);
      return;
    }

    const playerId = player.playerId || player.id;
    const isOut = player.role?.includes('Titulaire');

    if (isOut) {
      if (multipleSubsOut.some(p => (p.playerId || p.id) === playerId)) {
        setMultipleSubsOut(multipleSubsOut.filter(p => (p.playerId || p.id) !== playerId));
      } else {
        setMultipleSubsOut([...multipleSubsOut, player]);
      }
    } else {
      if (multipleSubsOut.length === 0) return;
      if (multipleSubsIn.some(p => (p.playerId || p.id) === playerId)) {
        setMultipleSubsIn(multipleSubsIn.filter(p => (p.playerId || p.id) !== playerId));
      } else {
        if (multipleSubsIn.length >= multipleSubsOut.length) return;
        setMultipleSubsIn([...multipleSubsIn, player]);
      }
    }
  };

  const handleSavedEditEvent = (updatedData) => {
    if (updatedData.isDeleted) deleteEvent(updatedData.id);
    else if (updateMatchEvent) updateMatchEvent(updatedData);
    setEditingEventId(null);
  };

  

  return (
    <AdminLayout>
      <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 font-sans">
        
        {/* HEADER */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 mb-6 gap-4">
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-zinc-100">
              Console FME Pro <span className="text-[#FFD700]">• Relations Joueurs & Match</span>
            </h1>
            <p className="text-xs text-zinc-500">Flux temps réel sécurisé avec contrôle strict des cartons et remplacements.</p>
          </div>
          {selectedMatch && (
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-[#FFD700]">
             <MatchStatusBadge 
             status={matchStatus}
             />
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE */}
          <div className="space-y-6 lg:col-span-1">
            <MatchList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredMatches={filteredMatches}
              selectedMatch={selectedMatch}
              handleSelectMatch={handleSelectMatch}
            />

            {selectedMatch && (
              <RosterButtons
                selectedMatch={selectedMatch}
                homeRoster={homeRoster}
                awayRoster={awayRoster}
                isHomeSaved={isHomeSaved}
                isAwaySaved={isAwaySaved}
                openModal={(side) => { setActiveTeamType(side); setFormType('joueur'); setIsModalOpen(true); }}
              />
            )}
          </div>

          {/* CONSOLE CENTRALE */}
          <div className="lg:col-span-2 space-y-6">
            {selectedMatch ? (
              <>
                <TimerPanel
                  seconds={seconds}
                  formatTime={formatTime}
                  matchStatus={matchStatus}
                  isHomeSaved={isHomeSaved}
                  isAwaySaved={isAwaySaved}
                  switchMode={switchMode}
                  onFinishClick={() => setOpenFinished(true)}
                />

                <LiveActions
                  selectedMatch={selectedMatch}
                  matchStatus={matchStatus}
                  openPlayerSelectModal={openPlayerSelectModal}
                  getLiveRosterBySide={getLiveRosterBySide}
                  loading={add_stan || add_sub}
                />

                {eventTriggerConfig && (
                  <SubstitutionConfig
                    config={eventTriggerConfig}
                    closePanel={closeActionPanel}
                    subsOut={multipleSubsOut}
                    subsIn={multipleSubsIn}
                    playersList={getLiveRosterBySide(eventTriggerConfig.teamSide)}
                    onPlayerClick={handleDynamicPlayerClick}
                    onSubmit={() => { submitMultipleSubstitutionEvents(multipleSubsOut, multipleSubsIn); closeActionPanel(); }}
                    loading={add_stan || add_sub}
                  />
                )}

                <EventList
                  matchEvents={matchEvents}
                  homeRoster={homeRoster}
                  awayRoster={awayRoster}
                  editingEventId={editingEventId}
                  setEditingEventId={setEditingEventId}
                  deleteEvent={handleDropOpen}
                  handleSavedEditEvent={handleSavedEditEvent}
                />
              </>
            ) : (
              <div className="h-44 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 text-xs">
                Veuillez sélectionner une rencontre dans la colonne de gauche.
              </div>
            )}
          </div>
        </div>

        {/* MODAL CONFIGURATION EFFECTIF */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-zinc-900 border border-zinc-850 w-full max-w-lg rounded-2xl shadow-2xl p-5 flex flex-col max-h-[90vh]">
              <div className="border-b border-zinc-800 pb-3 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">
                    Fiche : {activeTeamType === 'home' ? (selectedMatch?.homeTeam?.nom || selectedMatch?.homeTeam?.name) : (selectedMatch?.awayTeam?.nom || selectedMatch?.awayTeam?.name)}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
                </div>

                <div className="flex gap-4 bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                  <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold transition-all select-none">
                    <input type="radio" name="formType" value="joueur" checked={formType === 'joueur'} onChange={(e) => { setFormType(e.target.value); setAssignmentForm({ ...assignmentForm, matchStatus: 'Titulaire' }); }} className="accent-[#FFD700]" />
                    <span className={formType === 'joueur' ? 'text-[#FFD700]' : 'text-zinc-500'}>Joueurs</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold transition-all select-none">
                    <input type="radio" name="formType" value="staff" checked={formType === 'staff'} onChange={(e) => { setFormType(e.target.value); setAssignmentForm({ ...assignmentForm, matchStatus: 'Staff' }); }} className="accent-[#FFD700]" />
                    <span className={formType === 'staff' ? 'text-[#FFD700]' : 'text-zinc-500'}>Staff Technique</span>
                  </label>
                </div>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Sélectionner un nom</label>
                    <UserSelect
                      key={assignmentForm.userId}
                      users={availableUsersFromDb}
                      value={assignmentForm.userId}
                      onChange={(id) => setAssignmentForm({ ...assignmentForm, userId: id })}
                    />
                  </div>

                  {formType === 'joueur' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Dossard N°</label>
                        <input type="number" placeholder="Ex: 10" value={assignmentForm.dorsa} onChange={(e) => setAssignmentForm({ ...assignmentForm, dorsa: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg text-center font-bold outline-none text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Statut Initial</label>
                        <select value={assignmentForm.matchStatus} onChange={(e) => setAssignmentForm({ ...assignmentForm, matchStatus: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg font-bold text-zinc-200 outline-none">
                          <option value="Titulaire">Titulaire</option>
                          <option value="Remplaçant">Remplaçant</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end"><div className="w-full text-center bg-zinc-900/60 p-2 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 font-semibold">Sur le Banc Technique</div></div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button onClick={addMemberToProvisionalList} className="w-full sm:w-auto px-5 py-2 bg-[#FFD700] text-black font-black text-xs uppercase rounded-lg tracking-wide shadow">Ajouter à l'effectif</button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2.5 border border-zinc-850 rounded-xl mb-3 text-center text-xs">
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase">Titulaires</p>
                  <p className={`font-black text-sm ${currentStats.titulaireCount === 11 ? 'text-emerald-400' : 'text-zinc-300'}`}>{currentStats.titulaireCount} <span className="text-[10px] text-zinc-600">/ 11</span></p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase">Remplaçants</p>
                  <p className="font-black text-zinc-300 text-sm">{currentStats.remplacantCount}</p>
                </div>
                <div>
                  <p className="text-[#FFD700] text-[10px] font-bold uppercase">Total</p>
                  <p className="font-black text-sm text-zinc-200">{currentStats.totalJoueurs} <span className="text-[10px] text-zinc-600">/ 20</span></p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-900">
                {currentProvisionalList.length === 0 ? (
                  <p className="text-center py-6 text-zinc-600 text-xs font-medium">Aucun membre.</p>
                ) : (
                  currentProvisionalList.map((p, index) => {
                    const pId = p.playerId || p.id;
                    
                    // Détection si le joueur a déjà été lié à un événement standard ou une substitution
                    const hasEvents = matchEvents?.some(ev => {
                      const isDirectPlayer = (ev.player?.id || ev.player?.playerId) === pId;
                      const isSubOut = (ev.playerOut?.id || ev.playerOut?.playerId) === pId;
                      const isSubIn = (ev.playerIn?.id || ev.playerIn?.playerId) === pId;
                      return isDirectPlayer || isSubOut || isSubIn;
                    });

                    return (
                      <div key={pId || index} className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                            <User size={12} className="text-zinc-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-200 truncate">{p.nom}</p>
                            <p className="text-[10px] text-zinc-500">Statut : {p.matchStatus}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-[11px] font-bold text-zinc-400 border border-zinc-800">
                            {p.dorsa === 'Staff' ? '💼 Staff' : `N° ${p.dorsa}`}
                          </span>
                          
                          {/* Affichage conditionnel : Le bouton s'efface si hasEvents est vrai */}
                          {!hasEvents ? (
                            <button onClick={() => removeMemberFromProvisionalList(p)} className="text-red-500 hover:text-red-400 p-1">
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-600 bg-zinc-900/50 border border-zinc-850 px-1.5 py-0.5 rounded font-medium select-none">
                              Inscrit
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-850 pt-3 mt-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-bold">Annuler</button>
                <button onClick={saveFinalRoster} disabled={roster_added} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase">{roster_added ? "En cours..." : "Valider la composition"}</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {openFinished && (
        <ConfirmationModal
          isOpen={openFinished}
          onClose={() => setOpenFinished(false)}
          message="Voulez-vous vraiment siffler la fin définitive du match ?"
          title="Fin du match"
          confirmLabel="fin du match"
          onConfirm={() => { switchMode('finished'); setOpenFinished(false); }}
        />
      )}

         {eventShow && (
        <ConfirmationModal
          isOpen={eventShow}
          onClose={() => handleCloseEventDrop()}
          message="Voulez-vous vraiment supprimer cet évènement ?"
          title="Suppression d'évènement"
          confirmLabel="Suppression"
          onConfirm={() => {deleteEvent()}}
          loading={event_droped}
        />
      )}
    </AdminLayout>
  );
};

export default MatchConsoleManager;