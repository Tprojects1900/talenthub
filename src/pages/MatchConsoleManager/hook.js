import { useState, useEffect, useMemo, useCallback,useRef } from 'react';
import { useTeams, useGroups, useSchedules, useMatchRosters } from '../../hooks/useCalls';
import { useAddMatchRoster, useRemoveMatchRoster, useDropActor, useSwitchMatchMode, useCreateStandarEvent, useCreateSub ,useDropEvent,useEditTimerOrPlayer} from '../../lib/graphql.service';
import { toast } from 'react-toastify';

export const useMatchConsole = () => {
  const [eventDropId, setEventDropId] = useState(null);
  const [eventShow, setEventShow] = useState(false);
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
  const [displayTime, setDisplayTime] = useState("00:00");

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

  useEffect(() => {
    refetchRosters();
  }, [refetchRosters]);


// Contient le nombre de secondes du timer reçu depuis l'API
const baseSecondsRef = useRef(0);

// Contient la date à laquelle on a reçu ce timer
const timerFetchedAtRef = useRef(Date.now());

const getLiveTimer = useCallback(() => {
  const elapsedSeconds = Math.floor(
    (Date.now() - timerFetchedAtRef.current) / 1000
  );

  const totalSeconds = baseSecondsRef.current + elapsedSeconds;

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}, []);

useEffect(() => {
  if (!selectedMatch) return;

  // Match terminé ou pas encore commencé
  if (selectedMatch.status !== "live") {
    setDisplayTime(selectedMatch.timer || "00:00");
    return;
  }

  // Conversion du timer reçu de l'API ("28:08") en secondes
  let baseSeconds = 0;

  if (selectedMatch.timer?.includes(":")) {
    const [mins, secs] = selectedMatch.timer.split(":").map(Number);

    if (!isNaN(mins) && !isNaN(secs)) {
      baseSeconds = mins * 60 + secs;
    }
  }

  // On mémorise la valeur reçue et le moment où on l'a reçue
  baseSecondsRef.current = baseSeconds;
  timerFetchedAtRef.current = Date.now();

  // Affichage immédiat
  setDisplayTime(selectedMatch.timer);

  // Incrémentation locale chaque seconde
  const interval = setInterval(() => {
    setDisplayTime(getLiveTimer());
  }, 1000);

  return () => clearInterval(interval);
}, [selectedMatch, getLiveTimer]);

  // Synchronisation du statut depuis la BDD
  useEffect(() => {
    if (selectedMatch) {
      const currentStatus = selectedMatch.status || 'programmed';
      setMatchStatus(currentStatus);
    }
  }, [selectedMatch]);

  // Synchronisation intelligente des rosters
  useEffect(() => {
    if (!rosters || rosters.length === 0) {
      if (isHomeSaved) { setHomeRoster([]); setIsHomeSaved(false); }
      if (isAwaySaved) { setAwayRoster([]); setIsAwaySaved(false); }
      return;
    }

    const homeData = rosters.find(r => r.side === 'home');
    const awayData = rosters.find(r => r.side === 'away');

    if (homeData) {
      setIsHomeSaved(homeData.isSaved || false);
      setHomeRoster(homeData.actors || []);
    } else if (isHomeSaved) {
      setHomeRoster([]);
      setIsHomeSaved(false);
    }

    if (awayData) {
      setIsAwaySaved(awayData.isSaved || false);
      setAwayRoster(awayData.actors || []);
    } else if (isAwaySaved) {
      setAwayRoster([]);
      setIsAwaySaved(false);
    }
  }, [rosters, isHomeSaved, isAwaySaved]);

  // Alimentation initiale des faits de jeu
  useEffect(() => {
    if (!selectedMatch) return;
    setMatchEvents(selectedMatch?.events || []);
  }, [selectedMatch]);

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
    const side = String(activeTeamType).toLowerCase();
    
    if (side === 'home') return selectedMatch.homeTeam;
    if (side === 'away') return selectedMatch.awayTeam;
    return null;
  }, [selectedMatch, activeTeamType]);

  const availableUsersFromDb = useMemo(() => {
    if (!currentTeamData) return [];
    const members = currentTeamData.members || currentTeamData.membres || [];
    
    return members.filter(u => {
      const alreadyAdded = currentProvisionalList.some(
        p => String(p.playerId || p.id || p.userId) === String(u.id || u._id)
      );
      if (alreadyAdded) return false;

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
    const currentStatus = match?.status || 'programmed';
    setMatchStatus(currentStatus);
    setMatchEvents(match?.events || []);
    setEventTriggerConfig(null);
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

    if (activeTeamType === 'home') {
      setHomeRoster(prev => prev.filter(p => (p.playerId || p.id) !== targetPlayerId));
    } else {
      setAwayRoster(prev => prev.filter(p => (p.playerId || p.id) !== targetPlayerId));
    }

    if (isSaved && matchId && currentTeamId && targetPlayerId) {
      try {
        await deleteActorFromRoster({
          variables: { matchId, teamId: currentTeamId, playerId: targetPlayerId }
        });
        await refetchRosters();
        toast.success("Membre retiré avec succès !");
      } catch (error) {
        toast.error(`Erreur lors de la suppression : ${error.message}`);
      }
    }
  };

  const getMode=(mode)=>{
   switch(mode){
    case 'start':
      return 'live';
    case 'restart':
      return 'live';
    case 'pause':
      return 'half-time';
    default :
    return mode;      
   }
  }

  const switchMode = async (mode) => {
    if (!selectedMatch) return;
    const targetMatchId = selectedMatch.id || selectedMatch._id;

    try {
      const { data } = await switchMatchMode({
        variables: { matchId: targetMatchId, mode },
      });

      if (data?.switchMatchMode) {
        setMatchStatus(mode);
        setSelectedMatch(prev => prev ? { ...prev, status: getMode(mode) } : null);
        showToast(getMode(mode));
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
    if (!window.confirm("Voulez-vous vraiment effacer toute la composition ?")) return;
    
    try {
      await removeMatchRosterApi({ variables: { matchId, teamId: currentTeamId } });
      
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

  // Branché directement sur la valeur dynamique de displayTime
  const openPlayerSelectModal = (type, teamSide) => {
    setEventTriggerConfig({ type, teamSide, eventTime: displayTime });
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
      toast.error(`Erreur lors de l'enregistrement : ${error.message}`);
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

  const handleCloseEventDrop = () => {
    setEventDropId(null);
    setEventShow(false);
  };

  const deleteEvent = useCallback(async (eventId) => {
    const dropId = eventDropId || eventId;
    if (!dropId) return;

    try {
      await deleteMatchEvent({ variables: { eventId: dropId } });

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
        return prev.filter(ev => ev.id !== dropId);
      });

      await refetchSchedules();
      toast.success('Événement supprimé.');
      handleCloseEventDrop();
    } catch (error) {
      toast.error(`Erreur survenue : ${error?.message || 'Erreur inconnue'}`);
      throw error;
    }
  }, [eventDropId, deleteMatchEvent, refetchSchedules]);

  const handleDropOpen = (eventId) => {
    setEventDropId(eventId);
    setEventShow(true);
  };

  const updateMatchEvent = useCallback(async (updatedEvent) => {
    try {
      const eventType = updatedEvent?.eventType;
      const eventId = updatedEvent?.id;
      const newTime = updatedEvent?.time;

      let newPlayerPayload = null;

      if (eventType === "🔄 Changement" || updatedEvent?.isSubstitution) {
        await updateMatchEventTimeOrPlayer({
          variables: { eventId, newTime, newPlayer: null }
        });
      } else {
        const playerId = updatedEvent?.playerId;
        const allActors = Array.isArray(rosters) 
          ? rosters.flatMap(r => r?.actors || []) 
          : (rosters?.getMatchRosters?.flatMap(r => r?.actors || []) || []);

        const actorFound = allActors.find(actor => actor?.playerId === playerId);
       
        newPlayerPayload = actorFound ? {
          id: actorFound.playerId,
          name: actorFound.nom,
          dorsa: actorFound.dorsa !== undefined && actorFound.dorsa !== null ? String(actorFound.dorsa) : null
        } : null;

        await updateMatchEventTimeOrPlayer({
          variables: { eventId, newTime, newPlayer: newPlayerPayload }
        });
      }

      setMatchEvents(prev => 
        prev.map(ev => {
          if (ev.id === updatedEvent.id) {
            return { 
              ...ev, 
              ...updatedEvent,
              player: updatedEvent.playerId ? newPlayerPayload : ev.player 
            };
          }
          return ev;
        })
      );

      if (typeof refetchSchedules === "function") {
        await refetchSchedules();
      }

      toast.success("Modification effectuée avec succès !");
    } catch (error) {
      console.error("Erreur updateMatchEvent:", error);
      toast.error(`Une erreur est survenue : ${error?.message || "Erreur inconnue"}`);
      throw error;
    }
  }, [rosters, updateMatchEventTimeOrPlayer, refetchSchedules]);

  return {
    apiTeams, team_loaded, schedules, loaded_schedule, groups, group_loaded, roster_loaded,
    selectedMatch, handleSelectMatch, searchQuery, setSearchQuery, filteredMatches,
    matchStatus, setMatchStatus, displayTime, setDisplayTime,
    matchEvents, openPlayerSelectModal, eventTriggerConfig, setEventTriggerConfig,
    submitStandardEvent, submitMultipleSubstitutionEvents, deleteEvent, updateMatchEvent,
    isModalOpen, setIsModalOpen, activeTeamType, setActiveTeamType, formType, setFormType,
    assignmentForm, setAssignmentForm, homeRoster, awayRoster, isHomeSaved, isAwaySaved,
    currentProvisionalList, currentStats, availableUsersFromDb,
    addMemberToProvisionalList, removeMemberFromProvisionalList, saveFinalRoster,
    getLiveRosterBySide, clearEntireRosterFromDb, roster_added, switchMode, add_stan, add_sub, 
    handleCloseEventDrop, handleDropOpen, eventShow, eventDropId, event_droped
  };
};