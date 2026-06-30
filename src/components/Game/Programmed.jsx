import React, { useRef } from 'react';
import { Download, FileText } from "lucide-react";
import t1 from "../../assets/images/t1.png";
import t2 from "../../assets/images/t11.png";
import useImageExport from '../../hooks/useImageExport';
import { useScreen } from '../../context/ScreenContext';

const ProgrammedGame = ({ game }) => {
  const matchData = game || {
    homeTeam: { name: "TALENT FC", location: "Adamavo", logo: t1 },
    awayTeam: { name: "UNION AC", location: "Adakpame", logo: t2 },
    venue: "MAYA KOPE",
    time: "14:00",
    stage: "GROUP STAGE",
    isLive: true
  };
const {isMobile,isTablet, isDesktop}=useScreen()
  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen justify-center text-white font-sans select-none scrollbar-hide" style={{ backgroundColor: '' }}>
      
      {/* --- BLOC UTILS HORS CAPTURE --- */}
      <div className="w-full max-w-[600px] flex items-center justify-between border p-4 rounded-xl backdrop-blur-md" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#334155' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-orange-600 to-emerald-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">TOPFOOT</h1>
            <p className="text-xs text-zinc-400">Générez et partagez l'affiche officielle</p>
          </div>
        </div>

        <button
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-orange-600/10 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() =>
            exportImage({
              fileName: `Match_${matchData.homeTeam.name}_vs_${matchData.awayTeam.name}`,
              pixelRatio: 3,
            })
          }
        >
          <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          <span>{loading ? "Génération..." : "Télécharger"}</span>
        </button>
      </div>

      {/* --- L'AFFICHE FINALE (SANS AUCUN OKLCH) --- */}
      <div 
        ref={posterRef}
        className="relative h-[600px] w-[600px] stadium-bg text-white overflow-hidden flex flex-col justify-between p-8 border shadow-2xl"
        style={{ 
          minWidth: '600px', minHeight: '600px', maxWidth: '600px', maxHeight: '600px',
          borderColor: '#1e293b'
        }}
      >
        {/* Grille d'arrière-plan */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        {/* Cercles de repère */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full pointer-events-none flex items-center justify-center" style={{ border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <div className="w-[320px] h-[320px] rounded-full" style={{ border: '1px solid rgba(16, 185, 129, 0.05)' }} />
        </div>

        {/* TOP HEADER */}
        <div className="relative z-10 flex flex-col items-center w-full pt-2">
              <h2 className="text-4xl font-black tracking-tighter mb-2" style={{ color: '#ffffff' }}>
            TOPFOOT
          </h2>
          <div className="flex items-center space-x-2 border px-3 py-1 rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(9, 9, 11, 0.6)', borderColor: '#27272a' }}>
            {matchData?.isLive && (<span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f97316' }} />)}
            <span className="text-[20px] font-black tracking-widest uppercase" style={{ color: '#fb923c' }}>MATCH DU JOUR</span>
          </div>
        
        </div>

        {/* CONFRONTATION */}
        <div className="relative z-10 w-full flex items-center justify-between px-4 my-auto">
          
          {/* Équipe Domicile */}
          <div className="flex flex-col items-center w-[220px]">
            <div className="relative p-1 rounded-2xl border shadow-xl backdrop-blur-md" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.3), transparent)', borderColor: 'rgba(63, 63, 70, 0.5)' }}>
              <div className="w-32 h-32 flex items-center justify-center rounded-xl p-4 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom, #18181b, #09090b)' }}>
                <img className="w-full h-full object-contain relative z-10" src={matchData.homeTeam.logo} alt={matchData.homeTeam.name} />
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-[2px]" style={{ backgroundColor: '#34d399' }} />
              <div className="absolute -bottom-1 -left-1 w-[2px] h-5" style={{ backgroundColor: '#34d399' }} />
            </div>
            <h3 className="mt-4 text-xl font-black tracking-wide uppercase text-center truncate w-full px-1 nom-equipe " style={{ color: '#ffffff' }}>
              {matchData.homeTeam.name}
            </h3>
            <span className="text-[11px] font-bold tracking-wider mt-0.5 uppercase nom-equipe" style={{ color: '#34d399' }}>
              {matchData.homeTeam.location}
            </span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl font-black italic tracking-tighter" style={{ color: '#f97316', filter: 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.4))' }}>
              VS
            </span>
          </div>

          {/* Équipe Extérieur */}
          <div className="flex flex-col items-center w-[220px]">
            <div className="relative p-1 rounded-2xl border shadow-xl backdrop-blur-md" style={{ backgroundImage: 'linear-gradient(to bottom left, rgba(16, 185, 129, 0.3), transparent)', borderColor: 'rgba(63, 63, 70, 0.5)' }}>
              <div className="w-32 h-32 flex items-center justify-center rounded-xl p-4 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom, #18181b, #09090b)' }}>
                <img className="w-full h-full object-contain relative z-10" src={matchData.awayTeam.logo} alt={matchData.awayTeam.name} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-[2px]" style={{ backgroundColor: '#34d399' }} />
              <div className="absolute -top-1 -right-1 w-[2px] h-5" style={{ backgroundColor: '#34d399' }} />
            </div>
            <h3 className="mt-4 text-xl font-black tracking-wide uppercase text-center truncate w-full px-1 nom-equipe" style={{ color: '#ffffff' }}>
              {matchData.awayTeam.name}
            </h3>
            <span className="text-[11px] font-bold tracking-wider mt-0.5 uppercase" style={{ color: '#34d399' }}>
              {matchData.awayTeam.location}
            </span>
          </div>

        </div>

        {/* PIED DE L'AFFICHE */}
        <div className="relative z-10 flex flex-col items-center w-full pb-2">
          <div className="border backdrop-blur-md px-8 py-4 rounded-xl w-full text-center shadow-xl" style={{ backgroundColor: 'rgba(9, 9, 11, 0.8)', borderColor: 'rgba(39, 39, 42, 0.8)' }}>
            <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: '#fb923c' }}>
              LIEU & HEURE DU MATCH
            </p>
            <h2 className="text-xl font-black tracking-tight uppercase" style={{ color: '#ffffff' }}>
              {matchData.venue} <span style={{ color: '#f97316' }}>•</span> <span>{matchData.time}</span>
            </h2>
            
            <div className="flex items-center justify-center space-x-2 mt-3">
              <span className="text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-md uppercase" style={{ backgroundColor: '#10b981', color: '#09090b' }}>
                {matchData.stage}
              </span>
              <span className="text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-md border uppercase" style={{ backgroundColor: '#18181b', color: '#a1a1aa', borderColor: '#27272a' }}>
                {matchData?.broadcast}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgrammedGame;