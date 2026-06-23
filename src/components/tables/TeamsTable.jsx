import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Loader from '../Loader';

const TeamsTable = ({ 
  columns, 
  data = [], 
  searchPlaceholder = "RECHERCHER...", 
  searchKey = "name", 
  title = null,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    const valueToSearch = item[searchKey];
    return valueToSearch ? String(valueToSearch).toLowerCase().includes(searchTerm.toLowerCase()) : true;
  });

  return (
    <div className="w-full bg-black border border-zinc-900 rounded-none overflow-hidden relative selection:bg-white selection:text-black">
      
      {/* En-tête / Filtre Puriste */}
      <div className="p-5 border-b border-zinc-900 bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && (  
          <div>
            <h2 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
              <span className="inline-block w-1.5 h-3 bg-white"></span>
              {title}
            </h2>
          </div>
        )}
        
        {/* Input de recherche Brutaliste / Minimaliste */}
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" size={14} />
          <input
            type="text"
            disabled={loading}
            placeholder={loading ? "CHARGEMENT..." : searchPlaceholder.toUpperCase()}
            className="w-full pl-9 pr-4 py-1.5 bg-black text-zinc-200 border border-zinc-800 rounded-none text-xs font-mono tracking-wider placeholder-zinc-700 focus:outline-none focus:border-zinc-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Structure de Données Matrice */}
      <div className="overflow-x-auto relative min-h-[180px] scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-black">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950">
              {columns.map((col, index) => {
                const thKey = `th-${index}-${col.key || ''}`;
                
                if (index === 0) {
                  return (
                    <th key={thKey} className="p-3.5 bg-zinc-900/30 text-white font-mono font-black text-[10px] text-center tracking-widest w-14 border-r border-zinc-900">
                      {col.label}
                    </th>
                  );
                }
                return (
                  <th key={thKey} className="p-3.5 text-zinc-500 font-mono font-bold text-[10px] text-center tracking-widest border-r border-zinc-900/50 last:border-r-0">
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          
          {!loading && filteredData.length > 0 && (
            <tbody className="divide-y divide-zinc-900/60">
              {filteredData.map((item, rowIndex) => {
                const rowKey = item.id || item._id || `row-${rowIndex}`;

                return (
                  <tr 
                    key={rowKey} 
                    className="hover:bg-zinc-950/80 transition-colors group border-b border-zinc-900/40 last:border-b-0"
                  >
                    {columns.map((col, colIndex) => {
                      const cellContent = col.render ? col.render(item, rowIndex) : item[col.key];
                      const cellKey = `cell-${rowKey}-${colIndex}`;

                      // Index / Rang
                      if (colIndex === 0) {
                        return (
                          <td 
                            key={cellKey} 
                            className="p-3.5 bg-zinc-950/40 text-center font-mono font-bold text-xs text-zinc-400 group-hover:text-white border-r border-zinc-900 transition-colors"
                          >
                            {cellContent}
                          </td>
                        );
                      }

                      // Cellules Standards
                      return (
                        <td 
                          key={cellKey} 
                          className="p-3.5 text-center font-mono text-xs text-zinc-300 group-hover:text-white border-r border-zinc-900/40 last:border-r-0 transition-colors"
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        
        {/* Loader Puriste */}
        {loading && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2">
           <Loader/>
          </div>
        )}

        {/* Aucun Résultat */}
        {!loading && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-700">
              [ NO_RESULTS_FOUND ]
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsTable;