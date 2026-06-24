import React from "react";
import { useSwitch } from "../context/SwitchContext"; // Ajuste le chemin selon ta structure
import { Settings, Eye, EyeOff, ShieldAlert, Sliders, Save } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout"
const AdminSettings = () => {
  const { enabled, disabled, toggle, toggleDisable } = useSwitch();

  return (
    <AdminLayout>
    <div className="min-h-screen bg-zinc-900/50 text-zinc-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              Paramètres Généraux
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configurez le comportement global de l'application et la visibilité des modules.
            </p>
          </div>
        </div>

        {/* SECTION : GESTION DES MODALS ET ÉVÉNEMENTS */}
        <div className="bg-zinc-950/40 border border-white/[0.05] backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-300">
              Contrôle de l'affichage
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-white/[0.05]">
            
            {/* OPTION 1 : DÉSACTIVATION COMPLÈTE (FORCE DISABLE) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    Bloquer définitivement le Modal d'Événement
                  </span>
                  {disabled && (
                    <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono uppercase">
                      Bloqué
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cette option désactive complètement le modal d'événement sur toute la plateforme et écrase l'état d'activation actuel. Tant que cette case est cochée, aucun utilisateur ne pourra voir ou réactiver le modal, même manuellement.
                </p>
              </div>

              {/* BOUTON TOGGLE DISABLE */}
              <button
                onClick={toggleDisable}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  disabled ? "bg-red-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    disabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* OPTION 2 : VISIBILITÉ ACTUELLE (ENABLED) */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    Statut de Visibilité du Modal
                  </span>
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-mono uppercase ${
                    enabled && !disabled 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}>
                    {enabled && !disabled ? "Visible" : "Masqué"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Activez ou désactivez l'affichage temporaire du modal pour les visiteurs. 
                  {disabled && (
                    <span className="text-red-400 block mt-1 font-medium">
                      ⚠️ Option verrouillée car le blocage définitif est actif ci-dessus.
                    </span>
                  )}
                </p>
              </div>

              {/* BOUTON TOGGLE ENABLED */}
              <button
                disabled={disabled}
                onClick={toggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled && !disabled ? "bg-emerald-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled && !disabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* ZONE DE NOTIFICATION DE SÉCURITÉ */}
        {disabled && (
          <div className="flex items-start gap-3 bg-red-950/20 border border-red-500/10 rounded-xl p-4 text-xs text-red-300">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p className="leading-relaxed">
              <strong>Mode Sécurité Activé :</strong> Le modal d'événement est actuellement forcé à l'état "éteint". Pour pouvoir modifier à nouveau son affichage standard, vous devez d'abord désactiver le commutateur de blocage ci-dessus.
            </p>
          </div>
        )}

      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminSettings;