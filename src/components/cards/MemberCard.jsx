import React from 'react';
import ImageUploader from '../ImageUploader';

export default function MemberCard({ member, role, index, onUpdate, onPreviewImage }) {
  
  const handleNameChange = (e) => {
    onUpdate({ ...member, nomComplet: e.target.value });
  };

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // On renvoie 'image' (la chaîne base64 pour l'aperçu) ET 'file' (le fichier binaire pour GraphQL)
        onUpdate({ 
          ...member, 
          image: reader.result, 
          file: file 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    onUpdate({ ...member, image: null, file: null });
  };

  const isPlayer = role === 'player';

  return (
    <div className={`bg-white p-4 rounded-xl border transition-all ${
      member.image ? 'border-gray-200 shadow-xs' : 'border-dashed border-gray-300 bg-gray-50/50'
    } flex ${isPlayer ? 'flex-col items-center text-center relative' : 'items-center gap-4'}`}>
      
      {/* L'indicateur reste en absolu UNIQUEMENT pour le joueur */}
      {isPlayer && (
        <div className="absolute top-3 left-3 bg-gray-100 text-gray-500 font-medium text-[10px] px-1.5 py-0.5 rounded">
          Joueur {index + 1}
        </div>
      )}

      {/* Zone Photo / Complet */}
      <div className={isPlayer ? 'mb-3 mt-4' : 'flex-shrink-0'}>
        <ImageUploader
          imageSrc={member.image}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          onPreview={() => onPreviewImage(member.image, member.nomComplet || (isPlayer ? `Joueur ${index + 1}` : `Staff ${index + 1}`))}
          label={isPlayer ? "COMPLET" : "PHOTO"}
        />
      </div>

      {/* Conteneur du texte et du champ de saisie */}
      <div className="w-full flex-1 flex flex-col gap-1.5">
        {/* L'indicateur pour le staff est placé ici, naturellement au-dessus du champ */}
        {!isPlayer && (
          <div className="self-start bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-amber-100 uppercase tracking-wider">
            Staff {index + 1}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Alex Rouki"
          value={member.nomComplet || ''}
          onChange={handleNameChange}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 w-full text-center sm:text-left font-medium text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
}