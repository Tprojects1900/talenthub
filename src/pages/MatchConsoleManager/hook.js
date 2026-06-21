import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTeams, useGroups, useSchedules, useMatchRosters } from '../../hooks/useCalls';
import { useAddMatchRoster, useRemoveMatchRoster, useDropActor, useSwitchMatchMode, useCreateStandarEvent, useCreateSub ,useDropEvent,useEditTimerOrPlayer} from '../../lib/graphql.service';
import { toast } from 'react-toastify';

export const useMatchConsole = () => {
  const [eventDropId,setEventDropId]=useState(null);
  const [eventShow,setEventShow]=useState(false);
  const { teams: apiTeams, loading: team_loaded } = useTeams();
  const { schedules, loaded_schedule, refetchSchedules } = useSchedules();
  const { groups, group_loaded } = useGroups();

  const [selectedMatch, setSelectedMatch] = useState(null);
  const matchId = selectedMatch?.id || selectedMatch?._id || null;

  // 1. Chargement automatique des rosters depuis la BDD pour le match sélectionné
  const { rosters, refetchRosters, roster_loaded } = useMatchRosters(matchId);

  // 2. Récupération des fonctions de mutation GraphQL
  const [addMatchRosterApi, { loading: roster_added }] = useAddMatchRoster();
  const [removeMatchRosterApi] = useRemoveMatchRoster();
  const [deleteActorFromRoster, { loading: actor_droped }] = useDropActor();
  const [switchMatchMode, { loading: switch_mode }] = useSwitchMatchMode();
  const [createStandardEvent, { loading: add_stan }] = useCreateStandarEvent();
  const [createSubstitutionEvents, { loading: add_sub }] = useCreateSub();
  const [deleteMatchEvent, { loading: event_droped }] = useDropEvent();
  const [updateMatchEventTimeOrPlayer, { loading: tp_edited }] = useEditTimerOrPlayer();

  const [searchQuery, setSearchQuery] = useState('');
  
  // États critiques du cycle de vie du match
  const [matchStatus, setMatchStatus] = useState('programmed'); 
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const increment = useRef(null);

  const [matchEvents, setMatchEvents] = useState([]);
  const [eventTriggerConfig, setEventTriggerConfig] = useState(null); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTeamType, setActiveTeamType] = useState('home'); 
  const [formType, setFormType] = useState('joueur'); 
  
  const [assignmentForm, setAssignmentForm] = useState({ userId: '', dorsa: '', matchStatus: 'Titulaire' });
  const [homeRoster, setHomeRoster] = useState([]);
  const [awayRoster, setAwayRoster] = useState([]);
  const [isHomeSaved, setIsHomeSaved] = useState(false);
  const [isAwaySaved, setIsAwaySaved] = useState(false);

// ==========================================
  // --- GESTION NETTOYÉE DU CHRONOMÈTRE ---
  // ==========================================

  // 1. SYNC INITIALE ET ANTI-F5 (Au changement de match)
  useEffect(() => {
    if (!matchId) return;

    const savedMatchId = localStorage.getItem('console_match_id');
    const currentStatus = selectedMatch?.status || 'programmed';
    
    if (savedMatchId === String(matchId)) {
      const savedSeconds = localStorage.getItem('console_seconds');
      const savedIsActive = localStorage.getItem('console_is_active');

      if (savedSeconds) setSeconds(parseInt(savedSeconds, 10));
      if (savedIsActive) {
        setIsActive(savedIsActive === 'true');
      } else {
        setIsActive(currentStatus === 'live');
      }
    } else {
      // Premier chargement de ce match
      localStorage.setItem('console_match_id', String(matchId));
      localStorage.setItem('console_seconds', '0');
      
      const shouldBeActive = currentStatus === 'live';
      localStorage.setItem('console_is_active', String(shouldBeActive));
      setSeconds(0);
      setIsActive(shouldBeActive);
    }
  }, [matchId, selectedMatch?.status]);

  // 2. UNIQUE EFFET POUR L'INCRÉMENTATION DU TIMER LIVE
  useEffect(() => {
    // Nettoyage systématique de l'ancien intervalle de sécurité
    if (increment.current) {
      clearInterval(increment.current);
    }

    if (isActive && matchStatus === 'live') {
      increment.current = setInterval(() => {
        setSeconds(prev => {
          const nextSecs = prev + 1;
          localStorage.setItem('console_seconds', String(nextSecs));
          return nextSecs;
        });
      }, 1000);
    }

    return () => {
      if (increment.current) clearInterval(increment.current);
    };
  }, [isActive, matchStatus]);

  // 3. SYNCHRONISATION DU STATUT DEPUIS LA SOURCE DE VÉRITÉ (BDD)
  useEffect(() => {
    if (selectedMatch) {
      const currentStatus = selectedMatch.status || 'programmed';
      setMatchStatus(currentStatus);
      
      if (currentStatus === 'finished' || currentStatus === 'programmed' || currentStatus === 'cancelled') {
        setIsActive(false);
        localStorage.setItem('console_is_active', 'false');
      } else if (currentStatus === 'live') {
        setIsActive(true);
        localStorage.setItem('console_is_active', 'true');
      }
    }
  }, [selectedMatch]);

