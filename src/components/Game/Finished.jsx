import React, { useRef } from 'react';
import { Download, FileText } from "lucide-react";
import t1 from "../../assets/images/t1.png";
import t2 from "../../assets/images/t11.png";
import useImageExport from '../../hooks/useImageExport';
import MatchStatusBadge from '../MatchStatusBadge';

const FinishedGame = ({ game }) => {
  const matchData = game || {
    homeTeam: {
      name: "TALENT FC", score: 2, logo: t1,
      scorers: [{ name: "M. Diallo", minute: "24'" }, { name: "J. Smith", minute: "78'" }],
      stats: { yellowCards: 2, redCards: 0 }
    },
    awayTeam: {
      name: "UNION AC", score: 1, logo: t2,
      scorers: [{ name: "A. Traoré", minute: "45'" }],
      stats: { yellowCards: 3, redCards: 1 }
    },
    status: "TERMINÉ", venue: "MAYA KOPÉ", broadcast: "RADIO LA GRÂCE"
  };

  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef);

  const getStatus=(status)=>{
    switch(status){
        case 'programmed':
            return 'programmé';
        case 'live':
            return 'En cours' ;
        case 'half-time':
            return 'Mi-temps';
        case 'cancelled':
            return 'Annulé';
        case 'finished':
            return 'Terminé' 
        default :
            return '';                  
    }
  }

  const isDisabled= matchData?.status !=="finished";

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen justify-center text-white font-sans select-none scrollbar-hide" style={{ backgroundColor: '' }}>
      
      {/* --- BLOC UTILS HORS CAPTURE --- */}
      <div className="w-full max-w-[600px]  flex items-center justify-between border p-4 rounded-xl backdrop-blur-md" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#334155' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-orange-500 to-emerald-500">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">TOPFOOT</h1>
            <p className="text-xs text-zinc-400">Générez et partagez le résultat du match</p>
          </div>
        </div>

        <button
        disabled={isDisabled}
          className="group flex items-center gap-3 cursor-pointer
    disabled:cursor-not-allowed rounded-xl bg-gradient-to-r from-orange-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-orange-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() =>
            exportImage({
              fileName: `Resultat_${matchData.homeTeam.name}_vs_${matchData.awayTeam.name}`,
              pixelRatio: 3,
            })
          }
        >
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>{loading ? "Génération..." : "Télécharger"}</span>
        </button>
      </div>

      {/* --- L'AFFICHE DE RÉSULTAT (SANS AUCUN OKLCH) --- */}
      <div 
        ref={posterRef}
        className="relative h-[600px] w-[600px] stadium-bg text-white overflow-hidden flex flex-col justify-between p-6 border shadow-2xl"
        style={{ 
          minWidth: '600px', minHeight: '600px', maxWidth: '600px', maxHeight: '600px',
          borderColor: '#1e293b'
        }}
      >
        {/* Texture d'arrière-plan */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* TOP HEADER */}
        <div className="relative z-10 flex flex-col items-center w-full pt-2">
         
          <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#ffffff' }}>
            TOPFOOT
          </h2>

           <div className="flex items-center space-x-2 border px-3 py-1 rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', borderColor: '#27272a' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f97316' }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#fb923c' }}>RÉSULTAT FINAL</span>
          </div>
        </div>

        {/* CONTENU CENTRAL : BLOC DES ÉQUIPES ET DU SCORE */}
        <div className="relative z-10 w-full flex items-start justify-between px-2 my-auto">
          
          {/* Équipe Domicile */}
          <div className="flex flex-col items-center w-[180px]">
            <div className="relative p-1 border rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}>
              <div className="w-24 h-24 border rounded-xl flex items-center justify-center p-3 relative overflow-hidden" style={{ backgroundColor: 'rgba(9, 9, 11, 0.8)', borderColor: 'rgba(82, 82, 91, 0.6)' }}>
                <div className="absolute top-0 w-full h-1" style={{ backgroundColor: '#10b981' }} />
                <img className="w-full h-full object-contain" src={matchData.homeTeam.logo} alt={matchData.homeTeam.name} />
              </div>
              <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l" style={{ borderColor: '#34d399' }} />
            </div>
            <h3 className="mt-3 text-lg font-black tracking-wide italic uppercase text-center truncate w-full px-1 nom-equipe" style={{ color: '#ffffff' }}>
              {matchData.homeTeam.name}
            </h3>
            
            {/* Buteurs Domicile */}
            <div className="mt-2 space-y-0.5 text-center min-h-[36px] w-full">
              {matchData.homeTeam.scorers.map((scorer, idx) => (
                <p key={idx} className="text-[10px] font-medium truncate nom-equipe" style={{ color: '#a1a1aa' }}>
                  {scorer?.name}
{scorer?.dorsa ? ` (${scorer.dorsa})` : ""}<span className="font-bold" style={{ color: '#fb923c' }}>{scorer.minute}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Centre : Affichage Numérique du Score */}
          <div className="flex flex-col items-center justify-center pt-2 w-[160px]">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-6xl font-black italic tracking-tight" style={{ color: '#ffffff', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                {matchData.homeTeam.score}
              </span>
              <span className="text-xl font-black" style={{ color: '#71717a' }}>-</span>
              <span className="text-6xl font-black italic tracking-tight nom-equipe" style={{ color: '#ffffff', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                {matchData.awayTeam.score}
              </span>
            </div>
            
            {/* Badge Terminé */}
            <div className="mt-4 border px-4 py-1 rounded-full backdrop-blur-xs" style={{ borderColor: 'rgba(249, 115, 22, 0.3)', backgroundColor: 'rgba(67, 20, 7, 0.4)' }}>
              <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#fb923c' }}>
                {
                  
                    getStatus(matchData.status)
                    
                }
              </span>
            </div>
          </div>

          {/* Équipe Extérieur */}
          <div className="flex flex-col items-center w-[180px]">
            <div className="relative p-1 border rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}>
              <div className="w-24 h-24 border rounded-xl flex items-center justify-center p-3 relative overflow-hidden" style={{ backgroundColor: 'rgba(9, 9, 11, 0.8)', borderColor: 'rgba(82, 82, 91, 0.6)' }}>
                <div className="absolute top-0 w-full h-1" style={{ backgroundColor: '#10b981' }} />
                <img className="w-full h-full object-contain" src={matchData.awayTeam.logo} alt={matchData.awayTeam.name} />
              </div>
              <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r" style={{ borderColor: '#34d399' }} />
            </div>
            <h3 className="mt-3 text-lg font-black tracking-wide italic uppercase text-center truncate w-full px-1 nom-equipe" style={{ color: '#ffffff' }}>
              {matchData.awayTeam.name}
            </h3>
            
            {/* Buteurs Extérieur */}
            <div className="mt-2 space-y-0.5 text-center min-h-[36px] w-full">
              {matchData.awayTeam.scorers.map((scorer, idx) => (
                <p key={idx} className="text-[10px] font-medium truncate nom-equipe" style={{ color: '#a1a1aa' }}>
                  {scorer.name} <span className="font-bold" style={{ color: '#fb923c' }}>{scorer.minute}</span>
                </p>
              ))}
            </div>
          </div>

        </div>

        {/* STATS INFOS */}
        <div className="relative z-10 grid grid-cols-2 gap-3 max-w-lg w-full mx-auto mb-4">
          
          {/* Bloc Jaunes */}
          <div className="border p-3 rounded-xl flex items-center justify-between backdrop-blur-sm" style={{ borderColor: '#18181b', backgroundColor: 'rgba(9, 9, 11, 0.5)' }}>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: '#71717a' }}>CARTONS JAUNES</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-lg font-black" style={{ color: '#34d399' }}>{matchData.homeTeam.stats.yellowCards}</span>
                <span className="text-xs" style={{ color: '#3f3f46' }}>|</span>
                <span className="text-lg font-black" style={{ color: '#fb923c' }}>{matchData.awayTeam.stats.yellowCards}</span>
              </div>
            </div>
            <div className="w-4 h-5 rounded-sm" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', border: '1px solid rgba(234, 179, 8, 0.3)' }} />
          </div>

          {/* Bloc Rouges */}
          <div className="border p-3 rounded-xl flex items-center justify-between backdrop-blur-sm" style={{ borderColor: '#18181b', backgroundColor: 'rgba(9, 9, 11, 0.5)' }}>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: '#71717a' }}>CARTONS ROUGES</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-lg font-black" style={{ color: '#34d399' }}>{matchData.homeTeam.stats.redCards}</span>
                <span className="text-xs" style={{ color: '#3f3f46' }}>|</span>
                <span className="text-lg font-black" style={{ color: '#fb923c' }}>{matchData.awayTeam.stats.redCards}</span>
              </div>
            </div>
            <div className="w-4 h-5 rounded-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.3)' }} />
          </div>

        </div>

        {/* PIED DE L'AFFICHE */}
        <div className="relative z-10 w-full pt-2 flex items-center justify-between px-2 pb-1 text-[10px] font-bold tracking-wider uppercase" style={{ borderTop: '1px solid rgba(24, 24, 27, 0.6)', color: '#a1a1aa' }}>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1.5" style={{ color: '#71717a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {matchData.venue}
          </div>
          <div className="flex items-center" style={{ color: '#34d399' }}>
            <svg className="w-3 h-3 mr-1.5" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            {matchData.broadcast}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinishedGame;