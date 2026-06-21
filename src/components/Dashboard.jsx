import React from 'react';
import { Users, Shield, CalendarCheck2, Activity, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  // Fausses données représentatives et filtrées pour le monitoring
  const stats = [
    { label: 'Équipes Engagées', value: '16', details: 'Réparties sur 4 poules', icon: Users, color: 'text-blue-400' },
    { label: 'Matchs Planifiés', value: '24 / 48', details: '50% programmés', icon: CalendarCheck2, color: 'text-[#FFD700]' },
    { label: 'Terrains Actifs', value: '3', details: 'Lomé & banlieues', icon: Shield, color: 'text-emerald-400' },
  ];

  const upcomingMatches = [
    { id: 1, home: 'Galaxie FC', away: 'Étoile du Sud', date: '28 Juin', time: '15:00', type: 'Match d\'ouverture' },
    { id: 2, home: 'Aigles de Lomé', away: 'Foudre FC', date: '29 Juin', time: '17:00', type: '1ère Journée' },
  ];

  return (
    <div className="space-y-6">
      
      {/* MESSAGE DE BIENVENUE ÉPURÉ */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-850 p-6 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-base font-black text-white">Ravi de vous revoir 👋</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Le tournoi se déroule parfaitement. Voici un état rapide des opérations globales.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[10px] font-bold uppercase text-zinc-400 rounded-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Serveur en ligne
          </span>
        </div>
      </div>

      {/* SECTION 1 : METRICS FONDAMENTALES (Pas de surcharge visuelle) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-colors">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-zinc-100">{stat.value}</p>
                <p className="text-[10px] font-medium text-zinc-400">{stat.details}</p>
              </div>
              <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-850 ${stat.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2 : DOUBLE GRILLE DE LOGISTIQUE IMMÉDIATE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloc Prochaines Échéances */}
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <CalendarCheck2 size={14} className="text-[#FFD700]" /> Prochaines Programmations
            </h3>
            <button className="text-[10px] text-[#FFD700] font-bold uppercase tracking-wider flex items-center gap-0.5 hover:underline">
              Voir tout <ArrowUpRight size={10} />
            </button>
          </div>

          <div className="space-y-2">
            {upcomingMatches.map((m) => (
              <div key={m.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-zinc-200">{m.home} <span className="text-[10px] text-zinc-500 font-normal">vs</span> {m.away}</div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">{m.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-zinc-300 font-mono">{m.date}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold font-mono">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloc Flux d'activités Système / Logistique */}
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" /> Flux d'Activité Récent
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="space-y-3 pl-2 border-l border-zinc-850 ml-1">
            <div className="relative text-xs">
              <div className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-[#FFD700]"></div>
              <p className="font-bold text-zinc-300">Nouveau match programmé direct</p>
              <p className="text-[10px] text-zinc-500 font-medium">Il y a 12 min • par Admin</p>
            </div>
            <div className="relative text-xs">
              <div className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-zinc-700"></div>
              <p className="font-bold text-zinc-400">Poule B modifiée (Équipe assignée via sélecteur)</p>
              <p className="text-[10px] text-zinc-500 font-medium">Il y a 1 heure • par Admin</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;