// Synchronisation intelligente des rosters (Version Corrigée)
  useEffect(() => {
    // Si l'API n'a renvoyé aucun roster pour ce match
    if (!rosters || rosters.length === 0) {
      // On ne vide localement QUE si l'équipe était marquée comme sauvegardée précédemment
      if (isHomeSaved) { setHomeRoster([]); setIsHomeSaved(false); }
      if (isAwaySaved) { setAwayRoster([]); setIsAwaySaved(false); }
      return;
    }

    const homeData = rosters.find(r => r.side === 'home');
    const awayData = rosters.find(r => r.side === 'away');

    // Sync Équipe Home
    if (homeData) {
      setIsHomeSaved(homeData.isSaved || false);
      setHomeRoster(homeData.actors || []);
    } else {
      // S'il n'y a rien en BDD mais qu'on avait validé avant, on reset
      if (isHomeSaved) {
        setHomeRoster([]);
        setIsHomeSaved(false);
      }
    }

    // Sync Équipe Away
    if (awayData) {
      setIsAwaySaved(awayData.isSaved || false);
      setAwayRoster(awayData.actors || []);
    } else {
      // S'il n'y a rien en BDD mais qu'on avait validé avant, on reset
      if (isAwaySaved) {
        setAwayRoster([]);
        setIsAwaySaved(false);
      }
    }
    // Suppression des écoutes sur .length pour éviter les boucles de suppression intempestives
  }, [rosters, isHomeSaved, isAwaySaved]);

  // Alimentation initiale des faits de jeu
  useEffect(() => {
    if (!selectedMatch) return;
    setMatchEvents(selectedMatch?.events || []);
  }, [selectedMatch]);

  const formatTime = useCallback((totalSecs) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, []);

  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return (schedules || []).filter(m => {
      const homeName = m.homeTeam?.nom || m.homeTeam?.name || '';
      const awayName = m.awayTeam?.nom || m.awayTeam?.name || '';
      return homeName.toLowerCase().includes(query) || awayName.toLowerCase().includes(query);
    });
  }, [schedules, searchQuery]);

  const getRosterStats = useCallback((roster) => {
    const tits = roster.filter(p => p.matchStatus === 'Titulaire').length;
    const remps = roster.filter(p => p.matchStatus === 'Remplaçant').length;
    const staffs = roster.filter(p => p.matchStatus === 'Staff').length;
    return { titulaireCount: tits, remplacantCount: remps, staffCount: staffs, totalJoueurs: tits + remps };
  }, []);

  const currentTeamId = activeTeamType === 'home' 
    ? (selectedMatch?.homeId || selectedMatch?.homeTeam?.id || selectedMatch?.homeTeam?._id) 
    : (selectedMatch?.awayId || selectedMatch?.awayTeam?.id || selectedMatch?.awayTeam?._id);

  const currentProvisionalList = activeTeamType === 'home' ? homeRoster : awayRoster;
  const currentStats = useMemo(() => getRosterStats(currentProvisionalList), [currentProvisionalList, getRosterStats]);

const currentTeamData = useMemo(() => {
  if (!selectedMatch) return null;
  
  // On passe en minuscule pour éviter les conflits 'home' vs 'Home' ou 'away' vs 'Away'
  const side = String(activeTeamType).toLowerCase();
  
  if (side === 'home') {
    return selectedMatch.homeTeam;
  } else if (side === 'away') {
    return selectedMatch.awayTeam;
  }
  
  return null;
}, [selectedMatch, activeTeamType]);

