import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TeamsTable = ({ columns, data, searchPlaceholder = "Rechercher...", searchKey = "name" ,title=null}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage générique basé sur la clé de recherche fournie (par défaut 'name')
  const filteredData = data.filter(item => {
    const valueToSearch = item[searchKey];
    return valueToSearch ? valueToSearch.toLowerCase().includes(searchTerm.toLowerCase()) : true;
  });

  return (
    <div className="w-full bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
      
      {/* Barre de Filtres */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {title && (  <h2 className="text-xl font-black uppercase tracking-tighter text-black  flex items-center gap-2">
          <div className="w-2 h-8 bg-[#FFD700]"></div>
        {title}
        </h2>)}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFD700] transition-colors" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 bg-white text-black border-2 border-gray-200 rounded-none focus:border-[#FFD700] outline-none transition-all w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau Structure Table 05 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              {columns.map((col, index) => {
                // Style spécial pour la toute première colonne (# LOGO du design)
                if (index === 0) {
                  return (
                    <th key={col.key || index} className="p-4 bg-[#FFD700] text-black font-black uppercase text-sm text-center">
                      {col.label}
                    </th>
                  );
                }
                // Style pour les autres colonnes
                return (
                  <th key={col.key || index} className="p-4 font-bold uppercase text-xs tracking-widest border-r border-gray-700 text-center last:border-r-0">
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100 hover:bg-yellow-50/50 transition-colors group">
                {columns.map((col, colIndex) => {
                  
                  // Contenu de la cellule : Utilise render() si présent, sinon valeur par défaut
                  const cellContent = col.render ? col.render(item, rowIndex) : item[col.key];

                  // Style de cellule spécial si c'est la première colonne (colonne dorée/logo)
                  if (colIndex === 0) {
                    return (
                      <td key={col.key || colIndex} className="p-4 bg-gray-50 flex justify-center border-b border-gray-100">
                        {cellContent}
                      </td>
                    );
                  }

                  // Style par défaut pour le reste des cellules
                  return (
                    <td key={col.key || colIndex} className="p-4 text-center border-r border-gray-100 last:border-r-0 font-medium text-gray-700">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-gray-400 italic">
            Aucun élément ne correspond à votre recherche...
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsTable;