import React, { useState, useEffect } from "react";
import { Timer, Calendar, Shield, CheckCircle2, AlertCircle, Save, Loader2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../Loader";
export default function MatchTimerSettings({ 
  currentSchedule, // Le match programmé le plus proche injecté directement depuis votre query
  onSaveEachHalf ,  // Votre mutation GraphQL saveEachHalfTime
  adding=false
}) {
  const [eachHalfValue, setEachHalfValue] = useState(45);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Synchronise la valeur de l'input si le match change ou possède déjà une configuration
  useEffect(() => {
    if (currentSchedule) {
      setEachHalfValue(currentSchedule.eachHalf || 45);
    }
  }, [currentSchedule]);

 

  const homeName = currentSchedule?.homeTeam?.nom || currentSchedule.homeTeam?.name || "Équipe Dom.";
  const awayName = currentSchedule?.awayTeam?.nom || currentSchedule.awayTeam?.name || "Équipe Ext.";
  const matchId = currentSchedule?._id || currentSchedule?.id;
  const isProg=currentSchedule?.status === "programmed";

  const handleSave = async () => {
    if(!currentSchedule) return ;
    setLoading(true);
    

    try {
      await onSaveEachHalf({
        variables: {
          matchId: matchId,
          eachHalf: parseInt(eachHalfValue, 10),
        }
      });
      
      toast.success(`Chrono configuré : ${eachHalfValue} min par mi-temps (${eachHalfValue * 2} min au total).`);
    } catch (err) {
     toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 p-6 md:p-10 font-sans flex flex-col items-center justify-center">
    
      <div className="w-full max-w-2xl">
        {/* En-tête de la page */}
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-900/80 pb-5">
          <div className="p-2.5 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20 text-[#FFD700]">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider">Match à configurer</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Configurez le temps réglementaire avant le coup d'envoi.</p>
          </div>
        </div>

        {/* Carte Centrale du Match Courant */}
        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Badge Match Proche */}
          <div className="absolute top-0 right-0 bg-[#FFD700]/10 text-[#FFD700] border-l border-b border-zinc-900 px-4 py-1.5 rounded-bl-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3 h-3 animate-pulse" />
            Suivant
          </div>

          {/* Date & Terrain */}
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-6">
            <Calendar className="w-4 h-4 text-zinc-600" />
            <span>{currentSchedule.date} à {currentSchedule.time}</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">{currentSchedule.pitch || "Terrain Principal"}</span>
          </div>

          {/* Duel des Équipes (Style Scoreboard épuré) */}
          <div className="flex items-center justify-between gap-4 py-4 border-b border-zinc-900/60 mb-6">
            {/* Domicile */}
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 mb-2 shadow-inner">
                {currentSchedule.homeTeam?.logo ? (
                  <img src={currentSchedule.homeTeam.logo} alt={homeName} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-6 h-6 text-zinc-700" />
                )}
              </div>
              <span className="text-sm font-black text-white truncate w-full">{homeName}</span>
            </div>

            {/* VS Séparateur */}
            <div className="font-mono text-zinc-700 text-sm font-black px-3 py-1 bg-zinc-950 rounded-lg border border-zinc-900">
              VS
            </div>

            {/* Extérieur */}
            <div className="flex flex-col items-center text-center flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 mb-2 shadow-inner">
                {currentSchedule.awayTeam?.logo ? (
                  <img src={currentSchedule.awayTeam.logo} alt={awayName} className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-6 h-6 text-zinc-700" />
                )}
              </div>
              <span className="text-sm font-black text-white truncate w-full">{awayName}</span>
            </div>
          </div>

          {/* Formulaire de saisie du temps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2.5">
              <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Durée d'une mi-temps
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={eachHalfValue}
                  readOnly={!isProg}
                  onChange={(e) => setEachHalfValue(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xl font-mono font-black text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors shadow-inner"
                />
                <span className="absolute right-4 text-zinc-500 font-bold text-xs uppercase tracking-wider">min</span>
              </div>
            </div>

            {/* Bouton d'action */}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !isProg}
              className=" cursor-pointer disabled:cursor-not-allowed w-full flex items-center justify-center gap-2 bg-[#FFD700] text-zinc-950 font-black uppercase text-xs tracking-widest h-[50px] rounded-xl hover:bg-[#ffe240] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-[#FFD700]/5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Confirmer le Chrono
            </button>
          </div>

          {/* Recapitulatif visuel du format */}
          <div className="mt-6 pt-4 border-t border-zinc-900/60 flex flex-wrap justify-between items-center text-xs text-zinc-500 gap-2">
            <div>
              Format de jeu configuré : <span className="text-zinc-300 font-bold">2 périodes de {eachHalfValue} min</span>
            </div>
            <div className="text-right">
              Temps réglementaire total : <span className="text-white font-black text-sm">{eachHalfValue * 2} min</span>
            </div>
          </div>

          {/* Alertes / Notifications de retour */}
          {notification && (
            <div className={`mt-5 p-3.5 rounded-xl border text-xs flex gap-2.5 items-start transition-all ${
              notification.type === "success" 
                ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
                : "bg-rose-500/5 border-rose-500/10 text-rose-400"
            }`}>
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}