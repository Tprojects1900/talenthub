import React, { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import t1 from "../assets/images/t1.png";
import t2 from "../assets/images/t2.png";
import stadiumBg from "../assets/images/stadium2.png"; 

const TopFootScorePoster = ({ 
  homeTeam = { name: "ASFOSA", logo: t1 },
  awayTeam = { name: "AGAZA", logo: t2 },
  score = { home: 3, away: 1 },
  buteursDom = [
    { name: "Abhi", time: "41:00" },
    { name: "Abhi", time: "58:00" },
    { name: "K. Jean", time: "72:15" }
  ],
  buteursExt = [
    { name: "A. Moussa", time: "14:45" }
  ]
}) => {
  const posterRef = useRef(null);

  // Fonction pour regrouper les buteurs de même nom et lister leurs minutes
  const regrouperButeurs = (buteurs) => {
    const groupes = {};
    buteurs.forEach(b => {
      if (!groupes[b.name]) {
        groupes[b.name] = { name: b.name, count: 0, times: [] };
      }
      groupes[b.name].count += 1;
      groupes[b.name].times.push(b.time);
    });
    return Object.values(groupes);
  };

  const buteursDomGroupes = regrouperButeurs(buteursDom);
  const buteursExtGroupes = regrouperButeurs(buteursExt);

  const handleDownload = useCallback(() => {
    if (posterRef.current === null) return;

    // Configuration avancée anti-flou pour l'image de fond
    toPng(posterRef.current, {
      cacheBust: true,
      pixelRatio: 3, // Force le rendu en très haute densité (Net et précis)
      imagePlaceholder: stadiumBg,
      style: { 
        transform: 'scale(1)',
        imageRendering: 'auto' // Empêche le lissage flou du navigateur
      }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `topfoot-${homeTeam.name}-${awayTeam.name}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Erreur lors de l\'exportation de l\'affiche:', err);
      });
  }, [posterRef, homeTeam, awayTeam]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 bg-zinc-900/10 rounded-2xl max-w-xl mx-auto">
      
      {/* CORPS DE L'AFFICHE : 500x500 STRICT */}
      <div 
        ref={posterRef}
        className="w-[500px] h-[500px] text-white p-6 flex flex-col justify-between relative overflow-hidden font-sans select-none border border-zinc-900 bg-zinc-950"
      >
        {/* BACKGROUND STADE NETTOYÉ ET FIXÉ */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${stadiumBg})`,
            imageRendering: '-webkit-optimize-contrast' // Force la netteté des pixels sur le background
          }}
        />
        
        {/* COUCHE D'HUILE SOMBRE ACCENTUÉE POUR FAIRE RESSORTIR LES ÉLÉMENTS */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1520]/52 via-[#0d1520]/35 to-[#050b14]/95 z-0" />

        {/* Ligne dégradée haute style EDOMATCH */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-emerald-500 via-yellow-500 to-transparent z-10"></div>

        {/* HALOS LUMINEUX */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-10"></div>
        <div className="absolute top-1/4 -right-10 w-52 h-52 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-10"></div>

        {/* HEADER MINI */}
        <div className="text-center z-10 flex flex-col items-center">
          <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-[#0d1520]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/20">
            TOP FOOT • 5ème Édition
          </span>
        </div>

        {/* BLOC CENTRAL : LOGOS, NOMS ET SCORE */}
        <div className="flex items-center justify-between z-10 my-auto w-full px-2">
          
          {/* Équipe Domicile */}
          <div className="w-1/3 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-zinc-950/80 border border-white/[0.1] backdrop-blur-md rounded-full p-1.5 shadow-2xl flex items-center justify-center">
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white text-center px-1 block w-full whitespace-nowrap overflow-visible drop-shadow-md">
              {homeTeam.name}
            </span>
          </div>

          {/* Le Score Central Fluide */}
          <div className="w-1/3 flex items-center justify-center gap-2 bg-zinc-950/40 backdrop-blur-sm py-2 px-3 rounded-xl border border-white/[0.03]">
            <span className="text-4xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">{score.home}</span>
            <span className="text-zinc-500 font-black text-lg font-mono">:</span>
            <span className="text-4xl font-mono font-black text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">{score.away}</span>
          </div>

          {/* Équipe Extérieur */}
          <div className="w-1/3 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-zinc-950/80 border border-white/[0.1] backdrop-blur-md rounded-full p-1.5 shadow-2xl flex items-center justify-center">
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-white text-center px-1 block w-full whitespace-nowrap overflow-visible drop-shadow-md">
              {awayTeam.name}
            </span>
          </div>

        </div>

        {/* PANNEAU DES BUTEURS REGROUPÉS AUTOMATIQUEMENT */}
        <div className="z-10 w-full px-2">
          <div className="bg-zinc-950/70 border border-white/[0.08] backdrop-blur-md rounded-xl p-3 grid grid-cols-2 gap-4 max-h-[140px] overflow-hidden shadow-2xl">
            
            {/* Buteurs Home Club */}
            <div className="space-y-1.5 border-r border-white/[0.08] pr-2">
              {buteursDomGroupes.map((buteur, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] text-zinc-200">
                  <span className="truncate font-semibold max-w-[65%] flex items-center gap-0.5">
                    {buteur.name} 
                    {/* Génère dynamiquement le nombre de ballons selon les buts */}
                    <span className="ml-1 text-[10px] tracking-tighter">
                      {"⚽".repeat(buteur.count)}
                    </span>
                  </span>
                  <span className="font-mono text-[9px] text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-white/[0.02] ml-auto whitespace-nowrap">
                    {buteur.times.join(', ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Buteurs Away Club */}
            <div className="space-y-1.5 pl-2">
              {buteursExtGroupes.map((buteur, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] text-zinc-200">
                  <span className="truncate font-semibold max-w-[65%] flex items-center gap-0.5">
                    {buteur.name} 
                    <span className="ml-1 text-[10px] tracking-tighter">
                      {"⚽".repeat(buteur.count)}
                    </span>
                  </span>
                  <span className="font-mono text-[9px] text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-white/[0.02] ml-auto whitespace-nowrap">
                    {buteur.times.join(', ')}
                  </span>
                </div>
              ))}
              {buteursExtGroupes.length === 0 && (
                <div className="text-[10px] text-zinc-500 italic text-center pt-2">Aucun buteur</div>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER MINI */}
        <div className="z-10 w-full px-2 pt-2 flex flex-col items-center gap-2">
          <div className="w-full bg-zinc-950/80 border border-white/[0.05] backdrop-blur-sm rounded-lg py-1.5 text-center text-[10px] font-mono text-zinc-400 tracking-wide uppercase shadow-lg">
            🏟️ Terrain Maya Kopé • Fin de match
          </div>
          <div className="w-16 h-[2px] bg-emerald-500/50 rounded-full"></div>
        </div>

      </div>

      {/* ACTION */}
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        Exporter l'affiche Ultra HD (500x500 PNG)
      </button>

    </div>
  );
};

export default TopFootScorePoster;