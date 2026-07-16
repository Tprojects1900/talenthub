import React, { useRef } from 'react';
import AdminLayout from "../../layouts/AdminLayout";
import topfoot from "../../assets/images/topfoot.png";
import useExportPdf from '../../hooks/useExportToPdf';
import { Printer, Loader2 } from "lucide-react";


export default function FicheDuMatch({ numTitulaires = 9, numRemplacants = 7,federation="TopFoot" }) {
  // Génération de tableaux vides pour itérer le nombre de lignes souhaité

  const ficheRef = useRef()
  const { exportPdf, loading: exportPdfLoading } = useExportPdf(ficheRef, 'bg-gray-200/25');
  const rowsTitulaire = Array.from({ length: numTitulaires });
  const rowsRemplacant = Array.from({ length: numRemplacants });

  return (
    <AdminLayout>
      <div className="bg-gray-100 min-h-screen py-8 print:p-0 print:bg-white flex flex-col justify-center items-center">
        <div className='flex justify-end p-1.5'>
          <button
            onClick={() =>
              exportPdf({
                fileName: `Fiche${federation?.replace(/\s+/g, "_")}`,
                mode: "fit",
              })
            }
            disabled={exportPdfLoading}
            className="
    inline-flex items-center justify-center gap-2
    px-5 py-2.5
    rounded-xl
    bg-orange-500
    text-white font-semibold text-sm
    shadow-lg shadow-orange-500/30
    transition-all duration-300
    hover:bg-orange-600 hover:-translate-y-0.5
    active:scale-95
    disabled:bg-orange-300
    disabled:cursor-not-allowed
    disabled:shadow-none
  "
          >
            {exportPdfLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Impression...
              </>
            ) : (
              <>
                <Printer size={18} />
                Imprimer
              </>
            )}
          </button>
        </div>
        {/* Conteneur Format A4 strict : 210mm x 297mm */}
        <div
          ref={ficheRef}
          className="bg-white text-black font-sans shadow-2xl print:shadow-none box-border flex flex-col justify-between p-8 export-pdf"
          style={{
            width: '210mm',
            height: '297mm',
            maxHeight: '297mm',
            maxWidth: '210mm',
          }}
        >
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center border-b-2 border-black pb-3">
            {/* Titre Principal Encadré */}
            <div className="border-[3px] border-black px-6 py-1.5 rounded-sm">
              <h1 className="text-xl font-black tracking-widest text-center uppercase">
                Feuille de Match
              </h1>
            </div>

            {/* Logo "Top Foot" Reconstitué (Sifflet + Ballon Orange) */}
            <div className="flex flex-col items-center">
             <img src={topfoot} 
              className='w-10 h-10'
             />
              <span className="text-[10px] font-black tracking-widest uppercase text-black mt-1">
                Top Foot
              </span>
            </div>
          </div>

          {/* ================= INFOS MATCH ================= */}
          <div className="space-y-1.5 text-xs mt-3">
            <div className="flex items-center">
              <span className="font-bold pr-1">Match :</span>
              <div className="flex-1 border-b border-dotted border-black h-4"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center col-span-1">
                <span className="font-bold pr-1">Lieu :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
              <div className="flex items-center col-span-1">
                <span className="font-bold pr-1">Date : le</span>
                <div className="w-8 border-b border-dotted border-black h-4 text-center"></div>
                <span className="px-1">/</span>
                <div className="w-8 border-b border-dotted border-black h-4 text-center"></div>
                <span className="px-1">/ 20</span>
                <div className="w-10 border-b border-dotted border-black h-4 text-center"></div>
              </div>
              <div className="flex items-center col-span-1">
                <span className="font-bold pr-1">Heure :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="font-bold pr-1">Arbitre :</span>
              <div className="flex-1 border-b border-dotted border-black h-4"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="font-bold pr-1">Arbitres Assistants 1 :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
              <div className="flex items-center">
                <span className="font-bold pr-1">2 :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="font-bold pr-1">Equipes en présence :</span>
              <div className="flex-1 border-b border-dotted border-black h-4"></div>
              <span className="px-2">/</span>
              <div className="flex-1 border-b border-dotted border-black h-4"></div>
            </div>

            <div className="flex items-center">
              <span className="font-bold pr-1">Résultat Final :</span>
              <div className="flex-1 border-b border-dotted border-black h-4"></div>
            </div>
          </div>

          {/* ================= SEPARATOR / TITRE TABLEAU ================= */}
          <div className="text-center mt-3">
            <h2 className="text-xs font-bold uppercase tracking-wider underline">
              Composition des Equipes
            </h2>
            <div className="flex justify-between items-center text-xs mt-1 px-4">
              <div className="flex items-center w-[45%]">
                <span className="font-bold pr-1 text-[11px]">Equipe :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
              <span className="font-bold text-sm">/</span>
              <div className="flex items-center w-[45%]">
                <span className="font-bold pr-1 text-[11px]">Equipe :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>
            </div>
          </div>

          {/* ================= TABLEAU DOUBLE COLONNE (STYLE FEUILLE OFFICIEULE) ================= */}
          <div className="flex-1 flex flex-col justify-between border-2 border-black mt-2 overflow-hidden text-[10px]">

            {/* Header du Tableau */}
            <div className="grid grid-cols-2 border-b-2 border-black bg-gray-200 font-bold text-center">
              {/* Colonne Gauche (Équipe A) */}
              <div className="grid grid-cols-[1fr_60px_40px] border-r-4 border-black divide-x divide-black">
                <div className="py-1">Prénoms-Nom(sur licence)</div>
                {/* <div className="py-1">N° Lic.</div> */}
                <div className="py-1">N° dorsal</div>
              </div>
              {/* Colonne Droite (Équipe B) */}
              <div className="grid grid-cols-[1fr_60px_40px] divide-x divide-black">
                <div className="py-1">Prénoms-Nom(sur licence)</div>
                {/* <div className="py-1">N° Lic.</div> */}
                <div className="py-1">N° dorsal</div>
              </div>
            </div>

            {/* LIGNES TITULAIRES */}
            <div className="flex-1 flex flex-col">
              {rowsTitulaire.map((_, i) => (
                <div
                  key={`titulaire-${i}`}
                  className="grid grid-cols-2 flex-1 border-b border-gray-400 last:border-b-0 min-h-[22px]"
                >
                  {/* Équipe Gauche */}
                  <div className="grid grid-cols-[1fr_60px_40px] border-r-4 border-black divide-x divide-gray-400">
                    <div className="px-1 py-0.5"></div>
                    {/* <div></div> */}
                    <div></div>
                  </div>
                  {/* Équipe Droite */}
                  <div className="grid grid-cols-[1fr_60px_40px] divide-x divide-gray-400">
                    <div className="px-1 py-0.5"></div>
                    {/* <div></div> */}
                    <div></div>
                  </div>
                </div>
              ))}
            </div>

            {/* BARRE DE SÉPARATION NOIRE - REMPLACANTS */}
            <div className="grid grid-cols-2 bg-black text-white text-center font-bold text-[9px] tracking-widest border-y-2 border-black">
              <div className="py-0.5 border-r-4 border-white uppercase">Remplaçants</div>
              <div className="py-0.5 uppercase">Remplaçants</div>
            </div>

            {/* LIGNES REMPLACANTS */}
            <div className="flex flex-col" style={{ flexGrow: 0.2 }}>
              {rowsRemplacant.map((_, i) => (
                <div
                  key={`remplacant-${i}`}
                  className="grid grid-cols-2 flex-1 border-b border-gray-400 last:border-b-0 min-h-[22px]"
                >
                  {/* Équipe Gauche */}
                  <div className="grid grid-cols-[1fr_60px_40px] border-r-4 border-black divide-x divide-gray-400">
                    <div className="px-1 py-0.5"></div>
                    {/* <div></div> */}
                    <div></div>
                  </div>
                  {/* Équipe Droite */}
                  <div className="grid grid-cols-[1fr_60px_40px] divide-x divide-gray-400">
                    <div className="px-1 py-0.5"></div>
                    {/* <div></div> */}
                    <div></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ================= FOOTER / SIGNATURES ================= */}
          <div className="grid grid-cols-2 gap-x-8 text-[11px] mt-4 pt-2 border-t border-gray-200">
            {/* Blocs Signatures Gauche */}
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-bold pr-1">Accompagnateur :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>

              <div className="space-y-1">
                <span className="font-bold">Prénoms et Nom du Capitaine :</span>
                <div className="border-b border-dotted border-black h-4"></div>
              </div>

              <div>
                <span className="font-bold underline block mb-6">Signature</span>
                <div className="text-center font-bold text-xs uppercase mt-2">
                  Nom du Délégué du Match
                  <div className="border-b border-dotted border-black h-5 w-4/5 mx-auto mt-1"></div>
                </div>
              </div>
            </div>

            {/* Blocs Signatures Droite */}
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-bold pr-1">Accompagnateur :</span>
                <div className="flex-1 border-b border-dotted border-black h-4"></div>
              </div>

              <div className="space-y-1">
                <span className="font-bold">Prénoms et Nom du Capitaine :</span>
                <div className="border-b border-dotted border-black h-4"></div>
              </div>

              <div>
                <span className="font-bold underline block mb-6">Signature</span>
                <div className="text-center font-bold text-xs uppercase mt-2">
                  L'Arbitre
                  <div className="border-b border-dotted border-black h-5 w-4/5 mx-auto mt-1"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}