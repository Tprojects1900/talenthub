import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MemberCard from '../components/cards/MemberCard';
import { useTeamDetails } from '../hooks/useCalls';
import { useAddPlayer } from '../lib/graphql.service';

export default function AddPlayerPage() {
  const { teamId } = useParams();  
  const [teamName, setTeamName] = useState('');
  
  const [players, setPlayers] = useState(Array(20).fill({ nomComplet: '', imageSrc: null, file: null, isSaved: false }));
  const [staff, setStaff] = useState(Array(2).fill({ nomComplet: '', imageSrc: null, file: null, isSaved: false }));
  
  const [previewModal, setPreviewModal] = useState({ isOpen: false, src: '', title: '' });
  const [confirmModal, setConfirmModal] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); // Global loading pour bloquer le modal pendant la soumission

  const { teamDetails, team_loaded, refetchTeamDetails } = useTeamDetails(teamId);
  const [mutateMember] = useAddPlayer();

  // Déterminer si l'effectif est clos (Déjà soumis avec >= 17 membres enregistrés)
  const isEffectifClos = teamDetails?.members?.length >= 17;

  // Chargement et persistance des données existantes (Même après actualisation)
  useEffect(() => {
    if (teamDetails) {
      if (teamDetails.nom) setTeamName(teamDetails.nom);
      
      if (teamDetails.members && teamDetails.members.length > 0) {
        // Filtrer les membres déjà enregistrés en BDD par type
        const dbPlayers = teamDetails.members.filter(m => m.type === 'joueur' || m.role === 'joueur');
        const dbStaff = teamDetails.members.filter(m => m.type === 'staff' || m.role === 'staff');

        // Remplir les slots des joueurs
        setPlayers(prev => prev.map((slot, idx) => {
          if (dbPlayers[idx]) {
            return {
              nomComplet: dbPlayers[idx].nom || dbPlayers[idx].nomComplet || '',
              imageSrc: dbPlayers[idx].logo || dbPlayers[idx].imageSrc || null,
              file: null,
              isSaved: true // Flag pour verrouiller la carte
            };
          }
          return slot;
        }));

        // Remplir les slots du staff
        setStaff(prev => prev.map((slot, idx) => {
          if (dbStaff[idx]) {
            return {
              nomComplet: dbStaff[idx].nom || dbStaff[idx].nomComplet || '',
              imageSrc: dbStaff[idx].logo || dbStaff[idx].imageSrc || null,
              file: null,
              isSaved: true
            };
          }
          return slot;
        }));
      }
    }
  }, [teamDetails]);

  const handleUpdatePlayer = (index, updatedPlayer) => {
    if (isEffectifClos) return; // Sécurité anti-modification
    const updated = [...players];
    updated[index] = updatedPlayer;
    setPlayers(updated);
  };

  const handleUpdateStaff = (index, updatedStaff) => {
    if (isEffectifClos) return; // Sécurité anti-modification
    const updated = [...staff];
    updated[index] = updatedStaff;
    setStaff(updated);
  };

  const triggerPreview = (src, title) => {
    setPreviewModal({ isOpen: true, src, title });
  };

  // --- LOGIQUE DE CALCUL DES COMPTEURS & ANOMALIES ---
  // Un membre est valide s'il a été complété localement (nom+file) OU s'il est déjà validé en BDD (isSaved)
  const validPlayersCount = players.filter(p => (p.nomComplet.trim() && p.file) || p.isSaved).length;
  const validStaffCount = staff.filter(s => (s.nomComplet.trim() && s.file) || s.isSaved).length;
  const totalCompleted = validPlayersCount + validStaffCount;

  // Les anomalies ne concernent que les nouvelles saisies locales non sauvegardées
  const hasPlayerErrors = players.some(p => !p.isSaved && ((p.file && !p.nomComplet.trim()) || (!p.file && p.nomComplet.trim())));
  const hasStaffErrors = staff.some(s => !s.isSaved && ((s.file && !s.nomComplet.trim()) || (!s.file && s.nomComplet.trim())));
  const hasCriticalErrors = hasPlayerErrors || hasStaffErrors || !teamName.trim();

  // --- TABLEAU DE VALIDATION DYNAMIQUE (VALIDATORS) ---
  const validators = [
    {
      id: "teamName",
      label: "Nom de l'équipe renseigné",
      isValid: teamName.trim().length > 0
    },
    {
      id: "minStaff",
      label: `Au moins 1 membre du Staff complet (Actuel: ${validStaffCount}/1)`,
      isValid: validStaffCount >= 1
    },
    {
      id: "minPlayers",
      label: `Au moins 16 Joueurs complets (Actuel: ${validPlayersCount}/16)`,
      isValid: validPlayersCount >= 16
    },
    {
      id: "noAnomalies",
      label: "Chaque membre initié possède à la fois son NOM et sa PHOTO",
      isValid: !hasPlayerErrors && !hasStaffErrors
    }
  ];

  const allValidatorsPassed = validators.every(v => v.isValid);

  // Détermination de la couleur et de l'état du bouton principal
  let buttonStyle = "bg-red-500 text-white cursor-not-allowed opacity-90";
  let buttonText = "Soumission bloquée (Erreurs détectées)";
  
  if (isEffectifClos) {
    buttonStyle = "bg-gray-950 text-gray-400 cursor-not-allowed font-bold uppercase tracking-wider";
    buttonText = "🔒 Effectif déjà validé et clos";
  } else if (!hasCriticalErrors && !allValidatorsPassed) {
    buttonStyle = "bg-yellow-500 text-gray-900 cursor-not-allowed font-bold";
    buttonText = "Effectif incomplet (Quotas non atteints)";
  } else if (allValidatorsPassed) {
    buttonStyle = "bg-green-600 hover:bg-green-700 text-white cursor-pointer transform active:scale-98 font-bold";
    buttonText = "Valider et Envoyer l'Effectif";
  }

  const openConfirmation = (e) => {
    e.preventDefault();
    if (isEffectifClos) return;
    if (!allValidatorsPassed || isSubmitting) {
      checkValidationErrors();
      return;
    }
    setConfirmModal(true);
  };

  const checkValidationErrors = () => {
    validators.forEach(v => {
      if (!v.isValid) toast.warn(`Requis : ${v.label}`);
    });

    players.forEach((p, idx) => {
      if (!p.isSaved && p.file && !p.nomComplet.trim()) toast.error(`🚨 Joueur ${idx + 1} : Image chargée mais nom vide.`);
      if (!p.isSaved && !p.file && p.nomComplet.trim()) toast.error(`🚨 Joueur ${idx + 1} : Nom écrit mais photo manquante.`);
    });

    staff.forEach((s, idx) => {
      if (!s.isSaved && s.file && !s.nomComplet.trim()) toast.error(`🚨 Staff ${idx + 1} : Image chargée mais nom vide.`);
      if (!s.isSaved && !s.file && s.nomComplet.trim()) toast.error(`🚨 Staff ${idx + 1} : Nom écrit mais photo manquante.`);
    });
  };

  const handleFinalSubmit = async () => {
    if (!allValidatorsPassed || isSubmitting || isEffectifClos) return;
    
    setIsSubmitting(true); // Active la barrière de chargement globale

    // Filtrer pour n'envoyer au serveur QUE les nouvelles entrées non sauvegardées
    const newPlayers = players.filter(p => !p.isSaved && p.nomComplet.trim() && p.file);
    const newStaff = staff.filter(s => !s.isSaved && s.nomComplet.trim() && s.file);

    try {
      const playerPromises = newPlayers.map(player => 
        mutateMember({
          variables: {
            input: { nom: player.nomComplet.trim(), teamId: teamId, type: "joueur" },
            file: player.file
          }
        })
      );

      const staffPromises = newStaff.map(member => 
        mutateMember({
          variables: {
            input: { nom: member.nomComplet.trim(), teamId: teamId, type: "staff" },
            file: member.file
          }
        })
      );

      // Attendre l'envoi global de l'intégralité des promesses de l'effectif
      await Promise.all([...playerPromises, ...staffPromises]);
      
      toast.success("🏆 L'effectif officiel a été sauvegardé avec succès !");
      if (refetchTeamDetails) await refetchTeamDetails(); // Actualise l'état avec la BDD pour fermer définitivement
      setConfirmModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de la synchronisation de certains membres.");
    } finally {
      setIsSubmitting(false); // Désactive le chargement quoi qu'il arrive
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans pb-44 relative">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* EN-TÊTE DE LA PAGE */}
        <header className="bg-white rounded-2xl shadow-xs p-6 mb-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto flex-1">
            <h1 className="text-3xl font-extrabold text-orange-500 tracking-wider mb-1">TOPFOOT</h1>
            <div>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Équipe en cours de gestion</span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                {team_loaded ?"Chargement de l'équipe...":teamName || "Équipe sans nom" }
              </h2>
            </div>
          </div>

          <div className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 text-center md:text-right flex-shrink-0 w-full md:w-auto">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Membres Complétés</span>
            <div className="text-xl font-black text-blue-900 mt-0.5">{totalCompleted} / 22</div>
            <span className="text-[10px] text-gray-500 block mt-1">Objectif minimum : 16 Joueurs + 1 Staff</span>
          </div>
        </header>

        <form onSubmit={openConfirmation}>
          {/* SECTION : STAFF */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold text-gray-900">Dirigeants / Staff <span className="text-xs text-gray-400 font-normal">(Min 1 - Max 2)</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map((member, idx) => (
                <MemberCard
                  key={`staff-${idx}`}
                  member={{ nomComplet: member.nomComplet, image: member.imageSrc }}
                  role="staff"
                  index={idx}
                  disabled={isEffectifClos || member.isSaved} // Bloque la carte si l'effectif est validé
                  onUpdate={(updated) => handleUpdateStaff(idx, { 
                    nomComplet: updated.nomComplet, 
                    imageSrc: updated.image, 
                    file: updated.file || staff[idx].file,
                    isSaved: false
                  })}
                  onPreviewImage={triggerPreview}
                />
              ))}
            </div>
          </section>

          {/* SECTION : JOUEURS */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold text-gray-900">Joueurs de l'Équipe <span className="text-xs text-gray-400 font-normal">(Min 16 - Max 20)</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((member, idx) => (
                <MemberCard
                  key={`player-${idx}`}
                  member={{ nomComplet: member.nomComplet, image: member.imageSrc }}
                  role="player"
                  index={idx}
                  disabled={isEffectifClos || member.isSaved} // Bloque la carte si l'effectif est validé
                  onUpdate={(updated) => handleUpdatePlayer(idx, { 
                    nomComplet: updated.nomComplet, 
                    imageSrc: updated.image, 
                    file: updated.file || players[idx].file,
                    isSaved: false
                  })}
                  onPreviewImage={triggerPreview}
                />
              ))}
            </div>
          </section>

          {/* ZONE DE SÉCURITÉ / BARRE FIXE EN BAS */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-2xl flex flex-col items-center">
            
            {/* Ligne des Validateurs Temps Réel */}
            <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {validators.map((v) => (
                <div key={v.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${v.isValid || isEffectifClos ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className={v.isValid || isEffectifClos ? 'text-gray-700 font-medium' : 'text-gray-400'}>{v.label}</span>
                </div>
              ))}
            </div>

            {/* Ligne d'action Principale */}
            <div className="max-w-7xl w-full flex items-center justify-between gap-4">
              <div className="hidden md:block text-xs text-gray-500">
                Équipe : <span className="font-bold text-orange-600">{teamName || 'Non définie'}</span>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={checkValidationErrors}
                  disabled={isEffectifClos}
                  className="px-4 py-3 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyser l'effectif
                </button>

                <button
                  type="submit"
                  disabled={!allValidatorsPassed || isSubmitting || isEffectifClos}
                  className={`text-sm px-8 py-3 rounded-xl shadow-md transition-all w-full md:w-auto text-center ${buttonStyle}`}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>

      {/* MODAL 1 : CONFIRMATION DE SÉCURITÉ + LOADING INTERNE */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {isSubmitting ? "Enregistrement de l'effectif..." : "Confirmer l'enregistrement officiel ?"}
            </h3>
            
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 text-center animate-pulse">
                  Veuillez patienter pendant que les photos et profils sont transmis au serveur de la compétition...
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Vous allez soumettre les membres complétés pour l'équipe <span className="font-bold text-orange-600">{teamName}</span>.<br/><br/>
                  <span className="text-red-500 font-bold">⚠️ IMPORTANT :</span> Une fois soumis, l'effectif sera définitivement clos et verrouillé. Aucune désélection ou modification ultérieure ne sera tolérée par le comité d'organisation.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    Retourner au formulaire
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-5 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition"
                  >
                    Oui, valider et fermer l'inscription
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2 : APERÇU DE LA PHOTO */}
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
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
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