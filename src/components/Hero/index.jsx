import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, DollarSign, Trophy, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTeams } from '../../hooks/useCalls';
const HomePage = () => {

  const [eff,setEff]=useState(0);
  const {teams,loading}=useTeams()
  useEffect(()=>{
  if(!loading){
    setEff(teams?.length || 0);
  }
  },[loading,teams])
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans antialiased overflow-x-hidden">
      
      {/* SECTION HERO */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 pt-20 md:pt-28">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte du Hero */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-3.5 h-3.5" /> 5ème Édition — Tournoi
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
              TOP FOOT <span className="text-emerald-500">2026</span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              La plus grande messe footballistique locale est de retour. Suivez les statistiques en direct, l'évolution des effectifs et l'histoire de chaque club engagé dans la compétition.
            </p>
            
            {/* Badges d'informations clés du tournoi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col items-center lg:items-start gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Coup d'envoi</span>
                <span className="text-sm font-bold text-white">05 Juillet 2026</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col items-center lg:items-start gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Le Théâtre</span>
                <span className="text-sm font-bold text-white">Terrain Maya Kopé</span>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col items-center lg:items-start gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-500 uppercase">Engagement</span>
                <span className="text-sm font-bold text-white">25 000 FCFA</span>
              </div>
            </div>
          </div>

          {/* Visuel d'illustration à droite (Optionnel/Design) */}
          <div className="hidden lg:flex justify-center relative">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full filter blur-3xl w-72 h-72 mx-auto top-10"></div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300 max-w-sm relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono uppercase text-zinc-500">Tableau de Bord Officiel</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between px-4">
                  <span className="text-sm font-bold">{eff} Équipes Engagées</span>
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between px-4">
                  <span className="text-sm font-bold">Statistiques Live</span>
                  <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INJECTION DU WAVE AVEC LA COULEUR FOOTBALL (Vert Émeraude Profond #047857) */}
        <div className="w-full rotate-180 -mb-1 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path 
              fill="#047857" 
              fillOpacity="0.5" 
              d="M0,128L48,128C96,128,192,128,288,117.3C384,107,480,85,576,106.7C672,128,768,192,864,197.3C960,203,1056,149,1152,112C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* SECTION : À PROPOS DU PROJET (Riche, Puriste & Structurée) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Manifeste & Vision</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
            Une Gestion Rigoureuse Pour Les Amoureux Du Vrai Football
          </p>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Bloc 1 : L'essence du tournoi */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-2xl hover:border-zinc-800 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">La Quête du Sacre</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              TOP FOOT n'est pas qu'un simple tournoi d'été, c'est une arène où le talent local est valorisé de manière professionnelle. {eff} équipes se disputent la reconnaissance ultime à travers une formule de championnat moderne et compétitive.
            </p>
          </div>

          {/* Bloc 2 : Clarté administrative & financière */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-2xl hover:border-zinc-800 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Transparence & Discipline</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Avec des frais d'engagement fixés à 25 000 FCFA par club, la plateforme garantit une gestion rigoureuse de l'organisation : arbitrage certifié, sécurité sur le terrain mythique de Maya Kopé, et respect strict du règlement de la compétition.
            </p>
          </div>

          {/* Bloc 3 : Innovation technologique (La touche Senior dev) */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-2xl hover:border-zinc-800 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">Fiches & Effectifs Numérisés</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Nous poussons le professionnalisme au-delà des lignes de touche. Chaque joueur possède sa fiche technique individuelle, ses statistiques de jeu, et chaque club est répertorié de manière unique pour offrir une visibilité médiatique inédite.
            </p>
          </div>

        </div>

        {/* FOOTER INTERNE PROPRE / CALL TO ACTION ACCESSIBLE */}
        <div className="mt-16 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-lg font-bold text-white">Prêt à suivre l'événement ?</h4>
            <p className="text-sm text-zinc-400 font-light">Accédez directement à la liste complète des clubs inscrits pour analyser la composition des équipes.</p>
          </div>
          <Link to = "/equipes" 
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/20 group">
            Explorer les Équipes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </section>
    </div>
  );
};

export default HomePage;