const availableUsersFromDb = useMemo(() => {
  if (!currentTeamData) return [];
  
  // On récupère les membres peu importe si la clé est en français ou en anglais
  const members = currentTeamData.members || currentTeamData.membres || [];
  
  return members.filter(u => {
    // 1. Vérifier si déjà dans la liste provisoire actuelle (Home ou Away)
    const alreadyAdded = currentProvisionalList.some(
      p => String(p.playerId || p.id || p.userId) === String(u.id || u._id)
    );
    if (alreadyAdded) return false;

    // 2. Filtrage par type (Joueur / Staff)
    const userType = String(u.type || 'joueur').toLowerCase();
    if (formType === 'staff') {
      return userType === 'staff';
    } else {
      return userType === 'joueur';
    }
  });
}, [currentTeamData, currentProvisionalList, formType]);

  const expelledPlayerIds = useMemo(() => {
    const expelled = new Set();
    const yellowCounts = {}; 

    [...matchEvents].reverse().forEach(ev => {
      if (ev.isSubstitution || !ev.player?.id) return;
      const pId = ev.player.id;

      if (ev.eventType === 'Carton Rouge 🟥') {
        expelled.add(pId);
      }
      if (ev.eventType === 'Carton Jaune 🟨') {
        yellowCounts[pId] = (yellowCounts[pId] || 0) + 1;
        if (yellowCounts[pId] >= 2) expelled.add(pId);
      }
    });
    return expelled;
  }, [matchEvents]);

  const getLiveRosterBySide = useCallback((side) => {
    const roster = side === 'home' ? homeRoster : awayRoster;
    return roster.filter(p => !expelledPlayerIds.has(p.playerId || p.id));
  }, [homeRoster, awayRoster, expelledPlayerIds]);

  // Système centralisé de notifications typées avec emojis
  const showToast = (type, details = '') => {
    switch (type) {
      case 'But ⚽':
        toast.success(`⚽ BUT !!! ${details}`);
        break;
      case 'Carton Jaune 🟨':
        toast.warning(`🟨 Carton Jaune pour ${details}`);
        break;
      case 'Carton Rouge 🟥':
        toast.error(`🟥 CARTON ROUGE ! ${details} est expulsé !`);
        break;
      case '🔄 Remplacement':
        toast.info(`🔄 Remplacement : ${details}`);
        break;
      case 'live':
        toast.success('🚀 Le coup d\'envoi a été donné ! Match en cours.');
        break;
      case 'half-time':
        toast.info('⏱️ Fin de la première période ! Mi-temps.');
        break;
      case 'finished':
        toast.success('🏁 Fin du match ! Les scores et statistiques sont verrouillés.');
        break;
      case 'cancelled':
        toast.error('❌ Le match a été annulé.');
        break;
      default:
        toast.success(`✅ Action enregistrée : ${details}`);
    }
  };

const handleSelectMatch = useCallback((match) => {
    setSelectedMatch(match);
    const mId = match?.id || match?._id;
    const currentStatus = match?.status || 'programmed';
    
    setMatchStatus(currentStatus);
    setMatchEvents(match?.events || []);
    setEventTriggerConfig(null);
    
    // Au lieu de forcer à 0, on laisse le useEffect n°1 (Sync initiale) 
    // décider s'il doit récupérer le temps du localStorage ou l'initialiser
  }, []);

