import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Clock, X, Edit3, Trash2, ChevronRight, User, ShieldAlert, CheckCircle2, Users
} from 'lucide-react';

const MatchConsoleManager = () => {
  // --- STATE DES MATCHS ---
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchStatus, setMatchStatus] = useState('En attente'); 
  
  // --- CHRONOMÈTRE ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const increment = useRef(null);

  // --- ÉVÉNEMENTS & MODAL DE FLUX LIVE ---
  const [matchEvents, setMatchEvents] = useState([]);
  const [eventTriggerConfig, setEventTriggerConfig] = useState(null); 
  const [substitutionIn, setSubstitutionIn] = useState(null);  
  const [substitutionOut, setSubstitutionOut] = useState(null); 
  const [editingEvent, setEditingEvent] = useState(null); 
  const [editSubIn, setEditSubIn] = useState(null);       
  const [editSubOut, setEditSubOut] = useState(null);     

  // --- CONFIGURATION DE LA FICHE DE MATCH ÉLECTRONIQUE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTeamType, setActiveTeamType] = useState('home'); // 'home' ou 'away'
  const [formType, setFormType] = useState('joueur'); // 'joueur' ou 'staff' (Boutons Radio)
  
  // Formulaire d'affectation pour le match
  const [assignmentForm, setAssignmentForm] = useState({
    userId: '',
    dorsa: '',
    matchStatus: 'Titulaire' // Titulaire, Remplaçant, Staff
  });

  // Feuilles de match enregistrées (Compositions validées)
  const [homeRoster, setHomeRoster] = useState([]);
  const [awayRoster, setAwayRoster] = useState([]);
  const [isHomeSaved, setIsHomeSaved] = useState(false);
  const [isAwaySaved, setIsAwaySaved] = useState(false);

  // =========================================================================
  // SIMULATION DE LA BASE DE DONNÉES (ENTITÉS CORRESPONDANT À VOTRE STRUCTURE)
  // =========================================================================
  const mockMatches = [
    { id: 101, homeId: 1, home: "Lomé FC", awayId: 2, away: "Maritime Stars", type: "1/2 Finale" },
    { id: 102, homeId: 3, home: "Kara AS", awayId: 4, away: "Kloto United", type: "1/4 Finale" }
  ];

  // Base des Utilisateurs globaux (Membres enregistrés dans le club)
  const mockUsers = [
    // --- LOMÉ FC (Équipe 1) ---
    { id: 1, equipe_id: 1, name: "Emmanuel Adebayor", poste: "Attaquant", logo: "⚽" },
    { id: 2, equipe_id: 1, name: "Kossi Agassa", poste: "Gardien", logo: "🧤" },
    { id: 3, equipe_id: 1, name: "Alaixys Romao", poste: "Milieu", logo: "🛡️" },
    { id: 4, equipe_id: 1, name: "Djené Dakonam", poste: "Défenseur", logo: "🧱" },
    { id: 5, equipe_id: 1, name: "Laba Kodjo", poste: "Attaquant", logo: "⚽" },
    { id: 6, equipe_id: 1, name: "Ihlas Bebou", poste: "Ailier", logo: "⚡" },
    { id: 7, equipe_id: 1, name: "Floyd Ayité", poste: "Milieu", logo: "🪄" },
    { id: 8, equipe_id: 1, name: "Sadate Ouro-Akoriko", poste: "Défenseur", logo: "🧱" },
    { id: 9, equipe_id: 1, name: "Serge Gakpé", poste: "Attaquant", logo: "⚽" },
    { id: 10, equipe_id: 1, name: "Jean-Marie Lawson", poste: "Coach Principal", logo: "📋", isStaff: true },
    { id: 11, equipe_id: 1, name: "Dr. Amédée", poste: "Médecin", logo: "💼", isStaff: true },

    // --- MARITIME STARS (Équipe 2) ---
    { id: 21, equipe_id: 2, name: "Yawu Yao", poste: "Milieu", logo: "🪄" },
    { id: 22, equipe_id: 2, name: "Messan Junior", poste: "Attaquant", logo: "⚽" },
    { id: 23, equipe_id: 2, name: "Koffi Mensah", poste: "Gardien", logo: "🧤" },
    { id: 24, equipe_id: 2, name: "Coach Nibombé Dare", poste: "Entraineur", logo: "📋", isStaff: true }
  ];

  // Filtrer les matchs dans la barre de recherche gauche
  const filteredMatches = mockMatches.filter(m => 
    m.home.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.away.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- CHRONOMÈTRE LOGIQUE ---
  useEffect(() => {
    if (isActive) {
      increment.current = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(increment.current);
    }
    return () => clearInterval(increment.current);
  }, [isActive]);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // --- CALCULS DES QUOTAS DE LA LISTE PROVISOIRE ---
  const getRosterStats = (roster) => {
    const tits = roster.filter(p => p.matchStatus === 'Titulaire').length;
    const remps = roster.filter(p => p.matchStatus === 'Remplaçant').length;
    const staffs = roster.filter(p => p.matchStatus === 'Staff').length;
    return { titulaireCount: tits, remplacantCount: remps, staffCount: staffs, totalJoueurs: tits + remps };
  };

  const currentTeamId = activeTeamType === 'home' ? selectedMatch?.homeId : selectedMatch?.awayId;
  const currentProvisionalList = activeTeamType === 'home' ? homeRoster : awayRoster;
  const currentStats = getRosterStats(currentProvisionalList);

  // Filtrer les utilisateurs de la BDD dispo pour le select selon le bouton radio (Joueur ou Staff)
  const availableUsersFromDb = mockUsers.filter(u => {
    if (u.equipe_id !== currentTeamId) return false;
    // Vérifie si déjà ajouté à la feuille provisoire
    const alreadyAdded = currentProvisionalList.some(p => p.userId === u.id);
    if (alreadyAdded) return false;

    if (formType === 'staff') return u.isStaff === true;
    return !u.isStaff;
  });

  // --- AJOUTER UN JOUEUR/STAFF À LA LISTE PROVISOIRE ---
  const addMemberToProvisionalList = () => {
    if (!assignmentForm.userId) return;

    // Récupérer les détails bruts du user dans la base globale
    const baseUser = mockUsers.find(u => u.id === parseInt(assignmentForm.userId));
    if (!baseUser) return;

    // Validation des règles strictes (Max 20 joueurs, Max 2 Staff)
    if (formType === 'joueur' && currentStats.totalJoueurs >= 20) {
      alert("Limite atteinte : Maximum 20 joueurs autorisés sur la feuille de match !");
      return;
    }
    if (formType === 'staff' && currentStats.staffCount >= 2) {
      alert("Limite atteinte : Maximum 2 membres du staff autorisés !");
      return;
    }

    const newAssignment = {
      id: Date.now(), // clé unique pour la ligne de relation de ce match
      userId: baseUser.id,
      name: baseUser.name,
      poste: baseUser.poste || 'N/A',
      logo: baseUser.logo || '👤',
      dorsa: formType === 'staff' ? 'Staff' : (assignmentForm.dorsa || 'N/A'),
      matchStatus: formType === 'staff' ? 'Staff' : assignmentForm.matchStatus,
      // États réels pendant le live (évolutifs)
      role: formType === 'staff' ? 'Staff' : assignmentForm.matchStatus 
    };

    if (activeTeamType === 'home') setHomeRoster([...homeRoster, newAssignment]);
    else setAwayRoster([...awayRoster, newAssignment]);

    // Reset du formulaire d'ajout
    setAssignmentForm({ userId: '', dorsa: '', matchStatus: 'Titulaire' });
  };

  const removeMemberFromProvisionalList = (id) => {
    if (activeTeamType === 'home') setHomeRoster(homeRoster.filter(p => p.id !== id));
    else setAwayRoster(awayRoster.filter(p => p.id !== id));
  };

  const saveFinalRoster = () => {
    if (activeTeamType === 'home') setIsHomeSaved(true);
    if (activeTeamType === 'away') setIsAwaySaved(true);
    setIsModalOpen(false);
  };

  // --- LOGIQUE LIVE & INTERACTION DU FLUX CLIQUABLE (CONSERVÉE) ---
  const openPlayerSelectModal = (type, teamSide) => {
    setSubstitutionIn(null);
    setSubstitutionOut(null);
    setEventTriggerConfig({ type, teamSide, eventTime: formatTime(seconds) });
  };

  const handlePlayerSelection = (player) => {
    if (!eventTriggerConfig) return;
    if (eventTriggerConfig.type === 'Changement') {
      if (!substitutionIn && player.role === 'Remplaçant') setSubstitutionIn(player);
      else if (substitutionIn && player.role === 'Titulaire') setSubstitutionOut(player);
      return;
    }
    submitStandardEvent(player);
  };

  const submitStandardEvent = (player) => {
    const newEvent = {
      id: Date.now(),
      time: eventTriggerConfig.eventTime,
      eventType: eventTriggerConfig.type,
      teamSide: eventTriggerConfig.teamSide,
      team: eventTriggerConfig.teamSide === 'home' ? selectedMatch.home : selectedMatch.away,
      player: { id: player.id, name: player.name, dorsa: player.dorsa }
    };
    setMatchEvents([newEvent, ...matchEvents]);
    setEventTriggerConfig(null);
  };

  const submitSubstitutionEvent = () => {
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
    setEventTriggerConfig(null);
  };

  const updateRosterRoles = (teamSide, incId, outId) => {
    const process = (roster) => roster.map(p => {
      if (p.id === incId) return { ...p, role: 'Titulaire (Entré)' };
      if (p.id === outId) return { ...p, role: 'Remplacé' };
      return p;
    });
    if (teamSide === 'home') setHomeRoster(process(homeRoster));
    else setAwayRoster(process(awayRoster));
  };

  const openEditEventModal = (ev) => {
    setEditingEvent(ev);
    if (ev.isSubstitution) {
      setEditSubIn(ev.playerIn);
      setEditSubOut(ev.playerOut);
    }
  };

  const saveEditedEvent = () => {
    const updated = matchEvents.map(ev => {
      if (ev.id === editingEvent.id) {
        if (ev.isSubstitution) {
          revertRosterRoles(ev.teamSide, ev.playerIn.id, ev.playerOut.id);
          updateRosterRoles(ev.teamSide, editSubIn.id, editSubOut.id);
          return { ...ev, playerIn: editSubIn, playerOut: editSubOut };
        }
        return { ...editingEvent };
      }
      return ev;
    });
    setMatchEvents(updated);
    setEditingEvent(null);
  };

  const rejectEvent = (eventId) => {
    const target = matchEvents.find(ev => ev.id === eventId);
    if (target && target.isSubstitution) {
      revertRosterRoles(target.teamSide, target.playerIn.id, target.playerOut.id);
    }
    setMatchEvents(matchEvents.filter(ev => ev.id !== eventId));
    setEditingEvent(null);
  };

  const revertRosterRoles = (teamSide, incId, outId) => {
    const process = (roster) => roster.map(p => {
      if (p.id === incId) return { ...p, role: 'Remplaçant' };
      if (p.id === outId) return { ...p, role: 'Titulaire' };
      return p;
    });
    if (teamSide === 'home') setHomeRoster(process(homeRoster));
    else setAwayRoster(process(awayRoster));
  };

  const currentLiveRoster = eventTriggerConfig ? (eventTriggerConfig.teamSide === 'home' ? homeRoster : awayRoster) : [];
  const editingRoster = editingEvent ? (editingEvent.teamSide === 'home' ? homeRoster : awayRoster) : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 font-sans">
      
      {/* HEADER PRINCIPAL */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-zinc-100">
            Console FME Pro <span className="text-[#FFD700]">• Relations Joueurs & Match</span>
          </h1>
          <p className="text-xs text-zinc-500">Configuration stricte des effectifs (20 joueurs + 2 Staff) et flux éditables.</p>
        </div>
        {selectedMatch && (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-[#FFD700]">
            {matchStatus}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= PANNEAU GAUCHE : SÉLECTION MATCH & COMPOSTIONS ================= */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4">
            <input 
              type="text" placeholder="Rechercher match..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#FFD700] placeholder-zinc-700"
            />
            <div className="space-y-1.5 max-h-40 overflow-y-auto mt-3">
              {filteredMatches.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => { setSelectedMatch(m); setMatchStatus('En attente'); setSeconds(0); setMatchEvents([]); setHomeRoster([]); setAwayRoster([]); setIsHomeSaved(false); setIsAwaySaved(false); }} 
                  className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${selectedMatch?.id === m.id ? 'bg-[#FFD700]/10 border-[#FFD700] text-white' : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'}`}
                >
                  <span className="font-bold">{m.home} 🆚 {m.away}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>

          {selectedMatch && (
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 space-y-3">
              <h2 className="text-[10px] font-black tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                <Users size={12} /> Remplissage des Fiches Électroniques
              </h2>
              <div className="space-y-2">
                <button onClick={() => { setActiveTeamType('home'); setFormType('joueur'); setIsModalOpen(true); }} className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center ${isHomeSaved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800'}`}>
                  <div>
                    <p className="font-bold text-zinc-300">{selectedMatch.home}</p>
                    <span className="text-[10px] text-zinc-500">{homeRoster.length} membre(s) ajouté(s)</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isHomeSaved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-950 text-zinc-500'}`}>{isHomeSaved ? 'Prêt' : 'À remplir'}</span>
                </button>

                <button onClick={() => { setActiveTeamType('away'); setFormType('joueur'); setIsModalOpen(true); }} className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center ${isAwaySaved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800'}`}>
                  <div>
                    <p className="font-bold text-zinc-300">{selectedMatch.away}</p>
                    <span className="text-[10px] text-zinc-500">{awayRoster.length} membre(s) ajouté(s)</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isAwaySaved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-950 text-zinc-500'}`}>{isAwaySaved ? 'Prêt' : 'À remplir'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= CONSOLE CENTRAL LIVE (CHRONO & TIMELINE) ================= */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMatch ? (
            <>
              {/* COMPTEUR CHRONO */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 text-center">
                <div className="font-mono text-4xl font-black text-zinc-100 flex items-center justify-center gap-2">
                  <Clock className="text-[#FFD700]" size={28} /> {formatTime(seconds)}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  <button disabled={(!isHomeSaved || !isAwaySaved) || matchStatus === 'En cours'} onClick={() => { setMatchStatus('En cours'); setIsActive(true); }} className="py-2 bg-[#FFD700] text-black font-black text-xs rounded-lg uppercase tracking-wide disabled:opacity-20">Démarrer</button>
                  <button disabled={matchStatus !== 'En cours'} onClick={() => { setMatchStatus('Pause'); setIsActive(false); }} className="py-2 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-lg uppercase disabled:opacity-20">Pause</button>
                  <button disabled={matchStatus !== 'Pause'} onClick={() => { setMatchStatus('En cours'); setIsActive(true); }} className="py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg uppercase disabled:opacity-20">Reprendre</button>
                  <button disabled={matchStatus === 'En attente' || matchStatus === 'Terminé'} onClick={() => { setMatchStatus('Terminé'); setIsActive(false); }} className="py-2 bg-red-600 text-white font-bold text-xs rounded-lg uppercase disabled:opacity-20">Fin Match</button>
                </div>
              </div>

              {/* COMMANDE DES BOUTONS D'ACTIONS TEMPS RÉEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Domicile */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                  <p className="text-xs font-black text-blue-400 mb-2 border-l-2 border-blue-500 pl-2 uppercase">{selectedMatch.home}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('But ⚽', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold hover:border-zinc-700 disabled:opacity-30">⚽ But</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Jaune 🟨', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-yellow-500 disabled:opacity-30">🟨 Jaune</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Rouge 🟥', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-30">🟥 Rouge</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Changement', 'home')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-30">🔄 Remplacer</button>
                  </div>
                </div>

                {/* Extérieur */}
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                  <p className="text-xs font-black text-orange-400 mb-2 border-l-2 border-orange-500 pl-2 uppercase">{selectedMatch.away}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('But ⚽', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold hover:border-zinc-700 disabled:opacity-30">⚽ But</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Jaune 🟨', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-yellow-500 disabled:opacity-30">🟨 Jaune</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Carton Rouge 🟥', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-red-500 disabled:opacity-30">🟥 Rouge</button>
                    <button disabled={matchStatus !== 'En cours'} onClick={() => openPlayerSelectModal('Changement', 'away')} className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-left text-xs font-bold text-emerald-400 disabled:opacity-30">🔄 Remplacer</button>
                  </div>
                </div>
              </div>

              {/* TIMELINE FLUX D'ACTIONS TOTALEMENT CLIQUEABLE */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase">Fil des événements</h3>
                  <span className="text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded">💡 Modifiable au clic</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {matchEvents.length === 0 ? (
                    <p className="text-center py-6 text-zinc-600 text-xs font-medium">En attente d'événements de jeu...</p>
                  ) : (
                    matchEvents.map(ev => (
                      <div 
                        key={ev.id} onClick={() => openEditEventModal(ev)}
                        className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-[#FFD700] p-3 rounded-xl flex justify-between items-center text-xs cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-zinc-900 text-[#FFD700] border border-zinc-800 px-1.5 py-0.5 rounded font-bold">{ev.time}</span>
                          <span className="text-zinc-500 font-semibold">[{ev.team}]</span>
                          {ev.isSubstitution ? (
                            <span>
                              <b className="text-emerald-400">🟢 {ev.playerIn.name}</b> remplace <b className="text-red-400">🔴 {ev.playerOut.name}</b>
                            </span>
                          ) : (
                            <span>{ev.player.name} <b className="text-zinc-600 font-mono text-[11px]">(N°{ev.player.dorsa})</b></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-300 group-hover:text-[#FFD700] font-bold">{ev.eventType}</span>
                          <Edit3 size={11} className="text-zinc-600 group-hover:text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-44 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 text-xs">Veuillez sélectionner une rencontre dans la colonne de gauche.</div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL MAJEUR : ENREGISTREMENT ET RELATIONS FEUILLE DE MATCH (FICHE) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-850 w-full max-w-lg rounded-2xl shadow-2xl p-5 flex flex-col max-h-[90vh]">
            
            {/* EN-TÊTE MODAL AVEC RADIOS TYPE JOUEUR / STAFF */}
            <div className="border-b border-zinc-800 pb-3 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Fiche : {activeTeamType === 'home' ? selectedMatch?.home : selectedMatch?.away}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
              </div>

              {/* BOUTONS RADIOS DE TYPE DE MEMBRE */}
              <div className="flex gap-4 bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold transition-all select-none">
                  <input 
                    type="radio" name="formType" value="joueur" checked={formType === 'joueur'} 
                    onChange={(e) => { setFormType(e.target.value); setAssignmentForm({...assignmentForm, matchStatus: 'Titulaire'}); }} 
                    className="accent-[#FFD700]"
                  />
                  <span className={formType === 'joueur' ? 'text-[#FFD700]' : 'text-zinc-500'}>Joueurs de l'Équipe</span>
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold transition-all select-none">
                  <input 
                    type="radio" name="formType" value="staff" checked={formType === 'staff'} 
                    onChange={(e) => { setFormType(e.target.value); setAssignmentForm({...assignmentForm, matchStatus: 'Staff'}); }} 
                    className="accent-[#FFD700]"
                  />
                  <span className={formType === 'staff' ? 'text-[#FFD700]' : 'text-zinc-500'}>Staff Technique</span>
                </label>
              </div>
            </div>

            {/* FORMULAIRE D'AFFECTATION PAR SELECT */}
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 space-y-3 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* SELECT DE L'ENTITÉ USER GLOBAL */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Sélectionner un nom</label>
                  <select
                    value={assignmentForm.userId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, userId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg text-white font-medium focus:border-[#FFD700] outline-none"
                  >
                    <option value="">-- Choisir dans le Club --</option>
                    {availableUsersFromDb.map(u => (
                      <option key={u.id} value={u.id}>{u.logo} {u.name} {u.poste ? `(${u.poste})` : ''}</option>
                    ))}
                  </select>
                </div>

                {/* CHAMP ATTRIBUTS DU MATCH (DORSARD & STATUT DU MATCH) */}
                {formType === 'joueur' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Dossard N°</label>
                      <input 
                        type="number" placeholder="Ex: 10" value={assignmentForm.dorsa}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, dorsa: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg text-center font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Statut Match</label>
                      <select
                        value={assignmentForm.matchStatus}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, matchStatus: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg font-bold text-zinc-200 outline-none"
                      >
                        <option value="Titulaire">Titulaire</option>
                        <option value="Remplaçant">Remplaçant</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <div className="w-full text-center bg-zinc-900/60 p-2 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 font-semibold">
                      Enregistré d'office sur le Banc
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  onClick={addMemberToProvisionalList}
                  className="w-full sm:w-auto px-5 py-2 bg-[#FFD700] text-black font-black text-xs uppercase rounded-lg tracking-wide shadow"
                >
                  Ajouter à la liste provisoire
                </button>
              </div>
            </div>

            {/* VUE STATISTIQUE ET COMPTEUR STRICT DE COMPOSITION PROVISOIRE */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2.5 border border-zinc-850 rounded-xl mb-3 text-center text-xs">
              <div className="border-r border-zinc-850">
                <p className="text-zinc-500 text-[10px] font-bold uppercase">Titulaires</p>
                <p className={`font-black text-sm ${currentStats.titulaireCount === 11 ? 'text-emerald-400' : 'text-zinc-300'}`}>{currentStats.titulaireCount} <span className="text-[10px] text-zinc-600">/ 11</span></p>
              </div>
              <div className="border-r border-zinc-850">
                <p className="text-zinc-500 text-[10px] font-bold uppercase">Remplaçants</p>
                <p className="font-black text-zinc-300 text-sm">{currentStats.remplacantCount}</p>
              </div>
              <div>
                <p className="text-[#FFD700] text-[10px] font-bold uppercase">Total Effectif</p>
                <p className="font-black text-sm text-zinc-200">{currentStats.totalJoueurs} <span className="text-[10px] text-zinc-600">/ 20</span> <span className="text-xs text-zinc-500 font-normal">({currentStats.staffCount} Staff)</span></p>
              </div>
            </div>

            {/* LISTE PROVISOIRE INTERACTIVE AVEC LE BADGE DE STATUT DU MATCH */}
            <div className="flex-1 overflow-y-auto space-y-1.5 bg-zinc-950/40 p-2 rounded-xl border border-zinc-900">
              {currentProvisionalList.length === 0 ? (
                <p className="text-center py-6 text-zinc-600 text-xs font-medium">Aucun membre ajouté pour le moment.</p>
              ) : (
                currentProvisionalList.map((p) => (
                  <div key={p.id} className="bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl flex justify-between items-center text-xs animate-slideIn">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.logo}</span>
                      <div>
                        <p className="font-bold text-zinc-200">{p.name}</p>
                        <p className="text-[10px] text-zinc-500">Poste : {p.poste}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Affichage explicite du numéro attribué et du statut choisi pour ce match */}
                      <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-[11px] font-bold text-zinc-400 border border-zinc-800">
                        {p.dorsa === 'Staff' ? '💼 Staff' : `N° ${p.dorsa}`}
                      </span>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        p.matchStatus === 'Titulaire' ? 'bg-blue-500/10 text-blue-400' :
                        p.matchStatus === 'Remplaçant' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {p.matchStatus}
                      </span>

                      <button onClick={() => removeMemberFromProvisionalList(p.id)} className="text-zinc-600 hover:text-red-400 ml-1 p-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOUTON DE VALIDATION FINALE */}
            <button 
              onClick={saveFinalRoster}
              disabled={currentStats.titulaireCount === 0}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black text-xs uppercase rounded-xl mt-3 tracking-wider shadow"
            >
              Enregistrer et verrouiller la Fiche de Match
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL CORRECTION / REJET DIRECT (CLIQUEZ SUR FLUX) ================= */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 border border-[#FFD700]/20 rounded font-bold uppercase">Correction d'Action • {editingEvent.time}</span>
                <h3 className="text-sm font-black text-white mt-1">Flux cible : {editingEvent.eventType}</h3>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4 flex-1">
              {editingEvent.isSubstitution ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">Modifier l'Entrant (Banc)</label>
                    <select value={editSubIn?.id || ''} onChange={(e) => setEditSubIn(editingRoster.find(p => p.id === parseInt(e.target.value)))} className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2 rounded-xl text-white">
                      {editingRoster.filter(p => p.matchStatus === 'Remplaçant').map(p => (
                        <option key={p.id} value={p.id}>{p.name} (N°{p.dorsa})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-400 uppercase mb-1">Modifier le Sortant (Terrain)</label>
                    <select value={editSubOut?.id || ''} onChange={(e) => setEditSubOut(editingRoster.find(p => p.id === parseInt(e.target.value)))} className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2 rounded-xl text-white">
                      {editingRoster.filter(p => p.matchStatus === 'Titulaire').map(p => (
                        <option key={p.id} value={p.id}>{p.name} (N°{p.dorsa})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Réattribuer cette action à un autre joueur actif :</label>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {editingRoster.map(player => (
                      <button 
                        key={player.id} onClick={() => setEditingEvent({ ...editingEvent, player: { id: player.id, name: player.name, dorsa: player.dorsa } })}
                        className={`w-full text-left p-2.5 rounded-xl text-xs border flex items-center justify-between ${editingEvent.player?.id === player.id ? 'bg-[#FFD700]/10 border-[#FFD700] text-white font-bold' : 'bg-zinc-950 border-zinc-850 text-zinc-400'}`}
                      >
                        <span>{player.name} <b className="text-zinc-600 font-mono">N°{player.dorsa}</b></span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">{player.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-3 mt-4 space-y-2">
              <button onClick={saveEditedEvent} className="w-full py-2.5 bg-[#FFD700] text-black font-black text-xs uppercase rounded-xl tracking-wider">Sauvegarder les modifications</button>
              <button onClick={() => rejectEvent(editingEvent.id)} className="w-full py-2 bg-red-950/40 border border-red-900/40 text-red-400 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2">❌ Rejeter & Annuler l'action du flux</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SÉLECTION JOUEUR LIVE (LORS DE LA SAISIE D'UN BUT/CARD) ================= */}
      {eventTriggerConfig && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-5 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
              <span className="text-[11px] font-black tracking-wider bg-zinc-950 px-2 py-0.5 border border-zinc-850 rounded text-[#FFD700] uppercase">
                {eventTriggerConfig.type === 'Changement' ? '🔄 Flux Remplacement' : `Action : ${eventTriggerConfig.type}`}
              </span>
              <button onClick={() => setEventTriggerConfig(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5">
              {currentLiveRoster.map((player) => {
                let isDisabled = false;
                if (eventTriggerConfig.type === 'Changement') {
                  if (!substitutionIn && player.role !== 'Remplaçant') isDisabled = true;
                  if (substitutionIn && player.role !== 'Titulaire') isDisabled = true;
                }
                if (player.matchStatus === 'Staff') isDisabled = true; // Le staff ne peut pas marquer ou faire l'objet d'un changement terrain

                return (
                  <button
                    key={player.id} disabled={isDisabled} onClick={() => handlePlayerSelection(player)}
                    className={`w-full text-left p-2.5 border rounded-xl flex justify-between items-center text-xs ${
                      substitutionIn?.id === player.id ? 'border-emerald-500 bg-emerald-500/10' :
                      substitutionOut?.id === player.id ? 'border-red-500 bg-red-500/10' :
                      isDisabled ? 'opacity-20 cursor-not-allowed bg-zinc-950/40' : 'bg-zinc-950 border-zinc-850'
                    }`}
                  >
                    <span>{player.name} <b className="text-zinc-500 font-mono">N°{player.dorsa}</b></span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">{player.role}</span>
                  </button>
                );
              })}
            </div>

            {eventTriggerConfig.type === 'Changement' && substitutionIn && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                <div className="bg-zinc-950 p-2 text-center text-xs border border-zinc-850 rounded-lg">
                  <span className="text-emerald-400">🟢 {substitutionIn.name}</span> ➜ <span className={substitutionOut ? 'text-red-400' : 'text-zinc-600'}>{substitutionOut ? substitutionOut.name : 'Choisir le sortant...'}</span>
                </div>
                <button disabled={!substitutionOut} onClick={submitSubstitutionEvent} className="w-full py-2 bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl disabled:opacity-25">Enregistrer le Remplacement</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MatchConsoleManager;