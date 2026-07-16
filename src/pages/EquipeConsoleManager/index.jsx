import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Shield, UserPlus, CheckCircle, MapPin, Quote, FolderPlus, Image, Layers 
} from 'lucide-react';
import { useTeams } from '../../hooks/useCalls';
import { useRemoveTeam, useAddTeam, useAddPlayer, useEditTeam, useEditPlayer, useRemovePlayer } from '../../lib/graphql.service';
import { toast } from 'react-toastify';
import AdminLayout from '../../layouts/AdminLayout';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import Modal from "../../components/modals";
import EditForm from "../../components/forms/EditForm.jsx";
import ClubsList from "../../components/ClubsList.jsx"
const TeamCreationManager = () => {
  // --- STATE DU SWITCH/TABS DE CRÉATION ---
  const [activeTab, setActiveTab] = useState('team'); // 'team' (par défaut) ou 'member'

  const [openconfirm, setOpenConfirm] = useState(false);
  const [instanceToRem, setInstanceToRem] = useState(null);
  
  const [removeTeam, { loading: team_removed }] = useRemoveTeam();
  const [removePlayer, { loading: player_removed }] = useRemovePlayer();
  const [registerTeam, { loading: team_added }] = useAddTeam();
  const [createPlayer, { loading: player_added }] = useAddPlayer();
  const [updateTeamInfo, { loading: team_edited }] = useEditTeam();
  const [updatePlayerInfo, { loading: player_edited }] = useEditPlayer();
  
  const { teams: apiTeams, refetchTeams } = useTeams();
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
  const [openRem, setOpenRem] = useState(false);
  const [p_r, setP_r] = useState(null);

  const handleClose = () => {
    setInstanceToRem(null);
    setOpenConfirm(false);
    setModalConfig({ isOpen: false, type: null, data: null });
    setOpenRem(false);
  };

  const handleConfirmP = (teamId, memberId) => {
    setP_r(memberId);
    setOpenRem(true);
  };

  const handleOpenConfirm = (instanceId) => {
    setOpenConfirm(true);
    setInstanceToRem(instanceId);
  };

  const handleOpenEdit = (type, item) => {
    setModalConfig({ isOpen: true, type: type, data: item });
  };

  // --- ÉTATS DES ÉQUIPES ---
  const [teamForm, setTeamForm] = useState({ nom: '', slogan: '', quartier: '', logo: null, logoPreview: null });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
  if (!apiTeams) return;

  const formatted = apiTeams.map(team => ({
    ...team,
    membres: team.membres || team.members || []
  }));

  setTeams(prev => {
    const same = JSON.stringify(prev) === JSON.stringify(formatted);

    return same ? prev : formatted;
  });

}, [apiTeams]);

  // --- ÉTATS DES MEMBRES ---
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [memberForm, setMemberForm] = useState({ nom: '', type: 'joueur', logo: null, logoPreview: null });

  const teamFileRef = useRef(null);
  const memberFileRef = useRef(null);

  const handleImageChange = (e, isTeam) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (isTeam) {
        setTeamForm({ ...teamForm, logo: file, logoPreview: previewUrl });
      } else {
        setMemberForm({ ...memberForm, logo: file, logoPreview: previewUrl });
      }
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.nom.trim() || !teamForm.quartier.trim()) return;
    const rawFile = teamFileRef.current?.files[0] || teamForm.logo;

    try {
      const { data } = await registerTeam({
        variables: {
          input: { nom: teamForm.nom.trim(), slogan: teamForm.slogan.trim(), quartier: teamForm.quartier.trim() },
          file: rawFile
        }
      });

      if (data?.registerTeam?.id) {
        refetchTeams();
        toast.success("Team ajoutée avec succès!");
        setTeamForm({ nom: '', slogan: '', quartier: '', logo: null, logoPreview: null });
        if (teamFileRef.current) teamFileRef.current.value = '';
      }
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const addMemberToTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeamId || !memberForm.nom.trim()) return;
    const rawFile = memberFileRef.current?.files[0] || memberForm.logo;

    try {
      const { data } = await createPlayer({
        variables: {
          input: { nom: memberForm.nom.trim(), teamId: selectedTeamId, type: memberForm.type },
          file: rawFile
        }
      });

      if (data?.createPlayer?.id) {
        refetchTeams();
        toast.success("Membre ajouté avec succès !");
        setMemberForm({ nom: '', type: 'joueur', logo: null, logoPreview: null });
        if (memberFileRef.current) memberFileRef.current.value = '';
      }
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleRemoveTeam = async () => {
    if (!instanceToRem) return;
    try {
      const { data } = await removeTeam({ variables: { removeTeamId: instanceToRem } });
      if (data?.removeTeam?.success) {
        refetchTeams();
        toast.success(data?.removeTeam?.message || "Suppression effectuée");
      }
      handleClose();
    } catch (error) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleRemovePlayer = async () => {
    if (!p_r) return;
    try {
      const { data } = await removePlayer({ variables: { removePlayerId: p_r } });
      if (data?.removePlayer?.success) {
        refetchTeams();
        toast.success(data?.removePlayer?.message || "Suppression effectuée");
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
        await updateTeamInfo({
          variables: {
            updateTeamInfoId: updatedData.id,
            input: { nom: updatedData.nom, quartier: updatedData.quartier, slogan: updatedData.slogan },
            file: isFileChanged ? updatedData.logo : null
          }
        });
      } else {
        await updatePlayerInfo({
          variables: {
            updatePlayerInfoId: updatedData.id,
            input: { nom: updatedData.nom, type: updatedData.type, teamId: updatedData.teamId },
            file: isFileChanged ? updatedData.logo : null
          }
        });
      }
      refetchTeams();
      handleClose();
      toast.success("Mise à jour effectuée !");
    } catch (error) {
      toast.error(error.message || "Erreur lors de la modification");
    }
  };

  return (
    <AdminLayout>
      <div className="bg-zinc-950 text-white p-4 sm:p-6 font-sans min-h-screen">
        
        {/* HEADER */}
        <div className="max-w-7xl mx-auto border-b border-zinc-900 pb-4 mb-6">
          <h1 className="text-base font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <FolderPlus className="text-[#FFD700]" size={18} /> Management <span className="text-[#FFD700]">/ Équipes & Effectifs</span>
          </h1>
          <p className="text-[11px] text-zinc-500">Gérez vos clubs de façon indépendante, attribuez des joueurs et supervisez vos staffs.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* SCRIPT CONFIGURATION FORMULAIRES SWITCH (GAUCHE) */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* SWITCH PREMIUM DE CONFIGURATION */}
            <div className="bg-zinc-900/50 p-1 rounded-xl border border-zinc-850 flex items-center h-[38px]">
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'team' ? 'bg-[#FFD700] text-zinc-950 font-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Shield size={12} /> Équipe
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('member')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'member' ? 'bg-[#FFD700] text-zinc-950 font-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <UserPlus size={12} /> Membres
              </button>
            </div>
            
            {/* FORMULAIRE 1 : CRÉATION D'ÉQUIPE (Conditionné) */}
            {activeTab === 'team' && (
              <form onSubmit={createTeam} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 space-y-4 animate-fade-in">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Shield size={13} className="text-[#FFD700]" /> 1. Créer une Équipe
                </h2>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom de la Team *</label>
                  <input
                    type="text" placeholder="Ex: Galaxie FC" required value={teamForm.nom}
                    onChange={(e) => setTeamForm({ ...teamForm, nom: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder-zinc-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Quartier *</label>
                  <input
                    type="text" placeholder="Ex: Adamavo" required value={teamForm.quartier}
                    onChange={(e) => setTeamForm({ ...teamForm, quartier: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none placeholder-zinc-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Slogan</label>
                  <input
                    type="text" placeholder="Ex: Toujours plus haut" value={teamForm.slogan}
                    onChange={(e) => setTeamForm({ ...teamForm, slogan: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-300 italic focus:outline-none placeholder-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Logo (Optionnel)</label>
                  <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-850">
                    <input
                      type="file" accept="image/*" ref={teamFileRef} onChange={(e) => handleImageChange(e, true)}
                      className="block w-full text-xs text-zinc-500 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-zinc-900 file:text-zinc-300 file:cursor-pointer"
                    />
                    {teamForm.logoPreview && <img src={teamForm.logoPreview} alt="Preview" className="w-7 h-7 rounded-lg object-cover border border-zinc-800" />}
                  </div>
                </div>
                <button
                  type="submit" disabled={team_added}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-black text-xs uppercase rounded-xl shadow tracking-wider transition-colors"
                >
                  {team_added ? "Enregistrement..." : "Enregistrer l'Équipe"}
                </button>
              </form>
            )}

            {/* FORMULAIRE 2 : AJOUT DE MEMBRE (Conditionné) */}
            {activeTab === 'member' && (
              <form onSubmit={addMemberToTeam} className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-4 space-y-4 animate-fade-in">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <UserPlus size={13} className="text-[#FFD700]" /> 2. Ajouter un membre
                </h2>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Club Cible *</label>
                  <select
                    required value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2 rounded-xl text-zinc-200 font-bold outline-none"
                  >
                    <option value="">-- Choisir une équipe --</option>
                    {teams.map((t, idx) => <option key={t.id || idx} value={t.id}>{t.nom} ({t.quartier})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Type de membre</label>
                  <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                    <button
                      type="button" onClick={() => setMemberForm({ ...memberForm, type: 'joueur' })}
                      className={`flex-1 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'joueur' ? 'bg-[#FFD700] text-zinc-950' : 'text-zinc-500'}`}
                    >
                      Joueur
                    </button>
                    <button
                      type="button" onClick={() => setMemberForm({ ...memberForm, type: 'staff' })}
                      className={`flex-1 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'staff' ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}
                    >
                      Staff
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom Complet *</label>
                  <input
                    type="text" placeholder="Ex: Jean Pack" required value={memberForm.nom}
                    onChange={(e) => setMemberForm({ ...memberForm, nom: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Photo (Optionnelle)</label>
                  <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
                    <input
                      type="file" accept="image/*" ref={memberFileRef} onChange={(e) => handleImageChange(e, false)}
                      className="block w-full text-xs text-zinc-500 file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-bold file:bg-zinc-900 file:text-zinc-300"
                    />
                    {memberForm.logoPreview && <img src={memberForm.logoPreview} alt="Preview" className="w-6 h-6 rounded object-cover border border-zinc-800" />}
                  </div>
                </div>
                <button
                  type="submit" disabled={player_added || !selectedTeamId}
                  className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase rounded-xl tracking-wide transition-opacity disabled:opacity-20 flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> {player_added ? "Ajout..." : "Ajouter à l'Équipe"}
                </button>
              </form>
            )}
          </div>

          {/* COMPOSANT AFFICHAGE & PAGINATION (DROITE) */}
          <div className="lg:col-span-2 w-full">
            <ClubsList
              teams={teams}
              handleOpenEdit={handleOpenEdit}
              handleConfirmP={handleConfirmP}
              handleOpenConfirmTeam={handleOpenConfirm}
            />
          </div>
        </div>
      </div>

      {/* MODALS DE SUPPRESSION / MODIFICATION */}
      {openconfirm && (
        <ConfirmationModal isOpen={openconfirm} onClose={handleClose} message="Confirmez-vous la suppression de l'équipe ?" loading={team_removed} onConfirm={handleRemoveTeam} />
      )}
      {openRem && (
        <ConfirmationModal isOpen={openRem} onClose={handleClose} message="Confirmez-vous la suppression du membre ?" loading={player_removed} onConfirm={handleRemovePlayer} />
      )}
      <Modal isOpen={modalConfig.isOpen} onClose={handleClose} title={modalConfig.type === 'team' ? "Modifier l'Équipe" : "Modifier le Membre"}>
        <EditForm type={modalConfig.type} data={modalConfig.data} onSave={handleSaveEdit} onCancel={handleClose} loading={team_edited || player_edited} />
      </Modal>
    </AdminLayout>
  );
};

export default TeamCreationManager;