const addMemberToProvisionalList = () => {
  if (!assignmentForm.userId || !currentTeamData) return;
  
  const members = currentTeamData.members || currentTeamData.membres || [];
  const baseUser = members.find(u => String(u.id || u._id) === String(assignmentForm.userId));
  if (!baseUser) return;

  const userType = (baseUser.type || formType || 'joueur').toLowerCase();

  if (userType === 'joueur' && currentStats.totalJoueurs >= 23) {
    toast.info("Maximum 23 joueurs autorisés !");
    return;
  }
  if (userType === 'staff' && currentStats.staffCount >= 5) {
    toast.error("Maximum 5 membres du staff autorisés !");
    return;
  }

  const newAssignment = {
    id: baseUser.id || baseUser._id,
    playerId: baseUser.id || baseUser._id,
    nom: baseUser.nom || baseUser.name,
    dorsa: userType === 'staff' ? 'Staff' : (assignmentForm.dorsa || 'N/A'),
    matchStatus: userType === 'staff' ? 'Staff' : assignmentForm.matchStatus,
    role: userType === 'staff' ? 'Staff' : assignmentForm.matchStatus 
  };

  const teamType = String(activeTeamType).toLowerCase();

  if (teamType === 'home') {
    setHomeRoster(prev => [...prev, newAssignment]);
  } else if (teamType === 'away') {
    setAwayRoster(prev => [...prev, newAssignment]);
  }

  setAssignmentForm({ userId: '', dorsa: '', matchStatus: 'Titulaire' });
};

  const removeMemberFromProvisionalList = async (actor) => {
    const isSaved = activeTeamType === 'home' ? isHomeSaved : isAwaySaved;
    const targetPlayerId = actor?.playerId || actor?.id;

    // 1. SUPPRESSION LOCALE IMMEDIAT (Local-First)
    if (activeTeamType === 'home') {
      setHomeRoster(prev => prev.filter(p => (p.playerId || p.id) !== targetPlayerId));
    } else {
      setAwayRoster(prev => prev.filter(p => (p.playerId || p.id) !== targetPlayerId));
    }

    // 2. SYNCHRONISATION ARRIÈRE-PLAN AVEC L'API
    if (isSaved && matchId && currentTeamId && targetPlayerId) {
      try {
        await deleteActorFromRoster({
          variables: {
            matchId,
            teamId: currentTeamId,
            playerId: targetPlayerId
          }
        });
        await refetchRosters();
        toast.success("Membre retiré avec succès !");
      } catch (error) {
        toast.error(`Erreur lors de la suppression en base de données : ${error.message}`);
      }
    }
  };

  const switchMode = async (mode) => {
    if (!selectedMatch) return;
    const targetMatchId = selectedMatch.id || selectedMatch._id;

    try {
      const { data } = await switchMatchMode({
        variables: {
          matchId: targetMatchId,
          mode, 
        },
      });

      if (data?.switchMatchMode) {
        // Mutation réussie : Ajustement synchronisé des états locaux
        setMatchStatus(mode);
        setIsActive(mode === 'live');
        
        setSelectedMatch(prev => prev ? { ...prev, status: mode } : null);
        showToast(mode);
      } else {
        toast.error("Le serveur n'a pas pu modifier le statut.");
      }
    } catch (error) {
      const errorMsg = error.graphQLErrors?.[0]?.message || error.message || "Une erreur est survenue";
      toast.error(errorMsg);
    }
  };

  const saveFinalRoster = async () => {
    if (!matchId || !currentTeamId) return;

    const formattedActors = currentProvisionalList.map(actor => ({
      playerId: actor.playerId || actor.id,
      nom: actor.nom,
      dorsa: actor.dorsa,
      matchStatus: actor.matchStatus
    }));

    try {
      await addMatchRosterApi({
        variables: {
          matchId,
          teamId: currentTeamId,
          side: activeTeamType,
          actors: formattedActors
        }
      });

      if (activeTeamType === 'home') setIsHomeSaved(true);
      if (activeTeamType === 'away') setIsAwaySaved(true);
      
      await refetchRosters();
      setIsModalOpen(false);
      toast.success("Fiche de match sauvegardée avec succès !");
    } catch (error) {
      toast.error(`Erreur de sauvegarde : ${error.message}`);
    }
  };

  const clearEntireRosterFromDb = async () => {
    if (!matchId || !currentTeamId) return;
    if (!window.confirm("Voulez-vous vraiment effacer toute la composition de cette équipe ?")) return;
    
    try {
      await removeMatchRosterApi({
        variables: {
          matchId,
          teamId: currentTeamId
        }
      });
      
      if (activeTeamType === 'home') {
        setHomeRoster([]);
        setIsHomeSaved(false);
      } else {
        setAwayRoster([]);
        setIsAwaySaved(false);
      }
      await refetchRosters();
      toast.success("Composition entièrement réinitialisée.");
    } catch (error) {
      toast.error(`Erreur lors de la réinitialisation : ${error.message}`);
    }
  };

  const openPlayerSelectModal = (type, teamSide) => {
    setEventTriggerConfig({ type, teamSide, eventTime: formatTime(seconds) });
  };

  const submitStandardEvent = useCallback(async (player) => {
    if (!eventTriggerConfig || !selectedMatch) return;

    try {
      const playerInput = {
        id: player.playerId || player.id,
        name: player.nom || player.name,
        dorsa: player.dorsa ? String(player.dorsa) : 'N/A'
      };

      const { data } = await createStandardEvent({
        variables: {
          matchId: selectedMatch.id || selectedMatch._id,
          time: eventTriggerConfig.eventTime,
          eventType: eventTriggerConfig.type,
          teamSide: eventTriggerConfig.teamSide,
          player: playerInput
        }
      });

      if (data?.createStandardEvent) {
        setMatchEvents(prev => [data.createStandardEvent, ...prev]);
        await refetchSchedules();
        showToast(eventTriggerConfig.type, `${player.nom || player.name} (${eventTriggerConfig.eventTime})`);
      }

      setEventTriggerConfig(null);
    } catch (error) {
      toast.error(`Erreur lors de l'enregistrement de l'événement : ${error.message}`);
    }
  }, [eventTriggerConfig, selectedMatch, createStandardEvent, refetchSchedules]);

  const submitMultipleSubstitutionEvents = useCallback(async (playersOut, playersIn) => {
    if (!eventTriggerConfig || !selectedMatch || playersOut.length !== playersIn.length) return;

    try {
      const targetMatchId = selectedMatch.id || selectedMatch._id;

      const formattedPlayersOut = playersOut.map(p => ({
        id: p.playerId || p.id,
        name: p.nom || p.name,
        dorsa: p.dorsa ? String(p.dorsa) : 'N/A'
      }));

      const formattedPlayersIn = playersIn.map(p => ({
        id: p.playerId || p.id,
        name: p.nom || p.name,
        dorsa: p.dorsa ? String(p.dorsa) : 'N/A'
      }));

      const { data } = await createSubstitutionEvents({
        variables: {
          matchId: targetMatchId,
          time: eventTriggerConfig.eventTime,
          teamSide: eventTriggerConfig.teamSide,
          playersOut: formattedPlayersOut,
          playersIn: formattedPlayersIn
        }
      });

      const outIds = new Set(playersOut.map(p => p.playerId || p.id));
      const inIds = new Set(playersIn.map(p => p.playerId || p.id));

      const processRosterRoles = (roster) => roster.map(p => {
        const pId = p.playerId || p.id;
        if (inIds.has(pId)) return { ...p, role: 'Titulaire (Entré)' };
        if (outIds.has(pId)) return { ...p, role: 'Remplacé' };
        return p;
      });

      if (eventTriggerConfig.teamSide === 'home') {
        setHomeRoster(prev => processRosterRoles(prev));
      } else {
        setAwayRoster(prev => processRosterRoles(prev));
      }

      if (data?.createSubstitutionEvents) {
        setMatchEvents(prev => [...data.createSubstitutionEvents, ...prev]);
        await refetchSchedules();
        
        const detailsLog = playersIn.map((p, i) => `${p.nom || p.name} ⬆️ / ${playersOut[i].nom || playersOut[i].name} ⬇️`).join(', ');
        showToast('🔄 Remplacement', detailsLog);
      }

      setEventTriggerConfig(null);
    } catch (error) {
      toast.error(`Erreur lors du remplacement : ${error.message}`);
    }
  }, [eventTriggerConfig, selectedMatch, createSubstitutionEvents, refetchSchedules]);
 const handleCloseEventDrop=()=>{
  setEventDropId(null)
  setEventShow(false);
  }
 const deleteEvent = useCallback(async (eventId) => {
  // 1. Détermination de l'ID cible (sécurisé avec const)
  const dropId = eventDropId || eventId;
  if (!dropId) return;

  try {
    // 2. Appel API en premier (si l'API échoue, l'état local ne sera pas altéré par erreur)
    await deleteMatchEvent({
      variables: {
        eventId: dropId
      }
    });

    // 3. Mise à jour de l'état local de manière synchrone et pure
    setMatchEvents(prev => {
      const target = prev.find(ev => ev.id === dropId);
      
      if (target && target.isSubstitution) {
        const processRevert = (roster) => roster.map(p => {
          const pId = p.playerId || p.id;
          if (pId === target.playerIn?.id) return { ...p, role: 'Remplaçant' };
          if (pId === target.playerOut?.id) return { ...p, role: 'Titulaire' };
          return p;
        });

        if (target.teamSide === 'home') {
          setHomeRoster(prevR => processRevert(prevR));
        } else {
          setAwayRoster(prevR => processRevert(prevR));
        }
      }

      // Retourne le nouveau tableau filtré
      return prev.filter(ev => ev.id !== dropId);
    });
     await refetchSchedules();
    toast.success('Événement supprimé.');
    handleCloseEventDrop();

  } catch (error) {
    toast.error(`Erreur survenue : ${error?.message || 'Erreur inconnue'}`);
    throw error;
  }
}, [eventDropId, deleteMatchEvent,refetchSchedules]); // N'oublie pas d'ajouter les dépendances requises au hook useCallback

  const handleDropOpen=(eventId)=>{
     setEventDropId(eventId)
     setEventShow(true);
  }

 

