import React, { useRef } from 'react';
import { Download, FileText, MapPin, Calendar, Clock, Star } from "lucide-react";
import useImageExport from '../../hooks/useImageExport';
import { useScreen } from '../../context/ScreenContext';
import TeamCard from '../cards/TeamCard';

const ProgrammedGame = ({ game }) => {
  // Données fallback ou réelles transmises via props
  const matchData = game || {
    homeTeam: { name: "TUDOR FC", location: "Tokoin", logo: "" },
    awayTeam: { name: "FC AFRICA SPORTS", location: "Noudo-kope", logo: "" },
    venue: "MAYA KOPÉ",
    date: "DIMANCHE 26 JUIL. 2026",
    time: "15:30",
    stage: "2ÈME JOURNÉE",
    broadcast: "5ÈMÉ ÉDITION",
    price: "TICKET: 100F"
  };

  const { isMobile } = useScreen();
  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen justify-center text-white font-sans select-none scrollbar-hide">
      
      {/* --- BLOC UTILS HORS CAPTURE --- */}
      <div className="w-full max-w-[600px] flex items-center justify-between border p-4 rounded-xl backdrop-blur-md bg-slate-900/80 border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-amber-500 to-emerald-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">TOPFOOT</h1>
            <p className="text-xs text-zinc-400">Générez et partagez l'affiche officielle</p>
          </div>
        </div>

        <button
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() =>
            exportImage({
              fileName: `Match_${matchData?.homeTeam?.name}_vs_${matchData?.awayTeam?.name}`,
              pixelRatio: 3,
            })
          }
        >
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>{loading ? "Génération..." : "Télécharger"}</span>
        </button>
      </div>

      {/* --- L'AFFICHE FINALE (DESIGN FIDÈLE À LA MAQUETTE) --- */}
      <div
        ref={posterRef}
        className="relative h-[600px] w-[600px] bg-black text-white overflow-hidden flex flex-col justify-between p-6 border border-zinc-800 shadow-2xl"
        style={{
          minWidth: '600px', minHeight: '600px', maxWidth: '600px', maxHeight: '600px'
        }}
      >
        {/* Fond d'écran / Stade & Effets Lumineux */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-zinc-950 to-black pointer-events-none" />
        
        {/* Lignes dorées décoratives en arrière-plan */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(245,158,11,0.05)_50%,transparent_75%)] pointer-events-none" />

        {/* TOP HEADER */}
        <div className="relative z-10 flex flex-col items-center text-center mt-2">
          {/* Logo / Trophée TopFoot Header */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
              TOPFOOT
            </span>
            <span className="text-[10px] tracking-[0.3em] font-bold text-amber-400 uppercase -mt-1">
              TOURNOI
            </span>
          </div>

          {/* Titre Principal */}
          <h2 className="text-4xl font-black tracking-tight text-white uppercase mt-3 drop-shadow-lg">
            MATCH DU JOUR
          </h2>

          {/* Badge Sous-titre */}
          <div className="mt-2 px-6 py-1 bg-amber-500 rounded-full text-black font-extrabold text-xs tracking-wider uppercase shadow-md">
            MATCH DU TOURNOI TOP FOOT
          </div>
        </div>

        {/* CONFRONTATION (EQUIPES + VS) */}
        <div className="relative z-10 w-full flex items-center justify-between px-2 my-auto">
          {/* Équipe Domicile */}
          <div className="flex-1 flex justify-center">
            <TeamCard team={matchData?.homeTeam} />
          </div>

          {/* Monogramme VS */}
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]">
              VS
            </span>
          </div>

          {/* Équipe Extérieur */}
          <div className="flex-1 flex justify-center">
            <TeamCard team={matchData?.awayTeam} />
          </div>
        </div>

        {/* SECTION INFOS (LIEU, DATE, HEURE) */}
        <div className="relative z-10 flex flex-col items-center w-full gap-3 mb-2">
          
          {/* Grille d'informations principale */}
          <div className="w-full bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-3 backdrop-blur-md grid grid-cols-3 divide-x divide-zinc-800 text-center">
            
            {/* Lieu */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                LIEU
              </div>
              <p className="text-sm font-black text-white uppercase line-clamp-1">
                {matchData?.venue || "STADE"}
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                DATE
              </div>
              <p className="text-sm font-black text-white uppercase leading-tight">
                {matchData?.date || "A VENIR"}
              </p>
            </div>

            {/* Heure */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                <Clock className="w-3 h-3 text-amber-400" />
                HEURE
              </div>
              <p className="text-sm font-black text-white uppercase">
                {matchData?.time || "--:--"}
              </p>
            </div>
          </div>

          {/* BADGES DU BAS (JOURNÉE, ÉDITION, PRICE) */}
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-500 text-black font-extrabold text-xs uppercase shadow-md">
              <Star className="w-3 h-3 fill-black text-black" />
              <span>{matchData?.stage || matchData?.matchType}</span>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-extrabold text-xs uppercase">
              {matchData?.broadcast || "ÉDITION 2026"}
            </div>

            {/* {matchData && ( */}
              <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/50 text-amber-400 font-extrabold text-xs uppercase">
                TICKET: 100F
              </div>
            {/* )} */}
          </div>

          {/* FOOTER TEXT */}
          <p className="text-[9px] font-extrabold tracking-[0.25em] text-zinc-400 uppercase mt-1">
            LE TOURNOI. LA PASSION. LE FOOT.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProgrammedGame;