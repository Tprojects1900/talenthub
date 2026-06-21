import React, { useState, useRef, useEffect } from 'react';

export default function UserSelect({ users, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trouver l'utilisateur sélectionné
  const selectedUser = users.find(u => u.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded-lg text-white font-medium focus:border-[#FFD700] border-t-zinc-800 outline-none flex items-center justify-between text-left transition-colors"
      >
        {selectedUser ? (
          <div className="flex items-center gap-2 truncate">
            {selectedUser.logo && (
              <img 
                src={selectedUser.logo} 
                alt="" 
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-zinc-700" 
              />
            )}
            <span className="truncate">
              {selectedUser.nom} {selectedUser.poste ? `(${selectedUser.poste})` : ''}
            </span>
          </div>
        ) : (
          <span className="text-zinc-400">-- Choisir dans le Club --</span>
        )}
        
        <svg className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-h-60 overflow-y-auto divide-y divide-zinc-800/50">
          {/* Option vide */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            -- Choisir dans le Club --
          </button>

          {/* Options utilisateurs */}
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                onChange(u.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-zinc-800/80 transition-colors text-white ${
                value === u.id ? 'bg-zinc-800 text-[#FFD700]' : ''
              }`}
            >
              {u.logo && (
                <img 
                  src={u.logo} 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-zinc-700" 
                />
              )}
              <span className="font-medium truncate">
                {u.nom} <span className="text-zinc-400 text-[11px] ml-0.5">{u.poste ? `(${u.poste})` : ''}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}