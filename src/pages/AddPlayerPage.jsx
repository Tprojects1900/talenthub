import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MemberCard from '../components/cards/MemberCard';
import RegisteredMembersScroll from '../components/RegisteredMembersScroll';
import { useTeamDetails } from '../hooks/useCalls';
import { useAddPlayer } from '../lib/graphql.service';

export default function AddPlayerPage() {
  const { teamId } = useParams();  
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  
  // États locaux des formulaires d'ajouts (uniquement les slots restants à remplir)
  const [players, setPlayers] = useState([]);
  const [staff, setStaff] = useState([]);
  
  const [previewModal, setPreviewModal] = useState({ isOpen: false, src: '', title: '' });
  const [confirmModal, setConfirmModal] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const { teamDetails, team_loaded, refetchTeamDetails } = useTeamDetails(teamId);
  const [mutateMember] = useAddPlayer();

  // Extraction propre depuis les données réelles de la base de données
  const dbMembers = teamDetails?.members || [];
  const dbPlayers = dbMembers.filter(m => m.type === 'joueur' || m.role === 'joueur');
  const dbStaff = dbMembers.filter(m => m.type === 'staff' || m.role === 'staff');

  const totalRegisteredCount = dbMembers.length;
  const isEffectifClos = totalRegisteredCount >= 22;

  // Calcule et génère les slots vides restants dès que teamDetails change ou est actualisé
  useEffect(() => {
    if (teamDetails) {
      if (teamDetails.nom) setTeamName(teamDetails.nom);
      if (teamDetails.logo) setTeamLogo(teamDetails.logo);
      
      // Ajustement mathématique rigoureux des formulaires à afficher
      const remainingPlayerSlots = Math.max(0, 20 - dbPlayers.length);
      const remainingStaffSlots = Math.max(0, 2 - dbStaff.length);

      setPlayers(Array(remainingPlayerSlots).fill(null).map(() => ({ nomComplet: '', imageSrc: null, file: null })));
      setStaff(Array(remainingStaffSlots).fill(null).map(() => ({ nomComplet: '', imageSrc: null, file: null })));
    }
  }, [teamDetails]);

  const handleUpdatePlayer = (index, updatedPlayer) => {
    const updated = [...players];
    updated[index] = updatedPlayer;
    setPlayers(updated);
  };

  const handleUpdateStaff = (index, updatedStaff) => {
    const updated = [...staff];
    updated[index] = updatedStaff;
    setStaff(updated);
  };

  const triggerPreview = (src, title) => {
    setPreviewModal({ isOpen: true, src, title });
  };

  // --- VALIDATEUR UNIQUE (REGEX COHÉRENCE) ---
  const hasPlayerErrors = players.some(p => (p.file && !p.nomComplet.trim()) || (!p.file && p.nomComplet.trim()));
  const hasStaffErrors = staff.some(s => (s.file && !s.nomComplet.trim()) || (!s.file && s.nomComplet.trim()));
  const hasCriticalErrors = hasPlayerErrors || hasStaffErrors;

  // Membres saisis localement et prêts à partir
  const localPlayersToSubmit = players.filter(p => p.nomComplet.trim() && p.file);
  const localStaffToSubmit = staff.filter(s => s.nomComplet.trim() && s.file);
  const totalLocalToSubmit = localPlayersToSubmit.length + localStaffToSubmit.length;

  const allValidatorsPassed = !hasCriticalErrors && totalLocalToSubmit > 0;

  // Style de bouton épuré
  let buttonStyle = "bg-gray-300 text-gray-500 cursor-not-allowed font-medium";
  let buttonText = "Remplissez un profil complet";
  
  if (isEffectifClos) {
    buttonStyle = "bg-gray-900 text-gray-400 cursor-not-allowed font-bold uppercase";
    buttonText = "🔒 Effectif Complet (Max 22)";
  } else if (hasCriticalErrors) {
    buttonStyle = "bg-red-500 text-white cursor-not-allowed font-medium";
    buttonText = "Erreur : Associez Nom + Photo";
  } else if (allValidatorsPassed) {
    buttonStyle = "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold transform active:scale-98";
    buttonText = `Enregistrer ${totalLocalToSubmit} nouveau(x) membre(s)`;
  }

  const openConfirmation = (e) => {
    e.preventDefault();
    if (isEffectifClos || !allValidatorsPassed || isSubmitting) return;
    setConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!allValidatorsPassed || isSubmitting || isEffectifClos) return;
    
    setIsSubmitting(true);

    try {
      // Exécution séquentielle ou parallèle sécurisée du payload
      const playerPromises = localPlayersToSubmit.map(player => 
        mutateMember({
          variables: {
            input: { nom: player.nomComplet.trim(), teamId: teamId, type: "joueur" },
            file: player.file
          }
        })
      );

      const staffPromises = localStaffToSubmit.map(member => 
        mutateMember({
          variables: {
            input: { nom: member.nomComplet.trim(), teamId: teamId, type: "staff" }, // Correction stricte du teamId
            file: member.file
          }
        })
      );

      await Promise.all([...playerPromises, ...staffPromises]);
      
      toast.success("🏆 Enregistrement réussi avec succès !");
      
      if (refetchTeamDetails) {
        await refetchTeamDetails(); // Force la synchronisation et met à jour le compteur 0/22
      }
      
      setConfirmModal(false);
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      toast.error("Le serveur a refusé un ou plusieurs fichiers.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans pb-32 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* EN-TÊTE AVEC LOGO DE L'ÉQUIPE */}
        <header className="bg-white rounded-2xl shadow-xs p-6 mb-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto flex-1 flex items-center gap-4">
            {teamLogo ? (
              <img src={teamLogo} alt="Logo Équipe" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-xs" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl border border-orange-200">
                {teamName ? teamName.substring(0, 2).toUpperCase() : 'TF'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-orange-500 tracking-wider">TOPFOOT</h1>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">Gestion d'effectif</span>
              <h2 className="text-xl font-bold text-gray-900">
                {!team_loaded ? teamName || "Équipe sans nom" : "Chargement..."}
              </h2>
            </div>
          </div>

          <div className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 text-center md:text-right flex-shrink-0 w-full md:w-auto">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Total Validé</span>
            <div className="text-xl font-black text-blue-900 mt-0.5">{totalRegisteredCount} / 22</div>
            <span className="text-[10px] text-gray-500 block mt-1">Joueurs ({dbPlayers.length}/20) | Staff ({dbStaff.length}/2)</span>
          </div>
        </header>

        {/* AFFICHAGE DES MEMBRES ACTUELS VIA LE SCROLL ISOLÉ */}
        <RegisteredMembersScroll members={dbMembers} onPreviewImage={triggerPreview} />

        {/* ESPACE DE FORMULAIRES RESTANTS */}
        {!isEffectifClos ? (
          <form onSubmit={openConfirmation}>
            
            {/* SECTION STAFF RESTANT */}
            {staff.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  Compléter Dirigeants / Staff <span className="text-xs text-orange-500 font-semibold">({staff.length} place(s) disponible(s))</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {staff.map((member, idx) => (
                    <MemberCard
                      key={`staff-empty-${idx}`}
                      member={{ nomComplet: member.nomComplet, image: member.imageSrc }}
                      role="staff"
                      index={idx}
                      onUpdate={(updated) => handleUpdateStaff(idx, { 
                        nomComplet: updated.nomComplet, 
                        imageSrc: updated.image, 
                        file: updated.file || staff[idx].file
                      })}
                      onPreviewImage={triggerPreview}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION JOUEURS RESTANTS */}
            {players.length > 0 && (
              <section className="mb-10">
                <h2 className="text-sm font-bold text-gray-900 mb-4">
                  Compléter Joueurs <span className="text-xs text-orange-500 font-semibold">({players.length} place(s) disponible(s))</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {players.map((member, idx) => (
                    <MemberCard
                      key={`player-empty-${idx}`}
                      member={{ nomComplet: member.nomComplet, image: member.imageSrc }}
                      role="player"
                      index={idx}
                      onUpdate={(updated) => handleUpdatePlayer(idx, { 
                        nomComplet: updated.nomComplet, 
                        imageSrc: updated.image, 
                        file: updated.file || players[idx].file
                      })}
                      onPreviewImage={triggerPreview}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ACTION BANNER FIXE */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-2xl flex items-center justify-center">
              <div className="max-w-7xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`w-2.5 h-2.5 rounded-full ${!hasCriticalErrors ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span>Règle : Tout profil commencé doit avoir son nom ET sa photo de chargés.</span>
                </div>
                
                <button
                  type="submit"
                  disabled={!allValidatorsPassed || isSubmitting}
                  className={`text-sm px-10 py-3.5 rounded-xl shadow-md transition-all w-full sm:w-auto text-center font-bold ${buttonStyle}`}
                >
                  {buttonText}
                </button>
              </div>
            </footer>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center font-medium">
            🎉 L'effectif maximal (22 membres) est au complet et validé en base de données.
          </div>
        )}
      </div>

      {/* CONFIRMATION ET ACCÈS SÉCURISÉ AU SPINNER */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {isSubmitting ? "Enregistrement en cours..." : "Valider ces modifications ?"}
            </h3>
            
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 text-center animate-pulse">
                  Upload des fichiers au serveur TOPFOOT en cours. Ne fermez pas la page...
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Vous allez injecter <span className="font-bold text-orange-600">{totalLocalToSubmit} nouveau(x) membre(s)</span>. Ils s'ajouteront à ceux déjà enregistrés.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-5 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Confirmer l'envoi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL GLOBAL D'APERÇU */}
      {previewModal.isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewModal({ isOpen: false, src: '', title: '' })}
        >
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 truncate">{previewModal.title}</h3>
              <button 
                type="button"
                onClick={() => setPreviewModal({ isOpen: false, src: '', title: '' })}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-2 bg-gray-50 flex items-center justify-center min-h-[300px]">
              <img src={previewModal.src} alt="Aperçu" className="max-h-[70vh] rounded-lg object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}