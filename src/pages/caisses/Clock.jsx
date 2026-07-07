import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-xs bg-slate-900 text-cyan-400 px-2 py-1 rounded border border-slate-800 tracking-wider">
      {time.toLocaleDateString()} {time.toLocaleTimeString()}
    </span>
  );
}