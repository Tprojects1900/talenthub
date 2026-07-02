import React from 'react';
import topfoot from "../../assets/images/topfoot.png";
export const Header = ({ teamName, teamLogo,quartier=null }) => {
  return (
    <header className="flex items-center justify-between border-b-4 border-amber-500 pb-4 mb-5">
      {/* Logo & Titre de la Compétition */}
      <div className="flex items-center gap-4">
         <img 
          src={topfoot} 
          alt="TopFoot Logo" 
          className="w-16 h-16 object-contain p-1 border-2 border-slate-200 rounded-lg bg-white"
        />
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Licence Collective</h1>
          <p className="text-xs font-bold text-amber-600 tracking-widest uppercase">Compétition Officielle 2026</p>
        </div>
      </div>

      {/* Identité Équipe */}
      <div className="flex items-center gap-4 text-right">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">{teamName}</h2>
          <p className="text-xs text-slate-500 font-semibold">Effectif Engagé • 22 Licenciés</p>
          {/* <p className="text-[8px] text-slate-500 font-semibold">
            {`(${quartier})`}
          </p> */}
        </div>
        <img 
          src={teamLogo} 
          alt={`${teamName} Logo`} 
          className="w-16 h-16 object-contain p-1 border-2 border-slate-200 rounded-lg bg-white"
        />
      </div>
    </header>
  );
};