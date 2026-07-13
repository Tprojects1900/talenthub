import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Pencil, MapPin, User, Search,
  Users, Shield, UserPlus, Quote
} from 'lucide-react';
import { useTeamDetails } from '../../hooks/useCalls';
import { useAddPlayer, useEditPlayer, useRemovePlayer, useEditTeam } from '../../lib/graphql.service';
import { toast } from 'react-toastify';
import AdminLayout from '../../layouts/AdminLayout';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import Modal from '../../components/modals';
import EditForm from '../../components/forms/EditForm.jsx';

/* ============================================================
   TOKENS — identiques à la page Équipes pour rester cohérent
   ============================================================ */
const GOLD = '#FFD700';
const PITCH = '#22c55e';
const STAFF_COLOR = '#a78bfa';

/* ============================================================
   LIGNE DE TABLEAU — un membre
   ============================================================ */
const MemberRow = ({ member, onEdit, onDelete }) => {
  const isPlayer = member.type?.toLowerCase() === 'joueur';
  const roleColor = isPlayer ? PITCH : STAFF_COLOR;

  return (
    <tr className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
      <td className="py-2 pl-4 pr-2">
        {member.logo ? (
          <img src={member.logo} alt={member.nom} className="w-10 h-10 rounded-lg object-cover border border-zinc-800 bg-zinc-950" />
        ) : (
          <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
            <User size={16} className="text-zinc-700" />
          </div>
        )}
      </td>

      <td className="py-2 pr-3">
        <p className="text-xs font-bold text-zinc-100">{member.nom}</p>
      </td>

      <td className="py-2 pr-3">
        <span
          className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded"
          style={{ color: roleColor, backgroundColor: `${roleColor}1a` }}
        >
          {member.type}
        </span>
      </td>

      <td className="py-2 pr-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-zinc-500 hover:text-[#FFD700] hover:bg-zinc-800 rounded-lg transition-colors"
            title="Modifier"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ============================================================
   PAGE PRINCIPALE — effectif d'une équipe
   ============================================================ */
const TeamRosterPage = () => {
  const { teamId } = useParams();
  const navigate = useHistory();
  const { teamDetails, loading: teamLoading } = useTeamDetails(teamId);

  const [createPlayer, { loading: player_added }] = useAddPlayer();
  const [updatePlayerInfo, { loading: player_edited }] = useEditPlayer();
  const [removePlayer, { loading: player_removed }] = useRemovePlayer();
  const [updateTeamInfo, { loading: team_edited }] = useEditTeam();

  // État local des membres, initialisé depuis l'API puis mis à jour
  // de façon optimiste (comme sur la page liste des équipes).
  const [members, setMembers] = useState([]);
  useEffect(() => {
    setMembers(teamDetails?.members ?? []);
  }, [teamDetails]);

  const [memberForm, setMemberForm] = useState({ nom: '', type: 'joueur', logo: null, logoPreview: null });
  const memberFileRef = useRef(null);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('tous'); // tous | joueur | staff

  const [openRem, setOpenRem] = useState(false);
  const [p_r, setP_r] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  const handleClose = () => {
    setOpenRem(false);
    setP_r(null);
    setModalConfig({ isOpen: false, type: null, data: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberForm({ ...memberForm, logo: file, logoPreview: URL.createObjectURL(file) });
    }
  };

  const addMemberToTeam = async (e) => {
    e.preventDefault();
    if (!teamId || !memberForm.nom.trim()) return;

    const rawFile = memberFileRef.current?.files[0] || memberForm.logo;

    try {
      const { data } = await createPlayer({
        variables: {
          input: {
            nom: memberForm.nom.trim(),
            teamId,
            type: memberForm.type
          },
          file: rawFile
        }
      });

      if (data?.createPlayer?.id) {
        const newM = data.createPlayer;
        const newMember = {
          id: newM.id,
          nom: newM.nom || memberForm.nom.trim(),
          type: newM.type || memberForm.type,
          logo: newM.logo || memberForm.logoPreview
        };

        setMembers((prev) => [...prev, newMember]);
        toast.success('Membre ajouté avec succès !');

        setMemberForm({ nom: '', type: 'joueur', logo: null, logoPreview: null });
        if (memberFileRef.current) memberFileRef.current.value = '';
      } else {
        toast.error("Une erreur est survenue pendant l'ajout du membre");
      }
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const handleRemovePlayer = async () => {
    if (!p_r) return;
    try {
      const { data } = await removePlayer({ variables: { removePlayerId: p_r } });
      if (data?.removePlayer?.success) {
        setMembers((prev) => prev.filter((m) => m.id !== p_r));
        toast.success(data?.removePlayer?.message || 'Suppression effectuée');
      } else {
        toast.error(data?.removePlayer?.message || 'Suppression impossible');
      }
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const isFileChanged = updatedData.logo instanceof File;

      if (modalConfig.type === 'team') {
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
        toast.success('Équipe mise à jour avec succès !');
      } else {
        await updatePlayerInfo({
          variables: {
            updatePlayerInfoId: updatedData.id,
            input: {
              nom: updatedData.nom,
              type: updatedData.type,
              teamId
            },
            file: isFileChanged ? updatedData.logo : null
          }
        });
        setMembers((prev) =>
          prev.map((m) => (m.id === updatedData.id ? { ...m, nom: updatedData.nom, type: updatedData.type } : m))
        );
        toast.success('Membre mis à jour avec succès !');
      }
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue lors de la modification');
    }
  };

  const stats = useMemo(() => {
    const joueurs = members.filter((m) => m.type?.toLowerCase() === 'joueur').length;
    const staff = members.filter((m) => m.type?.toLowerCase() === 'staff').length;
    return { joueurs, staff };
  }, [members]);

  const filteredMembers = useMemo(() => {
    let list = members;
    if (roleFilter !== 'tous') {
      list = list.filter((m) => m.type?.toLowerCase() === roleFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((m) => m.nom?.toLowerCase().includes(q));
    }
    return list;
  }, [members, roleFilter, query]);

  if (teamLoading) {
    return (
      <AdminLayout>
        <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center text-xs text-zinc-500">
          Chargement de l'équipe...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-zinc-950 text-white p-4 sm:p-6 font-sans min-h-screen">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        `}</style>

        <div className="max-w-5xl mx-auto">
          {/* RETOUR */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-200 uppercase tracking-wide mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Retour aux équipes
          </button>

          {/* IDENTITÉ DE L'ÉQUIPE */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={teamDetails?.logo}
              alt={teamDetails?.nom}
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-800 bg-zinc-950 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-black uppercase tracking-wide text-zinc-100">
                  {teamDetails?.nom}
                </h1>
                {teamDetails?.code && (
                  <span
                    className="text-[9px] font-bold px-2 py-1 rounded bg-zinc-950 border border-zinc-850 text-zinc-400"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {teamDetails.code}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {teamDetails?.quartier}
              </p>
              {teamDetails?.slogan && (
                <p className="text-[10px] italic text-zinc-500 flex items-center gap-1 mt-1">
                  <Quote size={9} /> {teamDetails.slogan}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ color: PITCH, backgroundColor: `${PITCH}1a` }}>
                <Users size={12} /> {stats.joueurs} joueurs
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{ color: STAFF_COLOR, backgroundColor: `${STAFF_COLOR}1a` }}>
                <Shield size={12} /> {stats.staff} staff
              </span>
              <button
                onClick={() => setModalConfig({ isOpen: true, type: 'team', data: teamDetails })}
                className="p-2 text-zinc-500 hover:text-[#FFD700] hover:bg-zinc-800 rounded-lg transition-colors"
                title="Modifier l'équipe"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>

          {/* AJOUT D'UN MEMBRE */}
          <form onSubmit={addMemberToTeam} className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2 mb-4">
              <UserPlus size={14} className="text-[#FFD700]" /> Ajouter un membre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom complet *</label>
                <input
                  type="text" placeholder="Ex: Jean Pack" required value={memberForm.nom}
                  onChange={(e) => setMemberForm({ ...memberForm, nom: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none h-[38px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Photo (optionnel)</label>
                <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850 h-[38px]">
                  <input
                    type="file" accept="image/*" ref={memberFileRef}
                    onChange={handleImageChange}
                    className="block w-full text-xs text-zinc-500 file:mr-3 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-850"
                  />
                  {memberForm.logoPreview && (
                    <img src={memberForm.logoPreview} alt="Preview" className="w-6 h-6 rounded object-cover border border-zinc-800 shrink-0" />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850 h-[38px] items-center">
                  <button
                    type="button" onClick={() => setMemberForm({ ...memberForm, type: 'joueur' })}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'joueur' ? 'bg-[#FFD700] text-zinc-950' : 'text-zinc-500'}`}
                  >
                    Joueur
                  </button>
                  <button
                    type="button" onClick={() => setMemberForm({ ...memberForm, type: 'staff' })}
                    className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${memberForm.type === 'staff' ? 'bg-violet-500 text-white' : 'text-zinc-500'}`}
                  >
                    Staff
                  </button>
                </div>

                <button
                  type="submit" disabled={!memberForm.nom.trim()}
                  className="px-4 h-[38px] bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase rounded-xl tracking-wide disabled:opacity-20 flex items-center justify-center gap-1.5 transition-opacity whitespace-nowrap"
                >
                  <Plus size={13} /> {player_added ? 'En cours..' : 'Ajouter'}
                </button>
              </div>
            </div>
          </form>

          {/* RECHERCHE + FILTRES */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un membre..."
                className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-[#FFD700] rounded-xl pl-9 pr-3 py-2.5 text-xs text-zinc-200 focus:outline-none placeholder-zinc-600"
              />
            </div>
            <div className="flex gap-1.5">
              {[
                { key: 'tous', label: `Tous (${members.length})`, color: GOLD },
                { key: 'joueur', label: `Joueurs (${stats.joueurs})`, color: PITCH },
                { key: 'staff', label: `Staff (${stats.staff})`, color: STAFF_COLOR },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setRoleFilter(f.key)}
                  className="text-[10px] font-bold uppercase px-3 py-2 rounded-xl border transition-colors"
                  style={
                    roleFilter === f.key
                      ? { color: f.color, borderColor: f.color, backgroundColor: `${f.color}1a` }
                      : { color: '#71717a', borderColor: '#27272a', backgroundColor: 'transparent' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU DES MEMBRES */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-850 rounded-2xl">
              <Users size={22} className="text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">
                {members.length === 0 ? 'Aucun membre pour le moment — ajoutez-en ci-dessus.' : 'Aucun résultat pour ce filtre.'}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[480px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-950/60">
                    <th className="py-2.5 pl-4 pr-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Photo</th>
                    <th className="py-2.5 pr-3 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Nom</th>
                    <th className="py-2.5 pr-3 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Rôle</th>
                    <th className="py-2.5 pr-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      onEdit={(mem) => setModalConfig({ isOpen: true, type: 'player', data: { ...mem, teamId } })}
                      onDelete={(id) => { setP_r(id); setOpenRem(true); }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {openRem && (
        <ConfirmationModal
          isOpen={openRem}
          onClose={handleClose}
          message="Confirmez-vous la suppression ?"
          loading={player_removed}
          onConfirm={handleRemovePlayer}
        />
      )}

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleClose}
        title={modalConfig.type === 'team' ? "Modifier l'Équipe" : 'Modifier le Membre'}
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

export default TeamRosterPage;