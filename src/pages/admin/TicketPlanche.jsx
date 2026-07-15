import React ,{useRef}from 'react';
import TopFootLogo from "../../assets/images/topfoot.png"
import AdminLayout from "../../layouts/AdminLayout"
import useExportPdf from '../../hooks/useExportToPdf';
export default function TopFootTickets() {
  // Génère la liste des 50 tickets uniques pour la planche A4
  const generateTickets = () => {
    const tickets = [];
    const date = new Date(2026, 6, 14, 11, 16, 0); // Date de base
  

    for (let i = 0; i < 50; i++) {
      // Décalage artificiel de secondes pour garantir l'unicité chronologique du code
      const ticketTime = new Date(date.getTime() + i * 1000);
      const YY = String(ticketTime.getFullYear()).slice(-2);
      const MM = String(ticketTime.getMonth() + 1).padStart(2, '0');
      const DD = String(ticketTime.getDate()).padStart(2, '0');
      const hh = String(ticketTime.getHours()).padStart(2, '0');
      const mm = String(ticketTime.getMinutes()).padStart(2, '0');
      const ss = String(ticketTime.getSeconds()).padStart(2, '0');
      
      // Suffixe de sécurité aléatoire contre la fraude
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; 
      const uniqueSuffix = chars[Math.floor(Math.random() * chars.length)] + Math.floor(10 + Math.random() * 90);
      const uniqueCode = `TF-${YY}${MM}${DD}-${hh}${mm}${ss}-${uniqueSuffix}`;

      tickets.push({
        id: i + 1,
        code: uniqueCode,
        title: "TOP FOOT",
        edition: "5e ÉDITION",
        price: "100 FCFA",
        gate: "TERRAIN",
      });
    }
    return tickets;
  };

  const tickets = generateTickets();
   const ticketRef =useRef();
   const {exportPdf,loading}=useExportPdf(ticketRef,"#fff")
  const now = new Date();

const federation = `TOPFOOT_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  return (
    <AdminLayout>
      <div className="bg-slate-100 min-h-screen p-6 flex flex-col items-center">
        {/* Panneau de Contrôle */}
        <div className="mb-6 text-center max-w-xl print:hidden">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Planche d'Impression Officielle — 50 Tickets</h1>
          <p className="text-xs text-slate-600 mt-1">
            Grille optimisée 5x10 au format A4. Lignes de coupe grises intégrées pour faciliter le découpage au massicot.
          </p>
          <button 
             onClick={() =>
              exportPdf({
                fileName: `Ticket_${federation?.replace(/\s+/g, '_')}`,
                mode:'fit',
              })
            }
            disabled={loading}
            className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-lg uppercase font-bold rounded shadow-md transition-colors curspor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Ticket en cours de téléchargement" :"Imprimer la planche"}
          </button>
        </div>

        {/* Conteneur Feuille A4 */}
        <div 
        ref={ticketRef}
          className="bg-white shadow-2xl overflow-hidden border border-slate-300 print:shadow-none print:border-none"
          style={{
            width: '210mm',
            height: '297mm',
            padding: '6mm 5mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Grille de 5 Colonnes et 10 Rangées */}
          <div className="grid grid-cols-5 grid-rows-10 h-full w-full gap-[1.2mm]">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                /* border-[0.8px] border-slate-400 : C'est la ligne de découpe officielle grise visible à l'impression */
                className="relative border-[0.8px] border-solid border-slate-400 bg-white rounded-sm flex flex-col justify-between overflow-hidden select-none"
                style={{
                  height: '27.2mm',
                  boxSizing: 'border-box',
                }}
              >
                {/* Cadre de design intérieur (Pointillés orange décoratifs) */}
                <div className="absolute inset-[1px] border border-dashed border-orange-400/70 rounded-sm bg-orange-50/15 pointer-events-none z-0" />

                {/* Logo TOP FOOT en arrière-plan (Filigrane) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.11] pointer-events-none z-0">
                  <img 
                    src={TopFootLogo} 
                    alt="Watermark" 
                    className="w-4/5 h-4/5 object-contain"
                  />
                </div>

                {/* Contenu au premier plan */}
                <div className="relative z-10 flex flex-col justify-between h-full text-center p-[5px]">
                  
                  {/* En-tête */}
                  <div className="flex justify-between items-center border-b border-orange-200 pb-0.5">
                    <span className="text-[7.5px] font-black text-orange-600 tracking-wider">TOP FOOT</span>
                    <span className="text-[5px] font-bold bg-orange-600 text-white px-1 py-0.2 rounded-sm scale-95 origin-right">
                      {ticket.edition}
                    </span>
                  </div>

                  {/* Corps */}
                  <div className="my-0.5">
                    <div className="text-[9px] font-extrabold text-slate-900 tracking-tight">ACCÈS UNIQUE</div>
                    <div className="text-[5.5px] text-slate-500 font-bold leading-none">Ticket d'Entrée Officiel</div>
                  </div>

                  {/* Sécurité et Pied de ticket */}
                  <div className="mt-auto">
                    {/* Code anti-fraude sécurisé */}
                    <div className="text-[5px] font-mono text-slate-800 bg-white/95 py-0.5 px-1 rounded border border-slate-200 inline-block w-full font-bold tracking-tight">
                      {ticket.code}
                    </div>
                    
                    {/* Tribune & Prix */}
                    <div className="flex justify-between items-center mt-0.5 text-[6.5px] font-bold text-orange-600">
                      <span className="text-[6px] font-bold tracking-wide">{ticket.gate}</span>
                      <span className="text-[8px] text-slate-900 font-black">{ticket.price}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}