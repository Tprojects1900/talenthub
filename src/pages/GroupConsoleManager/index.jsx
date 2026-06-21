import React, { useState, useEffect ,useMemo} from 'react';
import { 
  FolderPlus, Users, Calendar, MapPin, ArrowLeftRight, Clock, 
  Plus, Trash2, X, CheckCircle, LayoutGrid, Award, UserPlus
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useTeams, useSchedules } from '../../hooks/useCalls';
import ConfirmModal from "../../components/modals/ConfirmationModal"; 
import { useScreen } from '../../context/ScreenContext';
import { formatDateTime } from '../../utils/dateUtils';
import { 
  useAddGroup, useRemoveGroup, useEditGroupTeams, useGetGroups, 
  useSaveSchedule, useRemoveSchedule 
} from "../../lib/graphql.service";
import { toast } from 'react-toastify';

const GroupAndMatchManager = () => {
  const { teams: apiTeams, refetchTeams, loading: fetching } = useTeams();
  const { schedules, refetchSchedules, loaded_schedule } = useSchedules();
  
  // --- ÉTATS DES MODALS DE SUPPRESSION ---
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'group' | 'schedule'

  // --- HOOKS GRAPHQL DYNAMIQUES ---
  const { data: groupsData, loading: loadingGroups, refetch: refetchGroups } = useGetGroups();
  const [createGroup ,{loading:group_added}] = useAddGroup();
  const [removeGroup, { loading: group_droped }] = useRemoveGroup();
  const [editGroupTeams] = useEditGroupTeams();
  const [saveMatchSchedule,{loading:save_loaded}] = useSaveSchedule();
  const [deleteScheduledMatch,{loading:schedule_droped}] = useRemoveSchedule();

  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState('groupes'); 
  const [groupName, setGroupName] = useState('');
  // const [groups, setGroups] = useState([]); 
  // const [teamsList, setTeamsList] = useState([]);

  // États de programmation des matchs
  // const [scheduledMatches, setScheduledMatches] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatchToSchedule, setCurrentMatchToSchedule] = useState(null);
  const [isDirectCreation, setIsDirectCreation] = useState(false);
  const [activeSelectGroupId, setActiveSelectGroupId] = useState(null);
  
  // État du formulaire du Modal de programmation
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    pitch: '',
    homeId: '',
    awayId: '',
    typeConfrontation: ''
  });

  const suggestionsType = ['1ère Journée', '2ème Journée', '3ème Journée', '1/8 de finale', '1/4 de finale', '1/2 finale', 'Finale'];

const teamsList = useMemo(() => {
  return (apiTeams || []).map(team => ({
    ...team,
    membres: team.membres || team.members || []
  }));
}, [apiTeams]);

const groups = useMemo(
  () => groupsData?.getGroups || [],
  [groupsData]
);

