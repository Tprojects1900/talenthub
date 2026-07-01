import React from 'react';

export default function RegisteredMembersScroll({ members, onPreviewImage }) {
  if (!members || members.length === 0) return null;

  return (
    <section className="mb-10 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Membres officiellement enregistrés ({members.length} / 22)
      </h3>
      
      <div className="flex gap-6 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {members.map((member, index) => {
          const name = member.nom || member.nomComplet || "Sans nom";
          const image = member.logo || member.imageSrc || '/default-avatar.png';
          const role = member.type || member.role || 'joueur';

          return (
            <div 
              key={member.id || index} 
              className="flex flex-col items-center text-center min-w-[90px] max-w-[110px] group cursor-pointer"
              onClick={() => member.logo && onPreviewImage(image, name)}
            >
              <div className="relative">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-orange-400 transition shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <p className="text-xs font-semibold text-gray-800 mt-2 truncate w-full px-1">{name}</p>
              <p className="text-[10px] font-medium text-gray-400 lowercase italic mt-0.5">({role})</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}