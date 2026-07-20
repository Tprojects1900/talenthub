import React, { useRef } from 'react';
import { Download, FileText, MapPin, Radio, ShieldAlert, Star } from "lucide-react";
import useImageExport from '../../hooks/useImageExport';
import TeamScorersCard from '../cards/TeamScorersCard';

const FinishedGame = ({ game }) => {
  // Fallback data structuring to match matchData signature
  const matchData = game || {
    homeTeam: {
      name: "TUDOR FC", score: 2, logo: "",
      scorers: [{ name: "M. Diallo", minute: "24'" }, { name: "J. Smith", minute: "78'" }],
      stats: { yellowCards: 1, redCards: 0 }
    },
    awayTeam: {
      name: "FC AFRICA SPORTS", score: 1, logo: "",
      scorers: [{ name: "A. Traoré", minute: "45'" }],
      stats: { yellowCards: 2, redCards: 1 }
    },
    status: "finished",
    venue: "MAYA KOPÉ",
    broadcast: "RADIO LA GRÂCE",
    stage: "2ÈME JOURNÉE",
    edition: "5ÈMÉ ÉDITION"
  };

  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef);

  const getStatus = (status) => {
    switch(status) {
      case 'programmed':
        return 'programmé';
      case 'live':
        return 'En cours';
      case 'half-time':
        return 'Mi-temps';
      case 'cancelled':
        return 'Annulé';
      case 'finished':
      case 'TERMINÉ':
        return 'Terminé';
      default:
        return 'Terminé';
    }
  };

  const isDisabled = matchData?.status !== "finished" && matchData?.status !== "TERMINÉ";

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
            <p className="text-xs text-zinc-400">Générez et partagez le résultat officiel</p>
          </div>
        </div>

        <button
          disabled={isDisabled}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            exportImage({
              fileName: `Resultat_${matchData?.homeTeam?.name}_vs_${matchData?.awayTeam?.name}`,
              pixelRatio: 3,
            })
          }
        >
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>{loading ? "Génération..." : "Télécharger"}</span>
        </button>
      </div>

      {/* --- L'AFFICHE DE RÉSULTAT FINALE --- */}
      <div 
        ref={posterRef}
        className="relative h-[600px] w-[600px] bg-black text-white overflow-hidden flex flex-col justify-between p-6 border border-zinc-800 shadow-2xl"
        style={{ 
          minWidth: '600px', minHeight: '600px', maxWidth: '600px', maxHeight: '600px'
        }}
      >
        {/* Fond d'écran / Stade & Effets Lumineux Vert/Doré */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-zinc-950 to-black pointer-events-none" />
        
        {/* Lignes dorées décoratives en arrière-plan */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(245,158,11,0.03)_50%,transparent_75%)] pointer-events-none" />

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
            RÉSULTAT DU MATCH
          </h2>

          {/* Badge Sous-titre */}
          <div className="mt-2 px-6 py-1 bg-amber-500 rounded-full text-black font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            RÉSULTAT FINAL
          </div>
        </div>

        {/* CONTENU CENTRAL : BLOC DES ÉQUIPES ET DU SCORE */}
        <div className="relative z-10 w-full flex items-start justify-between px-2 my-auto">
          
          {/* Équipe Domicile (et ses buteurs) */}
          <div className="flex-1 flex justify-center max-w-[190px]">
            <TeamScorersCard team={matchData.homeTeam} />
          </div>

          {/* Centre : Affichage Numérique Premium du Score */}
          <div className="flex flex-col items-center justify-center pt-4 w-[160px] self-center">
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {matchData.homeTeam.score}
              </span>
              <span className="text-2xl font-black text-amber-500">-</span>
              <span className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {matchData.awayTeam.score}
              </span>
            </div>
            
            {/* Statut Badge */}
            <div className="mt-4 border px-4 py-1.5 rounded-full bg-amber-500/10 border-amber-500/30 shadow-inner">
              <span className="text-[9px] font-black tracking-widest uppercase text-amber-400">
                {getStatus(matchData.status)}
              </span>
            </div>
          </div>

          {/* Équipe Extérieur (et ses buteurs) */}
          <div className="flex-1 flex justify-center max-w-[190px]">
            <TeamScorersCard team={matchData.awayTeam} />
          </div>

        </div>

        {/* STATS INFOS (CARTONS) */}
        <div className="relative z-10 grid grid-cols-2 gap-3 max-w-lg w-full mx-auto mb-3">
          
          {/* Bloc Cartons Jaunes */}
          <div className="border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between bg-zinc-950/60 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase">CARTONS JAUNES</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-lg font-black text-white">{matchData.homeTeam.stats?.yellowCards ?? 0}</span>
                <span className="text-xs text-zinc-800">|</span>
                <span className="text-lg font-black text-white">{matchData.awayTeam.stats?.yellowCards ?? 0}</span>
              </div>
            </div>
            <div className="w-4.5 h-6 rounded bg-amber-500/20 border border-amber-500/40 shadow-sm" />
          </div>

          {/* Bloc Cartons Rouges */}
          <div className="border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between bg-zinc-950/60 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase">CARTONS ROUGES</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-lg font-black text-white">{matchData.homeTeam.stats?.redCards ?? 0}</span>
                <span className="text-xs text-zinc-800">|</span>
                <span className="text-lg font-black text-white">{matchData.awayTeam.stats?.redCards ?? 0}</span>
              </div>
            </div>
            <div className="w-4.5 h-6 rounded bg-red-600/20 border border-red-500/40 shadow-sm" />
          </div>

        </div>

        {/* PIED DE L'AFFICHE (LIEU, STATS & DIFFUSION) */}
        <div className="relative z-10 flex flex-col items-center w-full gap-3 mb-1">
          
          {/* Grille d'informations principale du footer */}
          <div className="w-full bg-zinc-950/80 border border-amber-500/20 rounded-2xl p-3 backdrop-blur-md grid grid-cols-2 divide-x divide-zinc-800/60 text-center">
            
            {/* Lieu */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                LIEU DU MATCH
              </div>
              <p className="text-sm font-black text-white uppercase line-clamp-1">
                {matchData?.venue || "STADE"}
              </p>
            </div>

            {/* Diffusion / Édition */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                DIFFUSION
              </div>
              <p className="text-sm font-black text-white uppercase line-clamp-1">
                {matchData?.broadcast || "LIVE"}
              </p>
            </div>
          </div>

          {/* BADGES DU BAS */}
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-500 text-black font-extrabold text-xs uppercase shadow-md">
              <Star className="w-3 h-3 fill-black text-black" />
              <span>{matchData?.stage || "CHAMPIONNAT"}</span>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-extrabold text-xs uppercase">
              {matchData?.edition || "5ÈMÉ ÉDITION"}
            </div>
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

export default FinishedGame;