const scheduledMatches = useMemo(
  () => schedules || [],
  [schedules]
);

  // --- GESTION DES MODALS DE CONFIRMATION ---
  const handleClose = () => {
    setOpenDeleteModal(false);
    setDeletedId(null);
    setDeleteType(null);
  };

  const handleOpenDelete = (itemId, type) => {
    setDeletedId(itemId);
    setDeleteType(type);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteType === 'group') {
      await deleteGroup();
    } else if (deleteType === 'schedule') {
      await executeRemoveSchedule();
    }
  };
  
  // --- GESTION DES GROUPES (DYNAMIQUE) ---
  const addGroup  = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
   // console.log(groupName,"groupName")
    try {
      const {data} = await createGroup({
        variables: { input: { name: groupName.trim() } }
      });
     // console.log(data);
      if (data.createGroup.success) {
        toast.success(data.createGroup.message);
        setGroupName('');
        refetchGroups();
      } else {
        toast.error(data.createGroup.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la création du groupe.");
     // console.error(error);
    }
  };

  const deleteGroup = async () => {
    try {
      const {data} = await removeGroup({
        variables: { deleteGroupId: deletedId }
      });

      if (data.deleteGroup.success) {
        toast.success(data.deleteGroup.message);
        if (activeSelectGroupId === deletedId) setActiveSelectGroupId(null);
        refetchGroups();
        handleClose();
      } else {
        toast.error(data.deleteGroup.message);
        handleClose();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du groupe.");
    }
  };

  const persistGroupTeamsUpdate = async (groupId, targetTeamIds) => {
    try {
      const {data} = await editGroupTeams({
        variables: {
          input: {
            groupId: groupId,
            teamIds: targetTeamIds
          }
        }
      });
      if (data.updateGroupTeams.success) {
        refetchGroups();
      } else {
        toast.error(data.updateGroupTeams.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la poule.");
    }
  };

  // --- AJOUT RAPIDE VIA SÉLECTEUR (DYNAMIQUE) ---
  const handleQuickAddTeam = async (groupId, teamId) => {
    if (!teamId) return;
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup || targetGroup.teamIds.includes(teamId)) return;

    const newTeamIds = [...targetGroup.teamIds, teamId];
    await persistGroupTeamsUpdate(groupId, newTeamIds);
    setActiveSelectGroupId(null);
  };

  // --- GESTION DU DRAG & DROP (DYNAMIQUE) ---
  const handleDragStart = (e, teamId, sourceGroupId = null) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ teamId, sourceGroupId }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropOnGroup = async (e, targetGroupId) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;
    const { teamId, sourceGroupId } = JSON.parse(dataStr);
    
    if (sourceGroupId === targetGroupId) return;

    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (targetGroup.teamIds.includes(teamId)) return;

    if (sourceGroupId) {
      const sourceGroup = groups.find(g => g.id === sourceGroupId);
      if (sourceGroup) {
        const cleanedSourceIds = sourceGroup.teamIds.filter(id => id !== teamId);
        await persistGroupTeamsUpdate(sourceGroupId, cleanedSourceIds);
      }
    }

    const newTargetIds = [...targetGroup.teamIds, teamId];
    await persistGroupTeamsUpdate(targetGroupId, newTargetIds);
  };

  const handleDropOutside = async (e) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;
    const { teamId, sourceGroupId } = JSON.parse(dataStr);
    
    if (sourceGroupId) {
      const sourceGroup = groups.find(g => g.id === sourceGroupId);
      if (sourceGroup) {
        const cleanedIds = sourceGroup.teamIds.filter(id => id !== teamId);
        await persistGroupTeamsUpdate(sourceGroupId, cleanedIds);
      }
    }
  };

  const removeTeamFromGroup = async (groupId, teamId) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return;
    
    const cleanedIds = targetGroup.teamIds.filter(id => id !== teamId);
    await persistGroupTeamsUpdate(groupId, cleanedIds);
  };

  const unassignedTeams = teamsList.filter(t => !groups.reduce((acc, g) => [...acc, ...g.teamIds], []).includes(t.id));

  // --- GÉNÉRATION DES MATCHS DU TABLEAU DE POULE ---
  const generateConfrontations = () => {
    let matches = [];
    groups.forEach(group => {
      const tIds = group.teamIds;
      if (tIds.length < 2) return;
      for (let i = 0; i < tIds.length; i++) {
        for (let j = i + 1; j < tIds.length; j++) {
          matches.push({
            id: `${group.id}_${tIds[i]}_${tIds[j]}`,
            groupId: group.id,
            groupName: group.name,
            teamA_Id: tIds[i],
            teamB_Id: tIds[j],
          });
        }
      }
    });
    return matches;
  };

  // --- FONCTION DE RECHERCHE ROBUSTE (INVERSION HOME/AWAY) ---
  const findExistingSchedule = (match) => {
    if (!match) return null;
    return scheduledMatches.find(sm => 
      (sm.matchId === match.id) || 
      (sm.homeId === match.teamA_Id && sm.awayId === match.teamB_Id) || 
      (sm.homeId === match.teamB_Id && sm.awayId === match.teamA_Id)
    );
  };

  // --- MODAL DE PROGRAMMATION & PERSISTANCE GRAPHQL ---
  const openScheduleModal = (match, directMode = false) => {
    setIsDirectCreation(directMode);
    if (directMode) {
      setCurrentMatchToSchedule({ id: 'direct_' + Date.now(), groupName: 'Hors Poule / Direct' });
      setScheduleForm({ date: '', time: '', pitch: '', homeId: '', awayId: '', typeConfrontation: '' });
    } else {
      const existing = findExistingSchedule(match);
      setCurrentMatchToSchedule(match);
      setScheduleForm({
        date: existing ? existing.date : '',
        time: existing ? existing.time : '',
        pitch: existing ? existing.pitch : '',
        homeId: existing ? existing.homeId : match.teamA_Id,
        awayId: existing ? existing.awayId : match.teamB_Id,
        typeConfrontation: existing ? existing.typeConfrontation : ''
      });
    }
    setIsModalOpen(true);
  };

  const saveMatchSched = async (e) => {
    e.preventDefault();
    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.typeConfrontation.trim() || !scheduleForm.homeId || !scheduleForm.awayId) {
      toast.error("Champs obligatoires manquants.");
      return;
    }

    const existingSchedule = isDirectCreation ? null : findExistingSchedule(currentMatchToSchedule);
    const isUpdating = !!existingSchedule;

    const inputVariables = {
      id: isUpdating ? existingSchedule.id : undefined, 
      matchId: currentMatchToSchedule.id,
      groupName: isDirectCreation ? 'Hors Poule / Direct' : currentMatchToSchedule.groupName,
      homeId: scheduleForm.homeId,
      awayId: scheduleForm.awayId,
      date: scheduleForm.date,
      time: scheduleForm.time,
      pitch: scheduleForm.pitch.trim() || 'Maya Kopé',
      typeConfrontation: scheduleForm.typeConfrontation.trim()
    };

    try {
      const { data } = await saveMatchSchedule({ variables: { input: inputVariables } });
      if (data.saveMatchSchedule.success) {
        toast.success(data.saveMatchSchedule.message || "Match enregistré avec succès !");
        refetchSchedules(); 
        setIsModalOpen(false);
        setCurrentMatchToSchedule(null);
      } else {
        toast.error(data.saveMatchSchedule.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du match.");
    }
  };

  const executeRemoveSchedule = async () => {
    try {
      const { data } = await deleteScheduledMatch({ variables: { deleteScheduledMatchId: deletedId } });
      if (data.deleteScheduledMatch.success) {
        toast.success(data.deleteScheduledMatch.message || "Planification supprimée.");
        refetchSchedules();
        handleClose();
      } else {
        toast.error(data.deleteScheduledMatch.message);
        handleClose();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la planification.");
    }
  };

  const getSortedScheduledMatches = () => {
    return [...scheduledMatches].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
  };

  const getTeam = (id) => teamsList.find(t => t.id === id) || { nom: 'À définir' };

  const isFormUpdating = !isDirectCreation && !!findExistingSchedule(currentMatchToSchedule);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-zinc-950 text-white p-3 sm:p-6 font-sans select-none overflow-x-hidden" onDragOver={handleDragOver} onDrop={handleDropOutside}>
        
        {/* HEADER */}
        <div className="max-w-6xl mx-auto border-b border-zinc-900 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2 flex-wrap">
              <LayoutGrid className="text-[#FFD700] shrink-0" size={20} /> 
              <span>Organisation</span> 
              <span className="text-[#FFD700]">/ Poules & Matchs</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 break-words">Gerez vos compositions d'équipes et planifiez vos journées de match.</p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap bg-zinc-900 p-1 rounded-xl border border-zinc-850 self-start md:self-auto gap-1 sm:gap-0">
            <button onClick={() => setActiveTab('groupes')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-black uppercase rounded-lg transition-all ${activeTab === 'groupes' ? 'bg-[#FFD700] text-zinc-950' : 'text-zinc-400'}`}>
              Groupes
            </button>
            <button onClick={() => setActiveTab('confrontations')} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-black uppercase rounded-lg transition-all ${activeTab === 'confrontations' ? 'bg-[#FFD700] text-zinc-950' : 'text-zinc-400'}`}>
              Confrontations ({generateConfrontations().length})
            </button>
          </div>
        </div>

        {/* CONTAINER PRINCIPAL */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* PANNEAU DE GAUCHE & MILIEU (2 COLONNES SUR LARGE ÉCRAN) */}
            <div className="lg:col-span-2 space-y-6 min-w-0">
              
              {activeTab === 'groupes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  
                  {/* Formulaire & Vivier Équipes */}
                  <div className="md:col-span-1 space-y-4 min-w-0">
                    <form onSubmit={addGroup} className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 space-y-3">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Créer un nouveau groupe</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="Ex: Poule A" required value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                        />
                        <button disabled={group_added} type="submit" className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white shrink-0"><Plus size={14} /></button>
                      </div>
                    </form>

                    <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-4 space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">Membres Isolés ({unassignedTeams.length})</h3>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 min-w-0">
                        {unassignedTeams.map(team => (
                          <div key={team.id} draggable onDragStart={(e) => handleDragStart(e, team.id)} className="bg-zinc-950 border border-zinc-850 p-2 rounded-xl flex items-center justify-between gap-2 cursor-grab text-xs hover:border-zinc-700 transition-colors">
                            <span className="font-bold text-zinc-300 truncate">{team.nom}</span>
                            <span className="text-[9px] text-zinc-600 font-medium shrink-0 truncate">{team.quartier}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Les Poules Actuelles */}
                  <div className="md:col-span-2 space-y-3 min-w-0">
                    {groups.length === 0 ? (
                      <div className="text-center py-12 text-zinc-600 text-xs font-medium border border-dashed border-zinc-850 rounded-2xl">Aucune poule active actuellement.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {groups.map(group => (
                          <div key={group.id} onDragOver={handleDragOver} onDrop={(e) => handleDropOnGroup(e, group.id)} className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl min-h-[150px] flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5 mb-2 gap-2">
                                <span className="text-[11px] font-black uppercase text-zinc-300 truncate">{group.name} ({group.teamIds?.length || 0})</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button 
                                    title="Ajouter une équipe directement"
                                    onClick={() => setActiveSelectGroupId(activeSelectGroupId === group.id ? null : group.id)}
                                    className={`p-1 rounded transition-colors ${activeSelectGroupId === group.id ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950' : 'text-zinc-500 hover:text-[#FFD700]'}`}
                                  >
                                    <UserPlus size={13} />
                                  </button>
                                  <button onClick={() => handleOpenDelete(group.id, 'group')} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                                </div>
                              </div>

                              {activeSelectGroupId === group.id && (
                                <div className="mb-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 animate-fadeIn">
                                  <select
                                    onChange={(e) => handleQuickAddTeam(group.id, e.target.value)}
                                    defaultValue=""
                                    className="w-full bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-[11px] font-medium text-zinc-300 outline-none"
                                  >
                                    <option value="" disabled>-- Choisir une équipe libre --</option>
                                    {unassignedTeams.map(t => (
                                      <option key={t.id} value={t.id}>{t.nom} ({t.quartier})</option>
                                    ))}
                                    {unassignedTeams.length === 0 && (
                                      <option disabled>Aucune équipe libre disponible</option>
                                    )}
                                  </select>
                                </div>
                              )}

                              <div className="space-y-1">
                                {group.teamIds?.map(tId => (
                                  <div key={tId} draggable onDragStart={(e) => handleDragStart(e, tId, group.id)} className="bg-zinc-950 px-2 py-1.5 rounded-lg flex justify-between items-center gap-2 text-xs border border-zinc-900 hover:border-zinc-800">
                                    <span className="text-zinc-300 font-semibold truncate">{getTeam(tId).nom}</span>
                                    <button onClick={() => removeTeamFromGroup(group.id, tId)} className="text-zinc-700 hover:text-zinc-400 transition-colors shrink-0"><X size={11} /></button>
                                  </div>
                                ))}
                                {(!group.teamIds || group.teamIds.length === 0) && (
                                  <p className="text-[10px] text-zinc-700 italic py-2 text-center">Glissez une équipe ici</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'confrontations' && (
                <div className="space-y-3 min-w-0">
                  <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase">Calendrier des Confrontations</h3>
                  {generateConfrontations().length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 text-xs font-medium border border-dashed border-zinc-850 rounded-2xl">Aucun match interne générable. Remplissez vos poules.</div>
                  ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 min-w-0">
                      {generateConfrontations().map(match => {
                        const prog = findExistingSchedule(match);
                        const displayedHomeName = prog ? getTeam(prog.homeId).nom : getTeam(match.teamA_Id).nom;
                        const displayedAwayName = prog ? getTeam(prog.awayId).nom : getTeam(match.teamB_Id).nom;

                        return (
                          <div key={match.id} className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 min-w-0">
                            <div className="min-w-0 flex-1">
                              <span className="inline-block text-[8px] font-black tracking-wider text-zinc-500 uppercase bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850 truncate">{match.groupName}</span>
                              <div className="text-xs font-bold text-zinc-200 mt-1 break-words">
                                {displayedHomeName} <span className="text-[#FFD700] text-[9px]">VS</span> {displayedAwayName}
                              </div>
                              {prog ? (
                                <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                                  <span className="bg-emerald-950/40 px-1 rounded border border-emerald-900/30">{prog.typeConfrontation}</span>
                                  <span>• {formatDateTime(prog.date,prog.time)}</span>
                                  <span className="text-zinc-500 truncate">({prog.pitch})</span>
                                </div>
                              ) : (
                                <span className="block text-[10px] text-zinc-600 italic mt-0.5">Pas encore de planification</span>
                              )}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto items-center shrink-0">
                              <button 
                                onClick={() => openScheduleModal(match, false)} 
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider transition-colors ${
                                  prog 
                                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700' 
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950'
                                }`}
                              >
                                {prog ? 'Ajuster' : 'Planifier'}
                              </button>
                              {prog && (
                                <button 
                                  onClick={() => handleOpenDelete(prog.id, 'schedule')} 
                                  className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 rounded-lg transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PANNEAU DE DROITE : CALENDRIER GENERAL */}
            <div className="lg:col-span-1 space-y-4 min-w-0 w-full">
              <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
                <h3 className="text-xs font-black tracking-widest text-[#FFD700] uppercase flex items-center gap-1.5">
                  <Clock size={13} /> Calendrier ({scheduledMatches.length})
                </h3>
                <button
                  onClick={() => openScheduleModal(null, true)}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 hover:text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors shrink-0"
                >
                  <Plus size={11} className="text-[#FFD700]" /> Direct
                </button>
              </div>

              <div className="space-y-2 max-h-[65vh] lg:max-h-[75vh] overflow-y-auto pr-1 min-w-0">
                {scheduledMatches.length === 0 ? (
                  <div className="text-center py-10 text-zinc-600 text-xs font-medium border border-dashed border-zinc-850 rounded-2xl bg-zinc-900/10">
                    Aucun créneau validé.
                  </div>
                ) : (
                  getSortedScheduledMatches().map(match => (
                    <div key={match.id} className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-850 p-3 rounded-xl space-y-2 relative overflow-hidden group min-w-0">
                      <div className="flex justify-between items-center text-[9px] font-mono gap-2">
                        <span className="font-black text-[#FFD700] uppercase bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900 truncate">{match.typeConfrontation}</span>
                        <div className="text-zinc-400 font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900 flex gap-2 shrink-0">
                          <span className='text-emerald-400'>{formatDateTime(match.date,match?.time)}</span>
                          {/* <span className="text-emerald-400">{match.time}</span> */}
                        </div>
                      </div>
                      <div className="text-xs font-black text-zinc-200 flex justify-between items-center gap-2">
                        <span className="truncate">{getTeam(match.homeId).nom} <span className="text-[9px] text-zinc-500 font-normal italic"></span></span>
                        <span className="text-zinc-650 font-serif text-[10px] shrink-0">vs</span>
                        <span className="text-right truncate">{getTeam(match.awayId).nom} <span className="text-[9px] text-zinc-500 font-normal italic"></span></span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold border-t border-zinc-900 pt-1.5 gap-2">
                        <span className="flex items-center gap-0.5 text-zinc-400 truncate"><MapPin size={9} className="text-[#FFD700] shrink-0" /> {match.pitch}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="uppercase text-[8px] bg-zinc-950 text-zinc-500 px-1 rounded border border-zinc-900 max-w-[80px] truncate">{match.groupName}</span>
                          <button 
                            onClick={() => handleOpenDelete(match.id, 'schedule')} 
                            className="text-zinc-500 hover:text-red-400 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* MODAL DE PROGRAMMATION (PROPRE & SECURISE) */}
     {isModalOpen && currentMatchToSchedule && (
  <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
    <form onSubmit={saveMatchSched} className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl my-auto">
      
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2 gap-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 truncate">
          <Calendar size={13} className="text-[#FFD700]" /> <span>{isFormUpdating ? 'Ajuster' : 'Configurer'}</span>
        </h4>
        <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white shrink-0"><X size={15} /></button>
      </div>

      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-3">
        <div>
          <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">
            Type / Journée de la Confrontation *
          </label>
          <input 
            type="text" placeholder="Ex: 1ère Journée..." required
            value={scheduleForm.typeConfrontation}
            onChange={(e) => setScheduleForm({ ...scheduleForm, typeConfrontation: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 focus:outline-none focus:border-[#FFD700]"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {suggestionsType.map(st => (
              <button
                key={st} type="button" onClick={() => setScheduleForm({ ...scheduleForm, typeConfrontation: st })}
                className="text-[8px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-850 px-1.5 py-0.5 rounded"
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-900">
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Date *</label>
            <input 
              type="date" required value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Heure *</label>
            <input 
              type="time" required value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-900">
          <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Terrain / Emplacement</label>
          <input 
            type="text" placeholder="Ex: Maya Kopé" value={scheduleForm.pitch}
            onChange={(e) => setScheduleForm({ ...scheduleForm, pitch: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        {/* SECTION DES ÉQUIPES AVEC OPTION DE PERMUTATION (SWITCH) */}
        <div className="relative pt-2 border-t border-zinc-900">
          
          {/* Bouton de Permutation Absolu */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={() => setScheduleForm({
                ...scheduleForm,
                homeId: scheduleForm.awayId,
                awayId: scheduleForm.homeId
              })}
              title="Inverser Domicile / Extérieur"
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-[#FFD700] rounded-lg transition-all shadow-md flex items-center justify-center group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-0 sm:rotate-90 transition-transform duration-300 group-hover:scale-110">
                <path d="m7 21-4-4 4-4"/>
                <path d="M3 17h18"/>
                <path d="m17 3 4 4-4 4"/>
                <path d="M21 7H3"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Bloc Domicile */}
            <div>
              <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Équipe Domicile *</label>
              {isDirectCreation ? (
                <select
                  required value={scheduleForm.homeId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, homeId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 font-semibold outline-none focus:border-[#FFD700]"
                >
                  <option value="">-- Choisir --</option>
                  {teamsList.map(t => (
                    <option key={t.id} value={t.id} disabled={t.id === scheduleForm.awayId}>{t.nom}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-300 truncate min-h-[36px] flex items-center">
                  {getTeam(scheduleForm.homeId)?.nom || "Non définie"}
                </div>
              )}
            </div>

            {/* Bloc Extérieur */}
            <div>
              <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Équipe Extérieur *</label>
              {isDirectCreation ? (
                <select
                  required value={scheduleForm.awayId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, awayId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded-lg text-zinc-200 font-semibold outline-none focus:border-[#FFD700]"
                >
                  <option value="">-- Choisir --</option>
                  {teamsList.map(t => (
                    <option key={t.id} value={t.id} disabled={t.id === scheduleForm.homeId}>{t.nom}</option>
                  ))}
                </select>
              ) : (
                <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-xs font-bold text-zinc-300 truncate min-h-[36px] flex items-center">
                  {getTeam(scheduleForm.awayId)?.nom || "Non définie"}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors">
          Annuler
        </button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all">
          {save_loaded ? "En cours...": ' Confirmer'}
        </button>
      </div>
    </form>
  </div>
)}

        {/* MODAL DE CONFIRMATION DE SUPPRESSION (REUTILISABLE) */}
        <ConfirmModal 
          isOpen={openDeleteModal} 
          onClose={handleClose} 
          onConfirm={handleConfirmDelete} 
          title="Confirmation de suppression"
          message={deleteType === 'group' ? "Êtes-vous sûr de vouloir supprimer ce groupe ?" : "Êtes-vous sûr de vouloir annuler la planification de ce match ?"}
          loading={group_droped || schedule_droped}
        />

      </div>
    </AdminLayout>
  );
};

export default GroupAndMatchManager;