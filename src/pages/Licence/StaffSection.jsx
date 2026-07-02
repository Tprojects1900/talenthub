import React from 'react';

export const StaffCard = ({ member, dominantColor }) => {
  return (
    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border-l-4 shadow-sm" style={{ borderColor: dominantColor }}>
      <img 
        src={member.photo} 
        alt={member.name} 
        className="w-20 h-14 rounded-md object-cover border border-slate-300 shadow-inner"
      />
      <div>
        {/* <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{member.role}</p> */}
        <p className="text-sm font-bold text-slate-800 tracking-tight">{member.name}</p>
        <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[9px] font-bold rounded">
          STAFF-OFFICIAL
        </span>
      </div>
    </div>
  );
};

export const StaffSection = ({ staff, dominantColor }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest mb-2.5">Staff Technique</h3>
      <div className="grid grid-cols-2 gap-4">
        {staff.map((member, idx) => (
          <StaffCard key={idx} member={member} dominantColor={dominantColor} />
        ))}
      </div>
    </div>
  );
};