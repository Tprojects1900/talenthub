import React, { useState, useEffect } from "react";

function DebugConsole() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      setLogs((prev) => [...prev, args.join(" ")]);
      originalError(...args);
    };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 0, background: "black", color: "red", padding: 10, maxHeight: 200, overflow: "auto" }}>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
export default DebugConsole;