const updateMatchEvent = useCallback(async (updatedEvent) => {
  try {
   
    const eventType = updatedEvent?.eventType;
    const eventId = updatedEvent?.id;
    const newTime = updatedEvent?.time;

    // Payload qui sera envoyé à l'API et mis à jour localement
    let newPlayerPayload = null;

    // 1. Gestion spécifique si c'est un Changement (Substitution)
    if (eventType === "🔄 Changement" || updatedEvent?.isSubstitution) {
      await updateMatchEventTimeOrPlayer({
        variables: {
          eventId: eventId,
          newTime: newTime,
          newPlayer: null // On passe null explicitement pour une substitution
        }
      });
    } else {
      // 2. Gestion des événements standards (But, Carton, etc.)
      const playerId = updatedEvent?.playerId;

      // CORRECTION : rosters étant un tableau, on extrait tous les acteurs de chaque côté ('home' et 'away')
      const allActors = Array.isArray(rosters) 
        ? rosters.flatMap(r => r?.actors || []) 
        : (rosters?.getMatchRosters?.flatMap(r => r?.actors || []) || []);

      // On cherche l'acteur correspondant dans ce tableau à plat
      const actorFound = allActors.find(actor => actor?.playerId === playerId);
     
      // Construction sécurisée de l'objet du joueur pour l'API
      newPlayerPayload = actorFound ? {
        id: actorFound.playerId,
        name: actorFound.nom,
        // Évite le piège du null/undefined et convertit proprement en chaîne
        dorsa: actorFound.dorsa !== undefined && actorFound.dorsa !== null ? String(actorFound.dorsa) : null
      } : null;

      await updateMatchEventTimeOrPlayer({
        variables: {
          eventId: eventId,
          newTime: newTime,
          newPlayer: newPlayerPayload
        }
      });
    }

    // 3. Mise à jour de l'état local uniquement après succès de la requête API
    setMatchEvents(prev => 
      prev.map(ev => {
        if (ev.id === updatedEvent.id) {
          return { 
            ...ev, 
            ...updatedEvent,
            // On injecte le nouveau payload pour que l'interface (EventList) affiche immédiatement les bonnes infos
            player: updatedEvent.playerId ? newPlayerPayload : ev.player 
          };
        }
        return ev;
      })
    );

    // 4. Rafraîchissement des données globales
    if (typeof refetchSchedules === "function") {
      await refetchSchedules();
    }

    toast.success("Modification effectuée avec succès !");

  } catch (error) {
    console.error("Erreur updateMatchEvent:", error);
    toast.error(`Une erreur est survenue : ${error?.message || "Erreur inconnue"}`);
    throw error;
  }
// Ne pas oublier d'inclure 'rosters' dans les dépendances du hook
}, [rosters, updateMatchEventTimeOrPlayer, refetchSchedules]);
  return {
    apiTeams, team_loaded, schedules, loaded_schedule, groups, group_loaded, roster_loaded,
    selectedMatch, handleSelectMatch, searchQuery, setSearchQuery, filteredMatches,
    matchStatus, setMatchStatus, seconds, setSeconds, isActive, setIsActive, formatTime,
    matchEvents, openPlayerSelectModal, eventTriggerConfig, setEventTriggerConfig,
    submitStandardEvent, submitMultipleSubstitutionEvents, deleteEvent, updateMatchEvent,
    isModalOpen, setIsModalOpen, activeTeamType, setActiveTeamType, formType, setFormType,
    assignmentForm, setAssignmentForm, homeRoster, awayRoster, isHomeSaved, isAwaySaved,
    currentProvisionalList, currentStats, availableUsersFromDb,
    addMemberToProvisionalList, removeMemberFromProvisionalList, saveFinalRoster,
    getLiveRosterBySide, clearEntireRosterFromDb, roster_added, switchMode,add_stan,add_sub,handleCloseEventDrop,handleDropOpen,eventShow,eventDropId,event_droped
  };
};