import { useEffect, useRef, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

export default function MatchTimer({
  selectedMatch = { timer: "00:00" },
  loading = false,
  size = ""
}) {
  const [time, setTime] = useState(selectedMatch?.timer ?? "00:00");

  // On stocke les références pour l'incrémentation fluide côté client
  const isExtraTimeRef = useRef(false);
  const baseSecondsRef = useRef(0);
  const extraSecondsRef = useRef(0);
  const fetchedAtRef = useRef(Date.now());

  useEffect(() => {
    if (loading || !selectedMatch) return;

    const timer = selectedMatch.timer ?? "00:00";

    // Match non en cours : on fige juste l'affichage reçu
    if (selectedMatch.status !== "live") {
      setTime(timer);
      return;
    }

    // --- ANALYSE INTELLIGENTE DU TIMER DU BACKEND ---
    let baseSeconds = 0;
    let extraSeconds = 0;
    let isExtraTime = false;

    if (timer.includes("+")) {
      // Cas Temps additionnel : "35:00 + 01:24"
      isExtraTime = true;
      const [partNormal, partExtra] = timer.split("+").map(str => str.trim());

      // 1. Calcul de la partie réglementaire
      const [nMins, nSecs] = partNormal.split(":").map(Number);
      if (!isNaN(nMins) && !isNaN(nSecs)) baseSeconds = nMins * 60 + nSecs;

      // 2. Calcul de la partie additionnelle
      const [eMins, eSecs] = partExtra.split(":").map(Number);
      if (!isNaN(eMins) && !isNaN(eSecs)) extraSeconds = eMins * 60 + eSecs;

    } else if (timer.includes(":")) {
      // Cas Temps normal : "24:12"
      isExtraTime = false;
      const [mins, secs] = timer.split(":").map(Number);
      if (!isNaN(mins) && !isNaN(secs)) baseSeconds = mins * 60 + secs;
    }

    // Sauvegarde dans les refs
    isExtraTimeRef.current = isExtraTime;
    baseSecondsRef.current = baseSeconds;
    extraSecondsRef.current = extraSeconds;
    fetchedAtRef.current = Date.now();

    setTime(timer);

    // --- LE CHRONO LOCAL ---
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - fetchedAtRef.current) / 1000);

      // Fonction utilitaire pour formater en MM:SS
      const formatMMSS = (totalSecs) => {
        const m = String(Math.floor(totalSecs / 60)).padStart(2, "0");
        const s = String(totalSecs % 60).padStart(2, "0");
        return `${m}:${s}`;
      };

      if (isExtraTimeRef.current) {
        // Si on est déjà en temps additionnel, on incrémente uniquement les secondes additionnelles
        const newExtraTotal = extraSecondsRef.current + elapsedSeconds;
        setTime(`${formatMMSS(baseSecondsRef.current)} + ${formatMMSS(newExtraTotal)}`);
      } else {
        // Temps normal classique
        const newNormalTotal = baseSecondsRef.current + elapsedSeconds;
        setTime(formatMMSS(newNormalTotal));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, selectedMatch?.id, selectedMatch?.timer, selectedMatch?.status]);

  return (
    <div className="font-mono text-4xl font-black text-zinc-100 flex items-center justify-center gap-2">
      <Clock className="text-[#FFD700]" size={size ? 12 : 24} />

      {loading || !selectedMatch ? (
        <Loader2 size={18} className="animate-spin text-[#FFD700]" />
      ) : (
        <span className={size ? size : ''}>{time}</span>
      )}
    </div>
  );
}