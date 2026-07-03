import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const INK = '#14171f';
const PAPER = '#faf6ec';

const hexToRgba = (hex, opacity) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex || '')) {
    return `rgba(20, 23, 31, ${opacity})`;
  }
  let c = hex.substring(1).split('');
  if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  c = '0x' + c.join('');
  return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${opacity})`;
};

/* Un emplacement staff : occupé -> photo + nom.
   Vide -> la place reste visible et marquée "réservée", jamais retirée. */
const StaffSlot = ({ staff, badgeIndex, accent }) => {
  const isEmpty = !staff;

  return (
    <div
      className="h-full w-[27%] shrink-0 rounded-md flex flex-col overflow-hidden border relative"
      style={{
        backgroundColor: isEmpty ? 'transparent' : '#ffffff',
        borderColor: isEmpty ? 'rgba(255,255,255,0.25)' : hexToRgba(INK, 0.12),
        borderStyle: isEmpty ? 'dashed' : 'solid',
      }}
    >
      <div
        className="flex items-center justify-between px-1.5 py-[2px] shrink-0"
        style={{ backgroundColor: isEmpty ? 'rgba(255,255,255,0.08)' : accent }}
      >
        <span
          className="text-[6px] font-bold uppercase tracking-[0.12em]"
          style={{ color: isEmpty ? 'rgba(255,255,255,0.6)' : PAPER, fontFamily: "'Inter', sans-serif" }}
        >
          STAFF
        </span>
        <span
          className="text-[6.5px] font-bold"
          style={{ color: isEmpty ? 'rgba(255,255,255,0.6)' : PAPER, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          N°{badgeIndex}
        </span>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center px-1">
          <span
            className="text-[6px] uppercase tracking-wide text-center leading-tight"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}
          >
            Place réservée
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1 px-1 py-1 flex-1 min-h-0">
          <img
            src={staff?.logo}
            alt={staff?.nom}
            className="h-full aspect-[4/5] object-cover object-top rounded border shrink-0"
            style={{ borderColor: hexToRgba(INK, 0.12), backgroundColor: '#f2f0ea' }}
          />
          <div className="min-w-0">
            <p
              className="text-[7px] font-bold uppercase leading-tight line-clamp-2"
              style={{ color: INK, fontFamily: "'Fraunces', serif" }}
            >
              {staff?.nom}
            </p>
            <span
              className="text-[5.5px] uppercase tracking-wide"
              style={{ color: hexToRgba(INK, 0.55), fontFamily: "'Inter', sans-serif" }}
            >
              {staff?.type || 'Staff'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TopFootHeaderBadge({ topfoot, staffMembers = [], teamName, accent = '#1e3a8a' }) {
  const staff1 = staffMembers[0] || null;
  const staff2 = staffMembers[1] || null;

  // Les infos encodées dans le QR — inclut le club pour une vérification propre au document
  const qrData = JSON.stringify({
    nom: 'TOPFOOT',
    edition: 'Edition 5',
    club: teamName || undefined,
  });

  return (
    <div className="relative w-full h-[32mm] bg-slate-900 rounded-xl border border-slate-800 p-2 flex items-stretch gap-2 overflow-visible">
      <StaffSlot staff={staff1} badgeIndex={1} accent={accent} />

      {/* Bloc central TopFoot — logo + édition, toujours au milieu */}
      <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
        <img src={topfoot} alt="TopFoot" className="h-11 w-11 object-contain mb-1 drop-shadow nom-equipe" />
        <h3 className="font-black text-white text-[11px] uppercase tracking-widest html-image">TOP FOOT</h3>
        <span className="text-[7px] font-black text-amber-500 tracking-widest uppercase mt-0.5 html-image">
          SAISON 2026
        </span>
      </div>

      <StaffSlot staff={staff2} badgeIndex={2} accent={accent} />

      {/* QR Code — obligatoire, coin haut-droit, ne recouvre que la marge
          extérieure du badge pour ne jamais manger la place du staff n°2 */}
      <div className="absolute -top-4 -right-8 flex flex-col items-center bg-white p-1.5 pt-2 pb-1 shadow-md transform rotate-12 origin-top-right z-20 rounded-sm">
        <div className="p-0.5 bg-white rounded-sm border border-gray-100 flex items-center justify-center">
          <QRCodeSVG
            value={qrData}
            size={34}
            bgColor={'#FFFFFF'}
            fgColor={'#0f172a'}
            level={'M'}
            imageSettings={{
              src: topfoot,
              height: 8,
              width: 8,
              excavate: true,
            }}
          />
        </div>
        {/* <span className="text-[6px] font-black uppercase tracking-wider text-slate-800 mt-0.5 whitespace-nowrap nom-equipe">
          Edition 5
        </span> */}
      </div>
    </div>
  );
}