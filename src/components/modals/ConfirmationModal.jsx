import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmer l'action", 
  message = "Êtes-vous sûr de vouloir effectuer cette action ?", 
  type = "default", // "default" ou "danger" (pour la suppression)
  confirmLabel = "Confirmer",
  loading = false
}) => {
  
  if (!isOpen) return null;

  // Couleurs dynamiques selon le type (Agressif Jaune/Noir ou Danger Rouge)
  const isDanger = type === "danger";
  const accentColor = isDanger ? "bg-red-600 text-white" : "bg-[#FFD700] text-black";
  const btnConfirmColor = isDanger 
    ? "bg-red-600 hover:bg-red-700 text-white" 
    : "bg-[#1a1a1a] hover:bg-black text-[#FFD700]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Arrière-plan flouté/sombre) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={loading ? null : onClose}
      />

      {/* Conteneur de la Modal */}
      <div className="bg-white w-full max-w-md rounded-none border-2 border-black shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Barre de design supérieure */}
        <div className={`h-2 w-full ${isDanger ? 'bg-red-600' : 'bg-[#FFD700]'}`} />

        {/* Bouton Fermer en haut à droite */}
        <button 
          disabled={loading}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        {/* Contenu principal */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icône d'avertissement */}
            <div className={`p-3 rounded-none flex-shrink-0 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-black'}`}>
              {isDanger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
            </div>

            {/* Textes */}
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-black mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Pied de page / Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border-2 border-gray-200 text-sm font-bold uppercase tracking-wider text-gray-700 rounded-none hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-black uppercase tracking-wider rounded-none transition-all flex items-center gap-2 border-2 border-black ${btnConfirmColor} disabled:opacity-50`}
          >
            {loading ? "En cours..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;