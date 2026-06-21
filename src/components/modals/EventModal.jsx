import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const EventModal = ({ isVisible, eventComing, teams = [], onClose }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    if (!isVisible || !eventComing) return;

    const [hours, minutes] = eventComing.hour.split(':').map(Number);
    
    const targetDate = new Date(
      eventComing.year,
      eventComing.month - 1,
      eventComing.day,
      hours,
      minutes
    ).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isVisible, eventComing]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none font-mono antialiased"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-black border border-zinc-900 rounded-none shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER PURISTE ================= */}
        <div className="relative pt-8 pb-6 px-6 sm:px-8 border-b border-zinc-900 bg-zinc-950/60">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 bg-black transition-colors"
            aria-label="Fermer la boîte de dialogue"
          >
            <X size={14} />
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 w-fit">
              <span className="inline-block w-1.5 h-1.5 bg-white animate-pulse"></span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                STREAM_EVENT_COMING
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight pr-8">
              {eventComing?.title}
            </h1>
            {eventComing?.description && (
              <p className="text-zinc-500 font-sans text-xs leading-relaxed max-w-xl">
                {eventComing.description}
              </p>
            )}
          </div>
        </div>

        {/* ================= CONTENU RESPONSIVE SCROLLABLE ================= */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-black">
          
          {/* Section Compte à Rebours */}
          {!timeLeft.isOver ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-2">
                <Calendar size={13} className="text-zinc-500" />
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  INITIALISATION_SEQUENCE_TEMPORELLE
                </h2>
              </div>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'JOURS', value: timeLeft.days },
                  { label: 'HEURES', value: timeLeft.hours },
                  { label: 'MINUTES', value: timeLeft.minutes },
                  { label: 'SECONDES', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center p-3 border border-zinc-900 bg-zinc-950/40 group hover:border-zinc-700 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tighter tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[8px] font-bold text-zinc-600 tracking-wider mt-1 group-hover:text-zinc-400 transition-colors">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-zinc-900 bg-zinc-950 flex items-center justify-center gap-3">
              <ShieldAlert size={16} className="text-white animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest text-white">
                COMPETITION_EN_COURS_DE_PRODUCTION
              </p>
            </div>
          )}

          {/* Section Équipes Complète avec Logos en Couleur */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900/60 pb-2">
              <Users size={13} className="text-zinc-500" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                REGISTRE_UNITE_PREINSCRITES
              </h2>
              <span className="ml-auto font-mono text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                QTY: {String(teams ? teams.length : 0).padStart(2, '0')}
              </span>
            </div>
            
            {teams && teams.length > 0 ? (
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 gap-3">
                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-3 border border-zinc-900/60 bg-zinc-950/20 hover:bg-zinc-950 hover:border-zinc-800 transition-colors"
                  >
                    {/* Conteneur Logo - Fond blanc discret pour faire ressortir les vraies couleurs du blason */}
                    <div className="w-12 h-12 border border-zinc-900 bg-white flex items-center justify-center mb-3 overflow-hidden self-start p-1 shadow-sm">
                      <img
                        src={team.logo}
                        alt={`Logo ${team.nom}`}
                        className="w-full h-full object-contain" // Plus aucun filtre monochrome ici !
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/000000/ffffff?text=FC';
                        }}
                      />
                    </div>
                    {/* Infos Club */}
                    <div className="text-xs font-black text-zinc-200 uppercase tracking-wide truncate w-full">
                      {team.nom}
                    </div>
                    <div className="text-[9px] font-sans text-zinc-600 uppercase tracking-tight truncate w-full mt-0.5">
                      {team.quartier || 'SECTEUR_NC'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-zinc-900 text-zinc-600 text-xs">
                AUCUNE_ENTITE_ENREGISTREE
              </div>
            )}
          </div>

        </div>

        {/* ================= FOOTER / CONTROLES ================= */}
        <div className="px-6 sm:px-8 py-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
          >
            FERMER
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors"
          >
            ACCEDER AU SITE
            <ArrowUpRight size={12} />
          </button>
        </div>

      </div>
    </div>
  );
};