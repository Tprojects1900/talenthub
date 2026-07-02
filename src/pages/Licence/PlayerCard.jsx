import React from 'react';
import { generateLicenseId } from '../../utils/colorExtractor';

export const PlayerCard = ({ player, index, teamName, teamLogo, dominantColor }) => {
  const licenseId = generateLicenseId(teamName, index, player.name);

  return (
    <div className="relative flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Top Banner Accentué avec la couleur dominante */}
      <div className="h-1" style={{ backgroundColor: dominantColor }}></div>
      
      {/* Badge Numéro de Maillot */}
      <div 
        className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm"
        style={{ backgroundColor: dominantColor }}
      >
        {player.number}
      </div>

      {/* Conteneur Photo Passeport */}
      <div className="w-full bg-slate-100 flex justify-center pt-2">
        <img 
          src={player.photo} 
          alt={player.name} 
          className="w-24 h-24 object-cover object-top rounded border border-slate-200 shadow-inner"
        />
      </div>

      {/* Informations Joueur */}
      <div className="p-2 flex flex-col justify-between flex-grow bg-slate-50 border-t border-slate-100">
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="text-[11px] font-black text-slate-800 leading-tight uppercase line-clamp-2">
            {player.name}
          </p>
          {/* <img src={teamLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-70 flex-shrink-0" /> */}
        </div>
        
        {/* ID Technique Généré (8 caractères max) */}
        {/* <div className="bg-white px-1.5 py-0.5 rounded border border-slate-200 flex justify-between items-center">
          <span className="text-[8px] font-bold text-slate-400 tracking-wider">ID:</span>
          <span className="font-mono text-[9px] font-bold text-slate-700 tracking-wider">
            {licenseId}
          </span>
        </div> */}
      </div>
    </div>
  );
};