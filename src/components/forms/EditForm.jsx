import React, { useState, useEffect, useRef } from 'react';
import { Image, User, Shield } from 'lucide-react';

const EditForm = ({ data, type, onSave, onCancel ,loading=false}) => {
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Initialisation à l'ouverture
  useEffect(() => {
    if (data) {
      setFormData(data);
      // Si l'élément a déjà un logo sur le serveur, on l'utilise pour la preview initiale
      setLogoPreview(data.logo || null);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion du changement d'image
  const handleFileChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file })); // On stocke le fichier brut pour l'upload
      setLogoPreview(URL.createObjectURL(file)); // Création de l'URL temporaire d'aperçu
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On passe l'objet complet mis à jour (qui contient soit le string du logo existant, soit le nouveau File binaire)
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* 📸 SECTION LOGO COMMUNE AU DEUX TYPES */}
      <div className="flex flex-col items-center justify-center p-3 bg-zinc-950 border border-zinc-850 rounded-xl mb-2">
        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2 self-start flex items-center gap-1">
          <Image size={12} /> {type === 'team' ? "Logo du Club" : "Photo du Membre"}
        </label>
        
        <div className="flex items-center gap-4 w-full">
          {/* Zone d'aperçu de l'image */}
          <div className="relative group">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Preview" 
                className="w-14 h-14 rounded-xl object-cover border border-zinc-800" 
              />
            ) : (
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600">
                {type === 'team' ? <Shield size={24} /> : <User size={24} />}
              </div>
            )}
          </div>

          {/* Input personnalisé */}
          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // On cache l'input natif moche
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-800 transition-colors"
            >
              Choisir un fichier
            </button>
            <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG acceptés.</p>
          </div>
        </div>
      </div>

      {type === 'team' ? (
        <>
          {/*  CHAMPS ÉQUIPE */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom de l'équipe *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom || ''}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Quartier *</label>
            <input
              type="text"
              name="quartier"
              value={formData.quartier || ''}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Slogan</label>
            <input
              type="text"
              name="slogan"
              value={formData.slogan || ''}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-300 italic focus:outline-none"
            />
          </div>
        </>
      ) : (
        <>
          {/* 🏃‍♂️ CHAMPS JOUEUR */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Nom Complet *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom || ''}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FFD700] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Type de membre</label>
            <select
              name="type"
              value={formData.type || 'joueur'}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs p-2 rounded-xl text-zinc-200 font-bold outline-none h-[38px]"
            >
              <option value="joueur">Joueur</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </>
      )}

      {/* BOUTONS D'ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-500 shadow transition-colors"
        >
          {loading? "En cours..":"Enregistrer"}
        </button>
      </div>
    </form>
  );
};

export default EditForm;