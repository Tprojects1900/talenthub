import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Pencil, Shield, Users, UserPlus, CheckCircle, MapPin, Quote, FolderPlus, Image, User
} from 'lucide-react';
import { useTeams } from '../../hooks/useCalls';
import TeamsTable from '../../components/tables/TeamsTable';
import { useRemoveTeam, useAddTeam ,useAddPlayer,useEditTeam,useEditPlayer,useRemovePlayer} from '../../lib/graphql.service';
import { toast } from 'react-toastify';
import AdminLayout from '../../layouts/AdminLayout';
import trophy from "../../assets/images/trophy.png"
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import Modal from "../../components/modals"
import EditForm from "../../components/forms/EditForm.jsx"


const TeamCreationManager = () => {
  const [openconfirm, setOpenConfirm] = useState(false);
  const [instanceToRem, setInstanceToRem] = useState(null);
  const [removeTeam, { loading: team_removed }] = useRemoveTeam();
  const [removePlayer, { loading: player_removed }] = useRemovePlayer();
  const [registerTeam, { loading: team_added }] = useAddTeam();
  const [createPlayer, { loading: player_added }] = useAddPlayer();
  const [updateTeamInfo, { loading: team_edited }] = useEditTeam();
  const [updatePlayerInfo, { loading: player_edited }] = useEditPlayer();
  const { teams: apiTeams, refetchTeams, loading: team_loaded } = useTeams();
  const [modalConfig, setModalConfig] = useState({
  isOpen: false,
  type: null, 
  data: null  
});

const [openRem,setOpenRem]=useState(false);
const [p_r,setP_r]=useState(null);

  const handleClose = () => {
    setInstanceToRem(null);
    setOpenConfirm(false);
    setModalConfig({
      isOpen:false,
      type:null,
      data:null
    })
    setOpenRem(false)
  };

  const handleConfirmP=(teamId,memberId)=>{
    setP_r(memberId);
    setOpenRem(true);
  }

  const handleOpenConfirm = (instanceId) => {
    setOpenConfirm(true)
    setInstanceToRem(instanceId);
  };

  const handleOpenEdit = (type, item) => {
  setModalConfig({
    isOpen: true,
    type: type,
    data: item
  });
};



  const columns = [
    {
      key: "logo",
      label: "# LOGO",
      render: (row) => (
        <img src={row.logo} className="w-10 h-10 rounded-full object-cover border border-gray-200" alt={row.nom} />
      )
    },
    { key: "nom", label: "NOM" },
    { key: "quartier", label: "QUARTIER" },
    { key: "code", label: "CODE" },
    { key: "slogan", label: "SLOGAN" },
    {
      key: "actions",
      label: "ACTIONS",
      render: (row) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleOpenEdit("team",row)}
            className="p-2 text-gray-600 hover:text-[#FFD700] hover:bg-gray-100 rounded-none transition-colors"
            title="Modifier l'équipe"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleOpenConfirm(row.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors"
            title="Supprimer l'équipe"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  // --- ÉTATS DES ÉQUIPES ---
  const [teamForm, setTeamForm] = useState({
    nom: '',
    slogan: '',
    quartier: '',
    code:'',
    logo: null,
    logoPreview: null
  });

  // Liste globale des équipes enregistrées localement
  const [teams, setTeams] = useState(apiTeams);
// Se déclenche dès que apiTeams change (après le chargement ou un rafraîchissement)
useEffect(() => {
  if (!apiTeams) return;

  setTeams(prev => {
    const formatted = apiTeams.map(team => ({
      ...team,
      membres: team.membres || team.members || []
    }));

    return JSON.stringify(prev) !== JSON.stringify(formatted)
      ? formatted
      : prev;
  });
}, [apiTeams]);
  // --- ÉTATS DES MEMBRES ---
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [memberForm, setMemberForm] = useState({
    nom: '',
    type: 'joueur',
    logo: null,
    logoPreview: null
  });

  // Références pour réinitialiser les inputs de type file
  const teamFileRef = useRef(null);
  const memberFileRef = useRef(null);

  // --- LOGIQUE : GESTION DES FICHIERS ---
  const handleImageChange = (e, isTeam) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (isTeam) {
        setTeamForm({ 
          ...teamForm, 
          logo: file,          
          logoPreview: previewUrl 
        });
      } else {
        setMemberForm({ 
          ...memberForm, 
          logo: file, 
          logoPreview: previewUrl 
        });
      }
    }
  };

  // --- LOGIQUE : CRÉER UNE ÉQUIPE ---
  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.nom.trim() || !teamForm.quartier.trim()) return;
    
    const rawFile = teamFileRef.current?.files[0] || teamForm.logo;

    try {
      const { data } = await registerTeam({
        variables: {
          input: {
            nom: teamForm.nom.trim(),
            slogan: teamForm.slogan.trim(),
            quartier: teamForm.quartier.trim(),
          },
          file: rawFile
        }
      });

      if (data?.registerTeam?.id) {
        const newT = data.registerTeam;
        
        refetchTeams();
        
        //  CORRECTION DU CORPS DU TABLEAU (Ajout propre sans écraser la structure de tableau)
        const formattedNewTeam = {
          id: newT.id,
          nom: newT.nom,
          slogan: newT.slogan,
          code:newT.code,
          quartier: newT.quartier,
          logo: newT.logo,
          membres: newT.members || [] // Aligné avec ton JSX qui utilise .membres
        };

        setTeams((prevTeams) => [...prevTeams, formattedNewTeam]);
        toast.success("Team ajoutée avec succès!");

        if (!selectedTeamId) {
          setSelectedTeamId(newT.id);
        }

        // Réinitialisation complète
        setTeamForm({ nom: '', slogan: '', quartier: '', logo: null, logoPreview: null });
        if (teamFileRef.current) teamFileRef.current.value = '';
        
      } else {
        toast.error("Une erreur est survenue pendant l'ajout de la team");
      }
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  // --- LOGIQUE : AJOUTER UN MEMBRE À UNE ÉQUIPE SÉLECTIONNÉE ---
 const addMemberToTeam = async (e) => {
  e.preventDefault();
  if (!selectedTeamId || !memberForm.nom.trim()) return;

  // 1. Récupération sécurisée du fichier binaire brut (comme pour team)
  const rawFile = memberFileRef.current?.files[0] || memberForm.logo;
     console.log("member form",memberForm,selectedTeamId)
  try {
    // 2. Appel à la mutation GraphQL
    const { data } = await createPlayer({
      variables: {
        input: {
          nom: memberForm.nom.trim(),
          teamId: selectedTeamId, // ID de la team cible
          type: memberForm.type // 'joueur' ou 'staff'
        },
        file: rawFile // Le fichier binaire transmis proprement grâce au lien d'upload
      }
    });

    // 3. Si le serveur valide la création
    if (data?.createPlayer?.id) {
      const newM = data.createPlayer;

      // On optionnellement refetch ou on met à jour l'état local "teams"
      refetchTeams(); // Si useTeams englobe aussi les membres, c'est le top

      const newMember = {
        id: newM.id,
        nom: newM.nom || memberForm.name.trim(),
        type: newM.type || memberForm.type,
        team:newM.team || null,
        logo: newM.logo || memberForm.logoPreview // URL finale du serveur ou preview locale
      };

      // Mise à jour de l'état local pour un affichage instantané dans les cartes
      setTeams(teams.map(team => {
        if (team.id === selectedTeamId) {
          return { ...team, membres: [...(team.membres || []), newMember] };
        }
        return team;
      }));

      toast.success("Membre ajouté avec succès !");

      // 4. Réinitialisation complète du formulaire membre
      setMemberForm({ nom: '', type: 'joueur', logo: null, logoPreview: null });
      if (memberFileRef.current) memberFileRef.current.value = '';

    } else {
      toast.error("Une erreur est survenue pendant l'ajout du membre");
    }
  } catch (error) {
    toast.error(error.message || "Une erreur est survenue");
  }
};
  // --- SUPPRIMER UN MEMBRE ---
  const removeMember = (teamId, memberId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return { ...team, membres: (team.membres || []).filter(m => m.id !== memberId) };
      }
      return team;
    }));
  };

  const handleRemoveTeam = async () => {
    if (!instanceToRem) return;
    try {
      const { data } = await removeTeam({
        variables: { removeTeamId: instanceToRem }
      });

      if (data?.removeTeam?.success) {
        refetchTeams();
        setTeams((prevTeams) => prevTeams.filter(t => t.id !== instanceToRem));
        toast.success(data?.removeTeam?.message || "Suppression effectuée");
      } else {
        toast.error(data?.removeTeam?.message || "Suppression impossible");
      }
      handleClose();
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };
const handleSaveEdit = async (updatedData) => {
  try {
    const isFileChanged = updatedData.logo instanceof File;
   
    if (modalConfig.type === 'team') {
      //  Modification d'une équipe
      await updateTeamInfo({
        variables: {
          updateTeamInfoId: updatedData.id,
          input: {
            nom: updatedData.nom,
            quartier: updatedData.quartier,
            slogan: updatedData.slogan
          },
          file: isFileChanged ? updatedData.logo : null
        }
      });
      toast.success("Équipe mise à jour avec succès !");
    } else {
      // 🏃‍♂️ Modification d'un joueur/staff
      await updatePlayerInfo({
        variables: {
          updatePlayerInfoId: updatedData.id,
          input: {
            nom: updatedData.nom,
            type: updatedData.type,
            teamId: updatedData.teamId
          },
          file: isFileChanged ? updatedData.logo : null
        }
      });
      toast.success("Membre mis à jour avec succès !");
    }

    refetchTeams(); // Recharge les données depuis le serveur
    handleClose(); // Ferme la modal
  } catch (error) {
    toast.error(error.message || "Une erreur est survenue lors de la modification");
  }
};

const handleRemovePlayer = async () => {
  if (!p_r) return;
  try {
    const { data } = await removePlayer({
      variables: { removePlayerId: p_r }
    });

    if (data?.removePlayer?.success) {
      refetchTeams();

      // 🌟 CORRECTION ICI : On filtre les membres à l'intérieur de chaque équipe
      setTeams((prevTeams) => 
        prevTeams.map(team => ({
          ...team,
          // On retire le joueur de la liste des membres, peu importe son équipe
          membres: (team.membres || []).filter(player => player.id !== p_r),
          members: (team.members || []).filter(player => player.id !== p_r) // Sécurité si ton API utilise 'members'
        }))
      );

      toast.success(data?.removePlayer?.message || "Suppression effectuée");
    } else {
      toast.error(data?.removePlayer?.message || "Suppression impossible");
    }
    handleClose(); // Assure-toi que cette fonction réinitialise aussi l'état 'p_r' à null
  } catch (error) {
    toast.error(error.message || "Une erreur est survenue");
  }
};
  return (
    <AdminLayout>
      <div className="bg-zinc-950 text-white p-4 sm:p-6 font-sans">
        
        {/* HEADER */}
        <div className="max-w-6xl mx-auto border-b border-zinc-900 pb-4 mb-6">
          <h1 className="text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <FolderPlus className="text-[#FFD700]" size={20} /> Management <span className="text-[#FFD700]">/ Équipes & Effectifs</span>
          </h1>
          <p className="text-xs text-zinc-500">Créez vos clubs de façon indépendante, puis attribuez-y vos joueurs et staffs.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SECTION 1 : CRÉATION DE L'ÉQUIPE (GAUCHE) */}
          <div className="lg:col-span-1 space-y-4">
            <form onSubmit={createTeam} className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Shield size={14} className="text-[#FFD700]" /> 1. Créer une Équipe
              </h2>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom de la Team *</label>
                <input 
                  type="text" placeholder="Ex: Galaxie FC" required value={teamForm.nom}
                  onChange={(e) => setTeamForm({ ...teamForm, nom: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none font-bold placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1">
                  <MapPin size={10} className="text-[#FFD700]" /> Quartier *
                </label>
                <input 
                  type="text" placeholder="Ex: Adidogomé" required value={teamForm.quartier}
                  onChange={(e) => setTeamForm({ ...teamForm, quartier: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1">
                  <Quote size={10} className="text-[#FFD700]" /> Slogan
                </label>
                <input 
                  type="text" placeholder="Ex: Toujours plus haut" value={teamForm.slogan}
                  onChange={(e) => setTeamForm({ ...teamForm, slogan: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-300 italic focus:outline-none placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1">
                  <Image size={10} /> Logo de l'équipe (Optionnel)
                </label>
                <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                  <input 
                    type="file" accept="image/*" ref={teamFileRef}
                    onChange={(e) => handleImageChange(e, true)}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-850 file:cursor-pointer"
                  />
                  {teamForm.logoPreview && (
                    <img src={teamForm.logoPreview} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-zinc-800" />
                  )}
                </div>
              </div>

              <button
                type="submit" disabled={team_added || !teamForm.nom.trim() || !teamForm.quartier.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black text-xs uppercase rounded-xl tracking-wider shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle size={14} /> { team_added ? "En cours..." : "Enregistrer l'Équipe"}
              </button>
            </form>
          </div>

          {/* SECTION 2 : AJOUT DES JOUEURS/STAFF */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2 mb-4">
                <UserPlus size={14} className="text-[#FFD700]" /> 2. Ajouter des membres
              </h2>

              <form onSubmit={addMemberToTeam} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Choisir l'Équipe Cible *</label>
                    <select
                      required value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2.5 rounded-xl text-zinc-200 font-bold outline-none h-[38px]"
                    >
                      <option value="">-- Sélectionner une équipe --</option>
                      {teams.map((t, index) => (
                        <option key={t.id || index} value={t.id}>{t.nom} ({t.quartier})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Type de membre</label>
                    <div className="flex gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-850 h-[38px] items-center">
                      <button
                        type="button" onClick={() => setMemberForm({ ...memberForm, type: 'joueur' })}
                        className={`flex-1 py-1 text-[11px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'joueur' ? 'bg-[#FFD700] text-zinc-950' : 'text-zinc-500'}`}
                      >
                        Joueur
                      </button>
                      <button
                        type="button" onClick={() => setMemberForm({ ...memberForm, type: 'staff' })}
                        className={`flex-1 py-1 text-[11px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'staff' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
                      >
                        Staff
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom Complet *</label>
                    <input 
                      type="text" placeholder="Ex: Jean Pack" required value={memberForm.nom}
                      onChange={(e) => setMemberForm({ ...memberForm, nom: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none h-[38px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Photo / Logo du membre (Optionnel)</label>
                    <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850 h-[38px]">
                      <input 
                        type="file" accept="image/*" ref={memberFileRef}
                        onChange={(e) => handleImageChange(e, false)}
                        className="block w-full text-xs text-zinc-500 file:mr-3 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-850"
                      />
                      {memberForm.logoPreview && (
                        <img src={memberForm.logoPreview} alt="Preview" className="w-6 h-6 rounded object-cover border border-zinc-800" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit" disabled={!selectedTeamId || !memberForm.nom.trim()}
                    className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase rounded-xl tracking-wide disabled:opacity-20 flex items-center gap-1.5 transition-opacity"
                  >
                    <Plus size={13} /> {player_added ? "En cours..":"Ajouter à l'Équipe"}
                  </button>
                </div>
              </form>
            </div>

            {/* VISUALISATION DES CLUBS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
                <Users size={14} /> Liste des Clubs & Effectifs
              </h3>

              {teams.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 text-xs font-medium border border-dashed border-zinc-850 rounded-2xl">
                  Aucune équipe créée pour le moment. Utilisez le formulaire de gauche.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map((team, index) => (
                    <div key={team.id || index} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl space-y-3">
                      
                      <div className="flex items-center justify-between border-b border-zinc-850/60 pb-2">
                        <div className="flex items-center gap-3">
                          {team.logo ? (
                            <img src={team.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-zinc-800" />
                          ) : (
                            <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600">
                              <Shield size={20} />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-black text-zinc-100">{team.nom}</h4>
                            <p className="text-[10px] text-zinc-400 flex items-center gap-0.5 font-medium">
                              <MapPin size={9} className="text-[#FFD700]" /> {team.quartier}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-zinc-400">
                          {(team.membres || []).length} Membres
                        </span>
                      </div>

                      {team.slogan && (
                        <p className="text-[10px] italic text-zinc-500 font-medium px-1">"{team.slogan}"</p>
                      )}

                      <div className="space-y-1 pt-1">
                        {(!team.membres || team.membres.length === 0) ? (
                          <p className="text-[10px] text-zinc-600 italic px-1">Aucun membre dans cette équipe.</p>
                        ) : (
                          team.membres.map((m, mIndex) => (
                            <div key={m.id || mIndex} className="bg-zinc-950 border border-zinc-900/60 px-2 py-1.5 rounded-xl flex justify-between items-center text-[11px]">
                              <div className="flex items-center gap-2">
                                {m.logo ? (
                                  <img src={m.logo} alt="member" className="w-5 h-5 rounded object-cover" />
                                ) : (
                                  <User size={12} className="text-zinc-600" />
                                )}
                                <span className="font-semibold text-zinc-300">{m.nom}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-1 rounded text-[8px] font-black uppercase tracking-wide ${m.type === 'joueur' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                  {m.type}
                                </span>
                                <button 
                                  type="button" onClick={() => handleConfirmP(team.id, m.id)} 
                                  className="text-zinc-700 hover:text-red-400 p-0.5 transition-colors"
                                >
                                  <Trash2 size={11} className='text-red-500' />
                                </button>

                                 <button 
                                  type="button" onClick={() => handleOpenEdit("player", m)} 
                                  className="text-zinc-700 hover:text-red-400 p-0.5 transition-colors"
                                >
                                  <Pencil size={11} className='text-blue-500' />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* <TeamsTable columns={columns} data={apiTeams} loading={team_loaded} /> */}

      {openconfirm && (
        <ConfirmationModal
          isOpen={openconfirm}
          onClose={handleClose}
          message='Confirmez-vous la suppression ?'
          loading={team_removed}
          onConfirm={handleRemoveTeam}
        />
      )}

        {openRem && (
        <ConfirmationModal
          isOpen={openRem}
          onClose={handleClose}
          message='Confirmez-vous la suppression ?'
          loading={player_removed}
          onConfirm={handleRemovePlayer}
        />
      )}

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={handleClose}
        title={modalConfig.type === 'team' ? "Modifier l'Équipe" : "Modifier le Membre"}
      >
        <EditForm 
          type={modalConfig.type}
          data={modalConfig.data}
          onSave={handleSaveEdit}
          onCancel={handleClose}
          loading={team_edited || player_edited}
        />
      </Modal>

      
    </AdminLayout>
  );
};

export default TeamCreationManager;