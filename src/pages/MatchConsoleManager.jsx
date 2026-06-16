import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Search, Eye, 
  CheckCircle, Plus, Trash2, ChevronRight, X, Clock, ArrowRightLeft, Edit3
} from 'lucide-react';

const MatchConsoleManager = () => {
  // --- ÉTATS PRINCIPAUX ---
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchStatus, setMatchStatus] = useState('En attente'); 
  
  // --- CHRONOMÈTRE (MINUTEUR) ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const increment = useRef(null);

  // --- FEUILLES DE MATCH (FICHE ÉLECTRONIQUE) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTeamType, setActiveTeamType] = useState('home'); 
  const [previewMode, setPreviewMode] = useState(false);
  
  const [playerForm, setPlayerForm] = useState({ name: '', dorsa: '', role: 'Titulaire' }); 
  const [homeRoster, setHomeRoster] = useState([]);
  const [awayRoster, setAwayRoster] = useState([]);
  const [isHomeRosterSaved, setIsHomeRosterSaved] = useState(false);
  const [isAwayRosterSaved, setIsAwayRosterSaved] = useState(false);

  // --- ÉVÉNEMENTS DU MATCH ---
  const [matchEvents, setMatchEvents] = useState([]);

  // --- ÉTATS DU MODAL D'ÉVÉNEMENT LIVE & FLUX DE REMPLACEMENT CREATION ---
  const [eventTriggerConfig, setEventTriggerConfig] = useState(null); 
  const [substitutionIn, setSubstitutionIn] = useState(null);  
  const [substitutionOut, setSubstitutionOut] = useState(null); 

  // --- NOUVEAUX ÉTATS : ÉDITION / REJET D'UN ÉVÉNEMENT EXISTANT ---
  const [editingEvent, setEditingEvent] = useState(null); // Stocke l'événement complet en cours de modification
  const [editSubIn, setEditSubIn] = useState(null);       // Modif temporaire entrant
  const [editSubOut, setEditSubOut] = useState(null);     // Modif temporaire sortant

  // --- SIMULATION DE BASE DE DONNÉES DE MATCHS ---
  const mockMatches = [
    { id: 1, home: "Lomé FC", away: "Maritime Stars", type: "1/2 Finale", date: "Aujourd'hui" },
    { id: 2, home: "Kara AS", away: "Kloto United", type: "1/4 Finale", date: "Demain" }
  ];

  const filteredMatches = mockMatches.filter(m => 
    m.home.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.away.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LOGIQUE DU CHRONOMÈTRE ---
  useEffect(() => {
    if (isActive) {
      increment.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(increment.current);
    }
    return () => clearInterval(increment.current);
  }, [isActive]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // --- OUVERTURE DE LA SÉLECTION D'UN ÉVÉNEMENT NEUF ---
  const openPlayerSelectModal = (type, teamSide) => {
    setSubstitutionIn(null);
    setSubstitutionOut(null);
    setEventTriggerConfig({ type, teamSide, eventTime: formatTime(seconds) });
  };

  // --- SELECTION JOUEUR (CREATION) ---
  const handlePlayerSelection = (player) => {
    if (!eventTriggerConfig) return;
    if (eventTriggerConfig.type === 'Changement') {
      if (!substitutionIn) {
        if (player.role === 'Remplaçant') setSubstitutionIn(player);
      } else if (!substitutionOut) {
        if (player.role === 'Titulaire') setSubstitutionOut(player);
      }
      return;
    }
    submitStandardEvent(player);
  };

  const submitStandardEvent = (player) => {
    const newEvent = {
      id: Date.now(), // ID unique pour cibler la modification future
      time: eventTriggerConfig.eventTime,
      eventType: eventTriggerConfig.type,
      teamSide: eventTriggerConfig.teamSide,
      team: eventTriggerConfig.teamSide === 'home' ? selectedMatch.home : selectedMatch.away,
      player: { id: player.id, name: player.name, dorsa: player.dorsa || 'N/A', role: player.role }
    };
    setMatchEvents([newEvent, ...matchEvents]);
    setEventTriggerConfig(null);
  };

  const submitSubstitutionEvent = () => {
    if (!substitutionIn || !substitutionOut || !eventTriggerConfig) return;

    const subEvent = {
      id: Date.now(),
      time: eventTriggerConfig.eventTime,
      eventType: '🔄 Remplacement',
      teamSide: eventTriggerConfig.teamSide,
      team: eventTriggerConfig.teamSide === 'home' ? selectedMatch.home : selectedMatch.away,
      isSubstitution: true,
      playerIn: substitutionIn,
      playerOut: substitutionOut
    };

    updateRosterRoles(eventTriggerConfig.teamSide, substitutionIn.id, substitutionOut.id);
    setMatchEvents([subEvent, ...matchEvents]);
    setSubstitutionIn(null);
    setSubstitutionOut(null);
    setEventTriggerConfig(null);
  };

  // Met à jour les rôles des joueurs sur le terrain
  const updateRosterRoles = (teamSide, incomingId, outgoingId) => {
    const process = (roster) => roster.map(p => {
      if (p.id === incomingId) return { ...p, role: 'Titulaire (Entré)' };
      if (p.id === outgoingId) return { ...p, role: 'Remplacé' };
      return p;
    });
    if (teamSide === 'home') setHomeRoster(process(homeRoster));
    else setAwayRoster(process(awayRoster));
  };

  // --- LOGIQUE DE PREPARATION A L'ÉDITION D'UN FLUX ---
  const openEditEventModal = (ev) => {
    setEditingEvent(ev);
    if (ev.isSubstitution) {
      setEditSubIn(ev.playerIn);
      setEditSubOut(ev.playerOut);
    }
  };

  // --- ENREGISTRER LES MODIFICATIONS D'UN EVÉNEMENT EN DIRECT ---
  const saveEditedEvent = () => {
    const updatedEvents = matchEvents.map(ev => {
      if (ev.id === editingEvent.id) {
        if (ev.isSubstitution) {
          // Si le changement a changé d'acteurs, on rétablit l'ancien et on applique le nouveau
          revertRosterRoles(ev.teamSide, ev.playerIn.id, ev.playerOut.id);
          updateRosterRoles(ev.teamSide, editSubIn.id, editSubOut.id);
          return { ...ev, playerIn: editSubIn, playerOut: editSubOut };
        } else {
          return { ...editingEvent }; // Sauvegarde l'événement classique modifié
        }
      }
      return ev;
    });
    setMatchEvents(updatedEvents);
    setEditingEvent(null);
  };

  // --- REJETER / SUPPRIMER UNE ACTION ---
  const rejectEvent = (eventId) => {
    const targetEvent = matchEvents.find(ev => ev.id === eventId);
    if (targetEvent && targetEvent.isSubstitution) {
      // Si on rejette un changement, les joueurs reprennent leurs places initiales sur le banc / terrain
      revertRosterRoles(targetEvent.teamSide, targetEvent.playerIn.id, targetEvent.playerOut.id);
    }
    setMatchEvents(matchEvents.filter(ev => ev.id !== eventId));
    setEditingEvent(null);
  };

  const revertRosterRoles = (teamSide, incomingId, outgoingId) => {
    const process = (roster) => roster.map(p => {
      if (p.id === incomingId) return { ...p, role: 'Remplaçant' };
      if (p.id === outgoingId) return { ...p, role: 'Titulaire' };
      return p;
    });
    if (teamSide === 'home') setHomeRoster(process(homeRoster));
    else setAwayRoster(process(awayRoster));
  };

  // --- GESTION DU STATUT DU MATCH ---
  const handleToggleStatus = (newStatus) => {
    setMatchStatus(newStatus);
    if (newStatus === 'En cours') setIsActive(true);
    else setIsActive(false);
  };

  // --- FEUILLE DE MATCH AJOUT ---
  const addPlayerToRoster = () => {
    if (!playerForm.name) return;
    const item = { ...playerForm, id: Date.now() };
    if (activeTeamType === 'home') setHomeRoster([...homeRoster, item]);
    else setAwayRoster([...awayRoster, item]);
    setPlayerForm({ name: '', dorsa: '', role: 'Titulaire' }); 
  };

  const removePlayerFromRoster = (id) => {
    if (activeTeamType === 'home') setHomeRoster(homeRoster.filter(p => p.id !== id));
    else setAwayRoster(awayRoster.filter(p => p.id !== id));
  };

  const saveRoster = () => {
    if (activeTeamType === 'home') setIsHomeRosterSaved(true);
    if (activeTeamType === 'away') setIsAwayRosterSaved(true);
    setIsModalOpen(false);
  };

  const canStartMatch = isHomeRosterSaved && isAwayRosterSaved;
  const currentLiveRoster = eventTriggerConfig ? (eventTriggerConfig.teamSide === 'home' ? homeRoster : awayRoster) : [];
  const editingRoster = editingEvent ? (editingEvent.teamSide === 'home' ? homeRoster : awayRoster) : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-3 sm:p-6 pb-24">
      
      {/* 1. TOP HEADER MANAGER */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-white">
            Console Live <span className="text-[#FFD700]">Arbitrage & Edition</span>
          </h1>
          <p className="text-xs text-zinc-400">Cliquez directement sur un flux enregistré pour le corriger.</p>
        </div>
        {selectedMatch && (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase">{selectedMatch.type}</span>
            <span className="text-sm font-mono font-bold text-[#FFD700]">{matchStatus}</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= COLONNE GAUCHE ================= */}
        <div className="space-y-6 lg:col-span-1">
          {/* RECHERCHE DU MATCH */}
          <div className="bg-zinc-900/80 border border-zinc-850 rounded-2xl p-4">
            <input 
              type="text" placeholder="Chercher une équipe..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#FFD700]"
            />
            <div className="space-y-2 max-h-40 overflow-y-auto mt-3">
              {filteredMatches.map(m => (
                <button key={m.id} onClick={() => { setSelectedMatch(m); setMatchStatus('En attente'); setSeconds(0); setMatchEvents([]); }} className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center ${selectedMatch?.id === m.id ? 'bg-[#FFD700]/10 border-[#FFD700]' : 'bg-zinc-950/40 border-zinc-850'}`}>
                  <span className="font-bold">{m.home} 🆚 {m.away}</span>
                  <ChevronRight size={14} className="text-[#FFD700]" />
                </button>
              ))}
            </div>
          </div>

          {/* FICHES ÉLECTRONIQUES */}
          {selectedMatch && (
            <div className="bg-zinc-900/80 border border-zinc-850 rounded-2xl p-4 space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Compositions</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setActiveTeamType('home'); setIsModalOpen(true); }} className={`p-3 rounded-xl border text-left text-xs ${isHomeRosterSaved ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-850'}`}>
                  <p className="font-bold truncate">{selectedMatch.home}</p>
                  <span className="text-[10px] text-zinc-500">{isHomeRosterSaved ? '✓ Enregistrée' : '• À saisir'}</span>
                </button>
                <button onClick={() => { setActiveTeamType('away'); setIsModalOpen(true); }} className={`p-3 rounded-xl border text-left text-xs ${isAwayRosterSaved ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-850'}`}>
                  <p className="font-bold truncate">{selectedMatch.away}</p>
                  <span className="text-[10px] text-zinc-500">{isAwayRosterSaved ? '✓ Enregistrée' : '• À saisir'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= CONSOLE CENTRALE ================= */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMatch ? (
            <>
              {/* CHRONOMETRE */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center">
                <div className="font-mono text-5xl font-black text-white px-6 py-2 rounded-2xl flex items-center justify-center gap-3">
                  <Clock className="text-[#FFD700]" size={36} /> {formatTime(seconds)}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  <button disabled={!canStartMatch || matchStatus === 'En cours'} onClick={() => handleToggleStatus('En cours')} className="py-2.5 bg-[#FFD700] text-black font-extrabold text-xs rounded-xl uppercase disabled:opacity-30">Démarrer</button>
                  <button disabled={matchStatus !== 'En cours'} onClick={() => handleToggleStatus('Mi-temps')} className="py-2.5 bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl uppercase disabled:opacity-30">Pause</button>
                  <button disabled={matchStatus !== 'Mi-temps'} onClick={() => handleToggleStatus('En cours')} className="py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl uppercase disabled:opacity-30">Reprendre</button>
                  <button disabled={matchStatus === 'En attente' || matchStatus === 'Terminé'} onClick={() => handleToggleStatus('Terminé')} className="py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl uppercase disabled:opacity-30">Fin Match</button>
                </div>
              </div>

              {/* ACTIONNEURS LIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Domicile */}
                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                  <p className="text-xs font-black uppercase text-zinc-400 mb-2 border-l-2 border-blue-500 pl-2">{selectedMatch.home}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('But', 'home')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold disabled:opacity-35">⚽ But</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Jaune', 'home')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold text-yellow-400 disabled:opacity-35">🟨 Jaune</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Rouge', 'home')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-35">🟥 Rouge</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Changement', 'home')} className="p-3 bg-zinc-900 border border-emerald-500/30 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-35">🔄 Remplacer</button>
                  </div>
                </div>

                {/* Extérieur */}
                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                  <p className="text-xs font-black uppercase text-zinc-400 mb-2 border-l-2 border-orange-500 pl-2">{selectedMatch.away}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('But', 'away')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold disabled:opacity-35">⚽ But</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Jaune', 'away')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold text-yellow-400 disabled:opacity-35">🟨 Jaune</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Rouge', 'away')} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-35">🟥 Rouge</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Changement', 'away')} className="p-3 bg-zinc-900 border border-emerald-500/30 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-35">🔄 Remplacer</button>
                  </div>
                </div>
              </div>

              {/* FIL DES EVENEMENTS INTERACTIF (CLIQUEZ POUR MODIFIER) */}
              <div className="bg-zinc-900/80 border border-zinc-850 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Flux Réel Événementiel</h3>
                  <span className="text-[10px] text-zinc-500 font-medium">💡 Cliquez sur un flux pour corriger</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matchEvents.length === 0 ? (
                    <p className="text-center py-6 text-zinc-600 text-xs">Aucun événement enregistré.</p>
                  ) : (
                    matchEvents.map((ev) => (
                      <div 
                        key={ev.id} 
                        onClick={() => openEditEventModal(ev)}
                        className="bg-zinc-950 hover:bg-zinc-900 p-3 rounded-xl border border-zinc-850 hover:border-[#FFD700]/60 flex justify-between items-center text-xs cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-zinc-900 text-[#FFD700] px-1.5 py-0.5 rounded border border-zinc-800 font-bold">{ev.time}</span>
                          <span className="text-zinc-500 font-bold">[{ev.team}]</span>
                          
                          {ev.isSubstitution ? (
                            <span className="text-zinc-200">
                              <b className="text-emerald-400">🟢 {ev.playerIn.name}</b> remplace <b className="text-red-400">🔴 {ev.playerOut.name}</b>
                            </span>
                          ) : (
                            <span className="text-white font-medium">
                              {ev.player.name} <span className="text-zinc-500 text-[11px]">(N°{ev.player.dorsa})</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 group-hover:text-[#FFD700] transition-colors">{ev.eventType}</span>
                          <Edit3 size={12} className="text-zinc-600 group-hover:text-[#FFD700] opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-48 bg-zinc-900/30 border border-dashed border-zinc-850 rounded-2xl flex items-center justify-center text-zinc-500 text-xs">Veuillez sélectionner un match à gauche.</div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NOUVEAU MODAL CRUCIAL : REJET OU ÉDITION DU FLUX D'ACTION CLIQUÉ */}
      {/* ========================================================================= */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-5 flex flex-col max-h-[85vh]">
            
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded border border-[#FFD700]/20 uppercase">
                  Correction d'Action • {editingEvent.time}
                </span>
                <h3 className="text-sm font-black text-white mt-1">
                  Modifier le flux : {editingEvent.eventType}
                </h3>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              
              {/* CAS 1 : MODIFICATION D'UN REMPLACEMENT 🔄 */}
              {editingEvent.isSubstitution ? (
                <div className="space-y-4">
                  {/* Changer l'Entrant */}
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">Modifier le joueur qui ENTRE (Banc)</label>
                    <select 
                      value={editSubIn?.id || ''} 
                      onChange={(e) => setEditSubIn(editingRoster.find(p => p.id === parseInt(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2.5 rounded-xl text-white"
                    >
                      {editingRoster.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Maillot N°{p.dorsa} - {p.role})</option>
                      ))}
                    </select>
                  </div>

                  {/* Changer le Sortant */}
                  <div>
                    <label className="block text-[10px] font-bold text-red-400 uppercase mb-1">Modifier le joueur qui SORT (Terrain)</label>
                    <select 
                      value={editSubOut?.id || ''} 
                      onChange={(e) => setEditSubOut(editingRoster.find(p => p.id === parseInt(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2.5 rounded-xl text-white"
                    >
                      {editingRoster.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Maillot N°{p.dorsa} - {p.role})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* CAS 2 : MODIFICATION D'UN EVENEMENT TRADITIONNEL (But, Cartons) */
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Réattribuer cette action au joueur / staff :</label>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {editingRoster.map((player) => {
                      const isTarget = editingEvent.player?.id === player.id;
                      return (
                        <button
                          key={player.id}
                          onClick={() => setEditingEvent({
                            ...editingEvent,
                            player: { id: player.id, name: player.name, dorsa: player.dorsa, role: player.role }
                          })}
                          className={`w-full text-left p-3 rounded-xl text-xs border flex items-center justify-between ${
                            isTarget ? 'bg-[#FFD700]/10 border-[#FFD700] text-white font-bold' : 'bg-zinc-950 border-zinc-850 text-zinc-400'
                          }`}
                        >
                          <span>{player.name} <b className="text-zinc-500 font-mono ml-1">N°{player.dorsa}</b></span>
                          <span className="text-[10px] uppercase font-bold text-zinc-500">{player.role}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* BARRE DE CONTROLE : REJET COMPLET OU VALIDATION DES CHANGEMENTS */}
            <div className="border-t border-zinc-800 pt-3 mt-4 space-y-2">
              <button
                onClick={saveEditedEvent}
                className="w-full py-2.5 bg-[#FFD700] text-black font-black text-xs uppercase rounded-xl tracking-wider hover:bg-[#ffe240]"
              >
                Confirmer la modification du flux
              </button>

              <button
                onClick={() => rejectEvent(editingEvent.id)}
                className="w-full py-2.5 bg-red-950/40 hover:bg-red-900 border border-red-900/50 text-red-400 hover:text-white font-bold text-xs uppercase rounded-xl tracking-wide flex items-center justify-center gap-1.5"
              >
                ❌ Rejeter & Annuler cette action
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL CREATION EVENEMENT CLASSIQUE ================= */}
      {eventTriggerConfig && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3 mb-2">
              <div>
                <span className="text-[10px] font-black tracking-widest bg-zinc-950 text-[#FFD700] border border-zinc-850 px-2 py-1 rounded uppercase">
                  {eventTriggerConfig.type === 'Changement' ? '🔄 Flux Remplacement' : `Action : ${eventTriggerConfig.type}`}
                </span>
              </div>
              <button onClick={() => setEventTriggerConfig(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            {eventTriggerConfig.type === 'Changement' && (
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-3 text-xs">
                {!substitutionIn ? (
                  <p className="text-emerald-400 font-bold animate-pulse">🟢 ÉTAPE 1 : Cliquez sur le REMPLAÇANT qui ENTRE</p>
                ) : (
                  <p className="text-amber-500 font-bold">🔴 ÉTAPE 2 : Cliquez sur le TITULAIRE qui SORT</p>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {currentLiveRoster.map((player) => {
                let isDisabled = false;
                if (eventTriggerConfig.type === 'Changement') {
                  if (!substitutionIn && player.role !== 'Remplaçant') isDisabled = true;
                  if (substitutionIn && player.role !== 'Titulaire') isDisabled = true;
                }

                const isPickedIn = substitutionIn?.id === player.id;
                const isPickedOut = substitutionOut?.id === player.id;

                return (
                  <button
                    key={player.id} disabled={isDisabled} onClick={() => handlePlayerSelection(player)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between ${
                      isPickedIn ? 'border-emerald-500 bg-emerald-500/10' :
                      isPickedOut ? 'border-red-500 bg-red-500/10' :
                      isDisabled ? 'opacity-25 bg-zinc-950/20 cursor-not-allowed' : 'bg-zinc-950 border-zinc-850'
                    }`}
                  >
                    <span>{player.name} <b className="text-zinc-500">N°{player.dorsa}</b></span>
                    <span className="text-[10px] font-bold text-zinc-400">{player.role}</span>
                  </button>
                );
              })}
            </div>

            {eventTriggerConfig.type === 'Changement' && substitutionIn && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                <div className="bg-zinc-950 p-2 text-center text-xs border border-zinc-850 rounded-xl">
                  <span className="text-emerald-400">🟢 {substitutionIn.name}</span> ➜ <span className={substitutionOut ? 'text-red-400' : 'text-zinc-600'}>{substitutionOut ? substitutionOut.name : 'Choisir sortant...'}</span>
                </div>
                <button disabled={!substitutionOut} onClick={submitSubstitutionEvent} className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl disabled:opacity-20">Valider</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL ASSIGNATION FEUILLE DE MATCH INITIALE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-5 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
              <h3 className="text-xs font-black uppercase text-white">Roster : {activeTeamType === 'home' ? selectedMatch?.home : selectedMatch?.away}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="Nom Prénom" value={playerForm.name} onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} className="col-span-2 bg-zinc-900 text-xs p-2 rounded-lg text-white outline-none" />
                  <input type="number" placeholder="N°" value={playerForm.dorsa} onChange={(e) => setPlayerForm({ ...playerForm, dorsa: e.target.value })} className="bg-zinc-900 text-xs p-2 rounded-lg text-white outline-none" />
                </div>
                <div className="flex justify-between items-center">
                  <select value={playerForm.role} onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })} className="bg-zinc-900 text-xs text-zinc-300 p-1.5 rounded-lg">
                    <option value="Titulaire">Titulaire</option>
                    <option value="Remplaçant">Remplaçant</option>
                    <option value="Staff/Dirigeant">Staff</option>
                  </select>
                  <button onClick={addPlayerToRoster} className="bg-[#FFD700] text-black font-bold text-xs px-3 py-1.5 rounded-lg">Ajouter</button>
                </div>
              </div>
              <div className="space-y-1">
                {(activeTeamType === 'home' ? homeRoster : awayRoster).map((p) => (
                  <div key={p.id} className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-850 flex justify-between text-xs">
                    <span>{p.name} (N°{p.dorsa})</span>
                    <button onClick={() => removePlayerFromRoster(p.id)} className="text-zinc-600 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={saveRoster} className="bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl mt-3">Enregistrer la Fiche</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MatchConsoleManager;