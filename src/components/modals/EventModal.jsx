import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users } from 'lucide-react';

export const EventModal = ({ isVisible, eventComing, teams, onClose }) => {
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
        seconds: Math.floor((difference / 100) % 60),
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Émeraude gradient */}
        <div className="relative pt-8 pb-10 px-8 bg-gradient-to-br from-emerald-600 to-emerald-700">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold text-emerald-100 uppercase tracking-widest px-3 py-1 bg-emerald-500/30 rounded-full">
              Événement à venir
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {eventComing?.title}
            </h1>
            <p className="text-emerald-50 text-sm font-light max-w-lg">
              {eventComing?.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          
          {/* Countdown Section */}
          {!timeLeft.isOver ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Calendar size={18} className="text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  L'évènement commence dans
                </h2>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Jours', value: timeLeft.days },
                  { label: 'Heures', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Secondes', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 transition-all duration-300"
                  >
                    <div className="text-3xl md:text-4xl font-black text-emerald-600 tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[7px] md:text-xs font-semibold text-emerald-700 uppercase tracking-wider mt-2">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">
                L&apos;événement a commencé! ⚽
              </p>
            </div>
          )}

          {/* Teams Section */}
          {teams && teams.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users size={18} className="text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Préinscriptions en cours
                </h2>
                <span className="ml-auto px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                  {teams.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src={team.logo}
                        alt={`Logo ${team.nom}`}
                        className="w-14 h-14 object-contain"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/ecfdf5/10b981?text=FC';
                        }}
                      />
                    </div>
                    <div className="text-sm font-bold text-gray-900 text-center line-clamp-2 w-full">
                      {team.nom}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1 line-clamp-1">
                      {team.quartier}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            Fermer
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200 shadow-sm"
          >
            Accéder au site
          </button>
        </div>

      </div>
    </div>
  );
};