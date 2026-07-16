import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, Shield, MapPin, User, Trash2, Pencil, Copy, Search, 
  Layers, Star, Check, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function ClubsList({ teams = [], handleConfirmP, handleOpenEdit, handleOpenConfirmTeam }) {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [teamSearch, setTeamSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all, joueur, staff
  const [copiedId, setCopiedId] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
  if (!selectedTeamId && teams.length > 0) {
    setSelectedTeamId(teams[0].id);
  }
}, [teams, selectedTeamId]);

  // --- ÉTATS DE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Valeurs possibles : 5, 10, 25, 50, -1 (pour tout)

  // Réinitialiser la page courante si l'équipe sélectionnée, le filtre ou la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTeamId, memberSearch, roleFilter]);

  // --- 1. CALCUL DES STATISTIQUES GLOBALES ---
  const stats = useMemo(() => {
    let totalPlayers = 0;
    let totalStaff = 0;
    teams.forEach(t => {
      const membres = t.membres || [];
      membres.forEach(m => {
        if (m.type === 'staff') totalStaff++;
        else totalPlayers++;
      });
    });
    return {
      teamsCount: teams.length,
      playersCount: totalPlayers,
      staffCount: totalStaff,
    };
  }, [teams]);

  // --- 2. FILTRE DES ÉQUIPES (SCROLL HORIZONTAL) ---
  const filteredTeams = useMemo(() => {
    return teams.filter(t => 
      t.nom?.toLowerCase().includes(teamSearch.toLowerCase()) ||
      t.quartier?.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teams, teamSearch]);

  // Équipe actuellement sélectionnée pour le tableau du bas
  const activeTeam = useMemo(() => {
    return teams.find(t => t.id === selectedTeamId) || teams[0];
  }, [teams, selectedTeamId]);

  // --- 3. FILTRE ET TRI DES MEMBRES DE L'ÉQUIPE ACTIVE (STAFF EN PREMIER) ---
  const filteredAndSortedMembers = useMemo(() => {
    if (!activeTeam) return [];
    const membres = activeTeam.membres || [];
    
    const filtered = membres.filter(m => {
      const matchesSearch = m.nom?.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesRole = roleFilter === 'all' || m.type === roleFilter;
      return matchesSearch && matchesRole;
    });

    // Tri : Le Staff EN PREMIER, puis les Joueurs
    return [...filtered].sort((a, b) => {
      if (a.type === 'staff' && b.type !== 'staff') return -1;
      if (a.type !== 'staff' && b.type === 'staff') return 1;
      return a.nom?.localeCompare(b.nom);
    });
  }, [activeTeam, memberSearch, roleFilter]);

  // --- 4. APPLICATION DE LA PAGINATION SUR LES MEMBRES FILTRÉS ---
  const paginatedMembers = useMemo(() => {
    if (pageSize === -1) return filteredAndSortedMembers; // Mode "Tout"
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedMembers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedMembers, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (pageSize === -1 || filteredAndSortedMembers.length === 0) return 1;
    return Math.ceil(filteredAndSortedMembers.length / pageSize);
  }, [filteredAndSortedMembers, pageSize]);

  // --- FONCTION : COPIER LE LIEN ---
  const handleCopyLink = async (e, teamId) => {
    e.stopPropagation();
    const inviteLink = `${window.location.origin}/${teamId}/ajouter-joueur-staff`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedId(teamId);
      toast.success("Lien de l'équipe copié !");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  return (
    <div className="space-y-6 w-full select-none">
      
      {/* ========================================== */}
      {/* SECTION CARTES STATISTIQUES               */}
      {/* ========================================== */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/60 p-3 md:p-4 rounded-2xl relative overflow-hidden group shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Équipes</p>
              <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 font-mono">{stats.teamsCount}</h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[#FFD700]">
              <Shield size={16} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/60 p-3 md:p-4 rounded-2xl relative overflow-hidden group shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joueurs</p>
              <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 font-mono">{stats.playersCount}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Users size={16} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/60 p-3 md:p-4 rounded-2xl relative overflow-hidden group shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Staffs</p>
              <h3 className="text-lg md:text-2xl font-black text-white mt-0.5 font-mono">{stats.staffCount}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Star size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ZONE HORIZONTALE SCROLLABLE DES ÉQUIPES                   */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-2">
          <h3 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
            <Layers size={14} className="text-[#FFD700]" /> Clubs disponibles ({filteredTeams.length})
          </h3>
          <div className="relative w-full sm:w-60">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Rechercher un club..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-300 outline-none transition-all"
            />
          </div>
        </div>

        {filteredTeams.length === 0 ? (
          <div className="text-center py-6 text-zinc-600 text-xs border border-dashed border-zinc-850 rounded-2xl">
            Aucun club trouvé.
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x scrollbar-hide"
          >
            {filteredTeams.map((team, index) => {
              const isSelected = (activeTeam?.id === team.id);
              const totalMembres = team.membres?.length || 0;

              return (
                <div
                  key={team.id || index}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`min-w-[260px] max-w-[290px] snap-start shrink-0 rounded-xl p-3.5 cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-zinc-900 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.03)] ring-1 ring-[#FFD700]/20' 
                      : 'bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {team.logo ? (
                        <img src={team.logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover border border-zinc-800" />
                      ) : (
                        <div className="w-9 h-9 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                          <Shield size={16} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-zinc-100 uppercase line-clamp-1">{team.nom}</h4>
                        <p className="text-[10px] text-zinc-500 flex items-center gap-0.5 font-semibold">
                          <MapPin size={9} className="text-[#FFD700]" /> {team.quartier}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, team.id)}
                        className={`p-1 rounded ${copiedId === team.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {copiedId === team.id ? <Check size={11} /> : <Copy size={11} />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit("team", team); }}
                        className="p-1 text-zinc-500 hover:text-[#FFD700]"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenConfirmTeam(team.id); }}
                        className="p-1 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-850/50 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500 italic truncate max-w-[150px]">
                      {team.slogan ? `"${team.slogan}"` : 'Pas de slogan'}
                    </span>
                    <span className="px-1.5 py-0.5 bg-zinc-950 rounded border border-zinc-850 font-mono font-black text-zinc-400 text-[8px]">
                      {totalMembres} MEMBRE{totalMembres > 1 ? 'S' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* TABLEAU PAGINÉ DES MEMBRES                                */}
      {/* ========================================================= */}
      {activeTeam && (
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-3">
            <div>
              <h3 className="text-xs font-black text-white uppercase">
                Membres actifs : <span className="text-[#FFD700]">{activeTeam.nom}</span>
              </h3>
              <p className="text-[9px] text-zinc-500">Le Staff technique apparaît toujours en tête de liste.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                <button
                  type="button" onClick={() => setRoleFilter('all')}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg ${roleFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  Tout
                </button>
                <button
                  type="button" onClick={() => setRoleFilter('joueur')}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg ${roleFilter === 'joueur' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500'}`}
                >
                  Joueurs
                </button>
                <button
                  type="button" onClick={() => setRoleFilter('staff')}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg ${roleFilter === 'staff' ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-500'}`}
                >
                  Staff
                </button>
              </div>

              <div className="relative w-full sm:w-44">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Filtrer par nom..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-[#FFD700] rounded-xl pl-7 pr-3 py-1 text-xs text-zinc-300 outline-none"
                />
              </div>
            </div>
          </div>

          {paginatedMembers.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 text-xs italic border border-dashed border-zinc-850 rounded-xl">
              Aucun membre trouvé.
            </div>
          ) : (
            <>
              {/* TABLEAU DESKTOP */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-850 bg-zinc-950/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/80 border-b border-zinc-850 text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                      <th className="py-2.5 px-4 w-16">Profil</th>
                      <th className="py-2.5 px-4">Nom Complet</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 text-xs">
                    {paginatedMembers.map((m, idx) => {
                      const isStaff = m.type === 'staff';
                      return (
                        <tr key={m.id || idx} className={`hover:bg-zinc-900/20 group ${isStaff ? 'bg-purple-500/[0.01]' : ''}`}>
                          <td className="py-2 px-4">
                            {m.logo ? (
                              <img src={m.logo} alt={m.nom} className="w-7 h-7 rounded-lg object-cover border border-zinc-800" />
                            ) : (
                              <div className="w-7 h-7 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                                <User size={12} />
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-4 font-bold text-zinc-300 group-hover:text-white">{m.nom}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${isStaff ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                              {m.type}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button" onClick={() => handleOpenEdit("player", m)}
                                className="p-1 text-zinc-500 hover:text-blue-400 hover:bg-zinc-900 rounded"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button" onClick={() => handleConfirmP(activeTeam.id, m.id)}
                                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* GRILLE CARDS MOBILE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:hidden">
                {paginatedMembers.map((m, idx) => {
                  const isStaff = m.type === 'staff';
                  return (
                    <div key={m.id || idx} className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${isStaff ? 'bg-purple-950/10 border-purple-900/30' : 'bg-zinc-950/60 border-zinc-850'}`}>
                      <div className="flex items-center gap-2.5">
                        {m.logo ? (
                          <img src={m.logo} alt="member" className="w-8 h-8 rounded-lg object-cover border border-zinc-800" />
                        ) : (
                          <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                            <User size={12} />
                          </div>
                        )}
                        <div>
                          <h5 className="text-xs font-bold text-zinc-200 line-clamp-1">{m.nom}</h5>
                          <span className={`text-[8px] font-black uppercase tracking-wider block mt-0.5 ${isStaff ? 'text-purple-400' : 'text-blue-400'}`}>
                            {m.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                        <button type="button" onClick={() => handleOpenEdit("player", m)} className="p-1 text-zinc-400 hover:text-blue-400">
                          <Pencil size={12} />
                        </button>
                        <button type="button" onClick={() => handleConfirmP(activeTeam.id, m.id)} className="p-1 text-zinc-400 hover:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BARRE DE CONTROLE DE PAGINATION INDUSTRIELLE / PREMIUM */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-850/60 text-[10px] text-zinc-400 font-medium">
                {/* Sélecteur de taille [5, 10, 25, 50, Tout] */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <span>Afficher :</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-300 rounded-lg px-2 py-1 outline-none focus:border-zinc-700 font-bold"
                  >
                    <option value={5}>5 lignes</option>
                    <option value={10}>10 lignes</option>
                    <option value={25}>25 lignes</option>
                    <option value={50}>50 lignes</option>
                    <option value={-1}>Tout ({filteredAndSortedMembers.length})</option>
                  </select>
                </div>

                {/* Status des lignes */}
                <div className="font-mono text-zinc-500 text-[9px]">
                  {pageSize === -1 ? (
                    <span>Affichage complet des {filteredAndSortedMembers.length} membres</span>
                  ) : (
                    <span>
                      {Math.min((currentPage - 1) * pageSize + 1, filteredAndSortedMembers.length)} à {Math.min(currentPage * pageSize, filteredAndSortedMembers.length)} sur {filteredAndSortedMembers.length} membres
                    </span>
                  )}
                </div>

                {/* Boutons Suivant / Précédent */}
                {pageSize !== -1 && totalPages > 1 && (
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <span className="px-2 font-mono text-zinc-300 font-bold">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="p-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}