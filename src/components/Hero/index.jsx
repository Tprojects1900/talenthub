import React, { useState } from "react";
import { Shield, Calendar, MapPin, DollarSign, Users, CheckSquare, Phone, ArrowUpRight } from "lucide-react";

export default function FootballTournamentHero() {
  return (
    <div className="w-full bg-black text-zinc-300 font-mono antialiased selection:bg-white selection:text-black">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full min-h-screen bg-black border-b border-zinc-900 flex flex-col justify-center px-4 sm:px-8 lg:px-16 pt-24 pb-16">
        {/* Grille de fond de type Blueprint */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f1a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f1a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Colonne Gauche - Identité & Titre */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="inline-flex items-center gap-3 border border-zinc-800 bg-zinc-950 px-4 py-1.5 w-fit rounded-none">
                <span className="inline-block w-2 h-2 bg-white animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  5EME EDITION / TOP. 2026
                </span>
              </div>

              <div className="flex flex-col">
                <h1 className="text-6xl sm:text-8xl lg:text-[110px] font-black leading-none tracking-tighter text-white uppercase m-0">
                  TOP FOOT
                </h1>
                <h2 className="text-2xl sm:text-4xl font-black text-zinc-600 tracking-widest uppercase mt-2">
                  [ TOURNOI ]
                </h2>
              </div>

              <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl border-l border-zinc-800 pl-4">
                L'arène footballistique majeure de la commune revient. Compétition absolue, rigueur tactique et confrontation d'élite. Préparez vos effectifs pour l'impact.
              </p>

              {/* Actions Brutalistes */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#inscription"
                  className="group flex items-center justify-center gap-2 bg-white text-black font-black px-8 py-4 rounded-none hover:bg-zinc-200 transition-colors uppercase text-xs tracking-widest text-center"
                >
                  REJOINDRE L'ARENE
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href="#details"
                  className="border border-zinc-800 text-zinc-400 font-bold px-8 py-4 rounded-none hover:bg-zinc-950 hover:text-white transition-colors uppercase text-xs tracking-widest text-center"
                >
                  SPECIFICATIONS_TECHNIQUES
                </a>
              </div>
            </div>

            {/* Colonne Droite - Bloc de Données Flottant */}
            <div className="lg:col-span-4 w-full border border-zinc-900 bg-zinc-950/60 p-6 backdrop-blur-sm self-center">
              <div className="space-y-6">
                <div className="border-b border-zinc-900 pb-4">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">PROGRAMME_MAIN</span>
                  <div className="flex items-center gap-3 text-white font-bold text-sm">
                    <Calendar size={16} className="text-zinc-500" />
                    <span>05 JUILLET 2026</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">LOCALISATION_ARENE</span>
                  <div className="flex items-center gap-3 text-white font-bold text-sm">
                    <MapPin size={16} className="text-zinc-500" />
                    <span className="uppercase">TERRAIN_MAYA_KOPE</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= DETAILS SECTION ================= */}
      <section id="details" className="w-full py-24 px-4 sm:px-8 lg:px-16 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <span className="w-6 h-[1px] bg-zinc-700"></span>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-500">
              01 // PARAMETRES_COMPETITION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-900 border border-zinc-900 bg-zinc-950/30">
            {/* Bloc 1 */}
            <div className="p-8 flex flex-col justify-between group hover:bg-zinc-950 transition-colors">
              <div>
                <div className="text-zinc-600 group-hover:text-white transition-colors mb-6">
                  <Users size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">CATEGORIES</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Séniors et Juniors. Phase d'accès ouverte aux équipes communales et régionales homologuées.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-600 tracking-wider">CAPACITE_MAX : 20 EQUIPES</span>
              </div>
            </div>

            {/* Bloc 2 */}
            <div className="p-8 flex flex-col justify-between group hover:bg-zinc-950 transition-colors">
              <div>
                <div className="text-zinc-600 group-hover:text-white transition-colors mb-6">
                  <MapPin size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">LOGISTIQUE</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Planification fixée sur le Terrain de Maya Kopé, Lomé. Infrastructures sécurisées et encadrement arbitral agréé.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-600 tracking-wider">REPERE : DERRIERE RADIO LA GRÂCE</span>
              </div>
            </div>

            {/* Bloc 3 */}
            <div className="p-8 flex flex-col justify-between group hover:bg-zinc-950 transition-colors">
              <div>
                <div className="text-zinc-600 group-hover:text-white transition-colors mb-6">
                  <DollarSign size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">CONSTITUTION_DOSSIER</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Frais de participation uniques requis pour l'activation réglementaire de la licence d'équipe.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-baseline justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">MONTANT :</span>
                <span className="text-lg font-black text-white font-mono">25 000 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FORMAT & RULES SECTION ================= */}
      <section className="w-full py-24 px-4 sm:px-8 lg:px-16 bg-zinc-950/40 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <span className="w-6 h-[1px] bg-zinc-700"></span>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-500">
              02 // STRUCTURATION_MATRICIELLE
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Workflow Technique */}
            <div className="lg:col-span-5 space-y-4">
              {[
                { step: "01", title: "PHASE DE GROUPES", desc: "Série de confrontations circulaires au sein de poules tirées au sort." },
                { step: "02", title: "ELIMINATION DIRECTE", desc: "Demi-finales à haute intensité. Élimination instantanée en cas de défaite." },
                { step: "03", title: "FINALE & PROTOCOLE", desc: "Match ultime, protocole de clôture et attribution des distinctions." }
              ].map((item, idx) => (
                <div key={idx} className="p-5 border border-zinc-900 bg-black flex gap-4 items-start">
                  <span className="font-mono font-black text-xs text-zinc-600 px-2 py-0.5 border border-zinc-900 bg-zinc-950">{item.step}</span>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Clauses / Critères Restrictifs */}
            <div className="lg:col-span-7 border border-zinc-900 bg-black p-8">
              <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-6 flex items-center gap-2">
                <Shield size={14} className="text-zinc-600" /> CRITERES_D_ELIGIBILITE_OBLIGATOIRES
              </h4>

              <div className="space-y-4 font-sans text-xs text-zinc-400">
                {[
                  "Enregistrement strict limité à 20 joueurs inscrits et 2 dirigeants certifiés par entité.",
                  "Fiche technique validée : aucun joueur non répertorié ne sera toléré sur la feuille de match.",
                  "Contrôle d'identité physique obligatoire sur présentation d'une pièce officielle valide avant le coup d'envoi.",
                  "Règlement total des frais de participation et des droits exigés avant l'autorisation d'accès au premier match de poule.",
                  "Uniformité vestimentaire : équipements complets et identiques aux couleurs officielles déclarées."
                ].map((rule, idx) => (
                  <div key={idx} className="flex gap-3 items-start py-2 border-b border-zinc-900/60 last:border-none">
                    <CheckSquare size={14} className="text-white mt-0.5 flex-shrink-0 font-mono" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section id="inscription" className="w-full py-28 px-4 sm:px-8 lg:px-16 bg-black relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white m-0">
            PROFILING_EN_COURS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto font-sans leading-relaxed">
            Soumettez votre effectif à la commission d'organisation. Enregistrement direct via les passerelles de communication sécurisées ci-dessous.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="https://chat.whatsapp.com/Bh26e1MttG29J8bvmag87M"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black font-black px-8 py-4 rounded-none hover:bg-zinc-200 transition-colors text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            >
              SOUMETTRE VIA WHATSAPP
            </a>
            <a
              href="tel:+22871614052"
              className="border border-zinc-800 bg-zinc-950 text-white font-bold px-8 py-4 rounded-none hover:bg-black transition-colors text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Phone size={12} /> +228 71 61 40 52
            </a>
          </div>

          <div className="pt-6">
            <span className="text-[10px] bg-zinc-950 text-zinc-600 font-mono tracking-widest uppercase px-3 py-1 border border-zinc-900">
              DEADLINE_SYSTEME : 28 JUIN 2026
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}