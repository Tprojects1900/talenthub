import React, { useRef } from 'react';
import { X, Camera } from 'lucide-react';

export default function ImageUploader({ imageSrc, onImageChange, onImageRemove, onPreview, label = "Photo" }) {
  const fileInputRef = useRef(null);

  const handleCardClick = (e) => {
    if (imageSrc) {
      onPreview();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // On passe directement l'objet File brut à la fonction parente
      onImageChange(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Évite de déclencher l'aperçu au clic
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageRemove();
  };

  return (
    <div className="relative w-20 h-20 group">
      {/* Zone de l'avatar */}
      <div
        onClick={handleCardClick}
        className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all ${
          imageSrc 
            ? 'border-blue-500 ring-4 ring-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Aperçu" 
            className="w-full h-full object-cover"
            title="Cliquez pour agrandir"
          />
        ) : (
          <div className="text-center text-gray-400 group-hover:text-blue-500 flex flex-col items-center justify-center">
            <Camera className="w-5 h-5 stroke-[2]" />
            <span className="block text-[9px] font-semibold tracking-wider uppercase mt-0.5">{label}</span>
          </div>
        )}
      </div>

      {/* Input de fichier masqué */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Bouton de désélection Absolu Lucide (Haut Droite) */}
      {imageSrc && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md transition transform hover:scale-110"
          title="Désélectionner l'image"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}