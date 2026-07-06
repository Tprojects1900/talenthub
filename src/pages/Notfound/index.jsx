import { Flag, Home, ArrowLeftCircle } from "lucide-react";

export default function NotFound({ onGoHome = () => (window.location.href = "/") }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B3D2E] flex items-center justify-center px-6">
      {/* Pitch lines background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-8 border-2 border-white rounded-sm" />
        <div className="absolute left-1/2 top-8 bottom-8 w-[2px] bg-white -translate-x-1/2" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white" />
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-24 h-40 border-2 border-white border-l-0" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-40 border-2 border-white border-r-0" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Red card */}
        <div className="relative w-40 sm:w-48 aspect-[3/4] bg-[#DC2626] rounded-md shadow-2xl shadow-black/40 rotate-[-6deg] flex flex-col items-center justify-center mb-8 ring-1 ring-black/10">
          <span className="text-white font-black text-6xl sm:text-7xl tracking-tight leading-none">
            404
          </span>
          <Flag className="w-6 h-6 text-white/80 mt-3" strokeWidth={2.5} />
        </div>

        <p className="uppercase tracking-[0.3em] text-[#F4C430] text-xs sm:text-sm font-semibold mb-3">
          Sifflet arbitre
        </p>
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold mb-4">
          Hors-jeu ! Cette page n'existe pas
        </h1>
        <p className="text-white/70 text-base sm:text-lg mb-10 leading-relaxed">
          La page que vous cherchez a été déplacée, renommée ou n'a jamais été
          sur le terrain. Revenez à la position de départ.
        </p>

        <button
          onClick={onGoHome}
          className="group inline-flex items-center gap-2 bg-white text-[#0B3D2E] font-bold px-6 py-3 rounded-full shadow-lg hover:bg-[#F4C430] hover:text-[#0B3D2E] transition-colors duration-200"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
          <ArrowLeftCircle className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
}