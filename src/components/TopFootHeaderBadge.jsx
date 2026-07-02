import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TopFootHeaderBadge({ topfoot }) {
  // Les informations à encoder dans le QR Code
  const qrData = JSON.stringify({
    nom: "TOPFOOT",
    edition: "Edition 5"
  });

  return (
    <div className="relative overflow-hidden w-[55%] h-32 bg-slate-900 p-4 rounded-xl border border-slate-800">
      
      {/* Conteneur principal gauche (Votre bloc existant) */}
      <div className="w-full flex flex-col items-center justify-center text-center z-999">
        <img src={topfoot} alt="TopFoot" className="h-14 w-14 object-contain mb-1 drop-shadow" />
        <h3 className="font-black text-white text-xs uppercase tracking-widest">TOP FOOT</h3>
        <span className="text-[8px] font-black text-amber-500 tracking-widest uppercase mt-0.5 nom-equipe">SAISON 2026</span>
      </div>

      {/* Badge QR Code oblique dans le coin supérieur droit */}
      <div className="absolute -top-1 -right-4 flex flex-col items-center bg-whitee text-black p-2 pt-4 pb-1 px-5 shadow-md transform rotate-12 origin-top-right border-0 ">
        
        {/* Composant QR Code officiel */}
        <div className="p-0.5 bg-white rounded-sm border border-gray-100 flex items-center justify-center">
          <QRCodeSVG
            value={qrData}
            size={40} // Taille ultra-compacte pour respecter la carte
            bgColor={"#FFFFFF"}
            fgColor={"#0f172a"} // Slate-900 pour s'accorder au thème
            level={"M"} // Niveau de tolérance aux pannes (Medium) pour permettre le logo au centre
            imageSettings={{
              src: topfoot,
              x: undefined,
              y: undefined,
              height: 10,
              width: 10,
              excavate: true, // Découpe proprement les pixels du QR code derrière le logo
            }}
          />
        </div>

        {/* Texte d'édition sous le code */}
        <span className="text-[7px] font-black uppercase tracking-wider text-slate-800 mt-1 block whitespace-nowrap">
          Edition 5
        </span>
      </div>

    </div>
  );
}