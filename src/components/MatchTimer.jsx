import { useEffect, useRef, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

export default function MatchTimer({
  selectedMatch = { timer: "00:00" },
  loading = false,
  size=""
}) {
  const [time, setTime] = useState(selectedMatch?.timer ?? "00:00");

  const baseSecondsRef = useRef(0);
  const fetchedAtRef = useRef(Date.now());

  useEffect(() => {
    if (loading || !selectedMatch) return;

    const timer = selectedMatch.timer ?? "00:00";

    // Match non en cours
    if (selectedMatch.status !== "live") {
      setTime(timer);
      return;
    }

    // Conversion mm:ss -> secondes
    let baseSeconds = 0;

    if (timer.includes(":")) {
      const [mins, secs] = timer.split(":").map(Number);

      if (!isNaN(mins) && !isNaN(secs)) {
        baseSeconds = mins * 60 + secs;
      }
    }

    baseSecondsRef.current = baseSeconds;
    fetchedAtRef.current = Date.now();

    setTime(timer);

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - fetchedAtRef.current) / 1000
      );

      const totalSeconds = baseSecondsRef.current + elapsedSeconds;

      const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const secs = String(totalSeconds % 60).padStart(2, "0");

      setTime(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, selectedMatch?.id, selectedMatch?.timer, selectedMatch?.status]);

  return (
    <div className="font-mono text-4xl font-black text-zinc-100 flex items-center justify-center gap-2">
      <Clock className="text-[#FFD700]" size={size ? 12:24} />

      {loading || !selectedMatch ? (
        <Loader2
          size={18}
          className="animate-spin text-[#FFD700]"
        />
      ) : (
        <span className={size ? size : ''}>{time}</span>
      )}
    </div>
  );
}