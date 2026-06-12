import React, { useState } from "react";

export default function FootballTournamentHero() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="w-full bg-white font-sans text-zinc-900">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white overflow-hidden flex flex-col justify-center">
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                <span className="inline-block w-3 h-3 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-amber-200">5ème Édition - 2026</span>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-6xl md:text-7xl font-black leading-tight">
                  TOP FOOT
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-amber-300">
                  CHAMPIONNAT
                </h2>
              </div>

              <p className="text-lg md:text-xl text-emerald-50 leading-relaxed max-w-lg">
                Participez au plus grand tournoi de football de la commune. Une compétition intense, des équipes talentueuses et des moments inoubliables vous attendent.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#inscription"
                  className="bg-amber-400 text-emerald-900 font-black px-8 py-4 rounded-lg hover:bg-amber-300 transition-all duration-300 text-center text-lg shadow-lg hover:shadow-xl"
                >
                  Inscrire mon Équipe
                </a>
                <a
                  href="#details"
                  className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 text-center text-lg"
                >
                  En Savoir Plus
                </a>
              </div>

              <div className="flex gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 12 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  <span>05 JUILLET 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 12 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Terrain Maya Kopé</span>
                </div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                <svg className="w-full h-full text-amber-300" fill="currentColor" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.4" />
                  <path d="M100 20 Q140 60 140 100 Q140 140 100 160 Q60 140 60 100 Q60 60 100 20" fill="currentColor" opacity="0.6" />
                  <circle cx="100" cy="100" r="20" fill="white" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY DETAILS SECTION */}
      <section id="details" className="w-full py-20 px-6 md:px-12 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            Informations du Tournoi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-emerald-600">
              <div className="text-emerald-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.44-.53-1.24-.58-1.77-.15-.53.44-.58 1.24-.15 1.77l3 3.68c.28.34.72.54 1.17.54.48 0 .9-.2 1.19-.56l4-5.15c.38-.49.27-1.21-.22-1.57-.5-.39-1.22-.27-1.61.22z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Catégories</h3>
              <p className="text-zinc-600 mb-4">
                Séniors & Juniors. Ouvert à toutes les équipes de la commune et des régions avoisinantes.
              </p>
              <p className="text-amber-600 font-bold">Équipes limitées à 20</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-amber-500">
              <div className="text-amber-500 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 5V1h-1v4c-3.87 0-7 3.13-7 7h4c0-1.66 1.34-3 3-3s3 1.34 3 3h4c0-3.87-3.13-7-7-7zm6.93 11.29c-1.19-1.29-3.26-2.08-5.51-2.08s-4.32.79-5.51 2.08C5.6 16.16 5 17.55 5 19v3h14v-3c0-1.45-.6-2.84-1.07-3.71z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Lieu & Date</h3>
              <p className="text-zinc-600 mb-4">
                <strong>Date:</strong> 05 Juillet 2026
              </p>
              <p className="text-zinc-600">
                <strong>Lieu:</strong> Terrain de Maya Kopé, derrière Radio La Grâce
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-emerald-700">
              <div className="text-emerald-700 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 12 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Frais d'Inscription</h3>
              <p className="text-4xl font-black text-emerald-600 mb-4">
                25 000 F
              </p>
              <p className="text-zinc-600">
                Par équipe (incluant l'assurance et les trophées)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAT & RULES SECTION */}
      <section className="w-full py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Format du Tournoi
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-600 text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Phases de Poule</h4>
                  <p className="text-zinc-600">
                    Les équipes sont divisées en groupes. Chaque équipe joue contre les autres du groupe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-600 text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Demi-Finales</h4>
                  <p className="text-zinc-600">
                    Les meilleures équipes accèdent aux demi-finales pour une compétition éliminatoire.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-500 text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Finale</h4>
                  <p className="text-zinc-600">
                    Cérémonie d'ouverture, match final et remise des trophées avec podium officiel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 p-8 rounded-2xl border border-emerald-200">
              <h4 className="text-2xl font-bold mb-6">Critères de Participation</h4>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-zinc-700">
                    Effectif limité à <strong>20 joueurs et 2 dirigeants</strong> par équipe.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-zinc-700">
                    Tous les joueurs doivent être <strong>officiellement inscrits</strong> sur la fiche de l'équipe.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-zinc-700">
                    Présentation obligatoire d'une <strong>pièce d'identité valide</strong> lors des contrôles.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-zinc-700">
                    Les frais d'inscription et un des  droits de match de la phase de poules doivent être <strong>entièrement réglés avant le premier match</strong>.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-zinc-700">
                    Chaque équipe doit disposer d'un <strong>jeu de maillots uniforme et conforme</strong> aux couleurs déclarées.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="inscription" className="w-full py-20 px-6 md:px-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Prêt à Participer?
          </h2>
          <p className="text-xl md:text-2xl text-emerald-50">
            Inscrivez votre équipe maintenant et préparez-vous pour le plus grand événement sportif de la commune.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a
              href="https://chat.whatsapp.com/Bh26e1MttG29J8bvmag87M"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-700 font-black px-10 py-5 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg shadow-2xl"
            >
              S'Inscrire via WhatsApp
            </a>
            <a
              href="tel:+22871614052"
              className="border-2 border-white text-white font-bold px-10 py-5 rounded-lg hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Appeler: +228 71 61 40 52
            </a>
          </div>

          <p className="text-sm text-emerald-100 pt-4">
            Les inscriptions fermeront le 28 Juin 2026
          </p>
        </div>
      </section>


    </div>
  );
}