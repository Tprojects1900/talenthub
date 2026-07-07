import React from 'react';

export default function CashHistoryView({ teams }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4 pl-6">Équipe</th>
              <th className="p-4">Frais Concerné</th>
              <th className="p-4">Somme Initiale</th>
              <th className="p-4">Dernier Versement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300">
            {teams.flatMap(t => 
              (!t.cashLabels || t.cashLabels.length === 0) ? [] : t.cashLabels.map(l => ({ teamName: t.teamName, label: l }))
            ).map((row, index) => (
              <tr key={index} className="hover:bg-slate-950/40 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-200">{row.teamName}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-medium">{row.label.name}</span></td>
                <td className="p-4 font-mono text-slate-400">{parseFloat(row.label.initialSum).toLocaleString()} F CFA {row.label.initialDate && <span className="text-[9px] text-slate-600 block">le {row.label.initialDate}</span>}</td>
                <td className="p-4 font-mono text-cyan-400 font-semibold">{parseFloat(row.label.todaySum).toLocaleString()} F CFA <span className="text-[9px] text-slate-500 block">le {row.label.todayDate}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}