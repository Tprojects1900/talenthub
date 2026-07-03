import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDominantColor, generateLicenseId } from '../../utils/colorExtractor';
import useImageExport from '../../hooks/useImageExport';
import { useTeamDetails } from '../../hooks/useCalls';
import AdminLayout from '../../layouts/AdminLayout';
import TopFootHeaderBadge from '../../components/TopFootHeaderBadge';
import topfoot from '../../assets/images/topfoot.png';

/* ============================================================
   TOKENS — dérivés de la couleur dominante du logo
   ============================================================ */
const PAPER = '#faf6ec';
const INK = '#14171f';
const GOLD = '#a9781f';

const hexToRgba = (hex, opacity) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex || '')) {
    return `rgba(20, 23, 31, ${opacity})`;
  }
  let c = hex.substring(1).split('');
  if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  c = '0x' + c.join('');
  return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${opacity})`;
};

const GRID_COLS = 4;

/* ============================================================
   SCEAU GUILLOCHÉ — élément signature du design
   ============================================================ */
const SealMark = ({ color, size = 56, opacity = 0.9 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {[26, 20, 14, 8].map((r) => (
      <circle
        key={r}
        cx="32"
        cy="32"
        r={r}
        stroke={color}
        strokeWidth="0.6"
        opacity={opacity * (r / 26)}
      />
    ))}
    <circle cx="32" cy="32" r="2" fill={color} opacity={opacity} />
    <text
      x="32"
      y="34"
      textAnchor="middle"
      fontSize="5.5"
      fontFamily="'IBM Plex Mono', monospace"
      fill={color}
      opacity={opacity}
      letterSpacing="0.5"
    >
      OFF
    </text>
  </svg>
);

/* ============================================================
   CARTE JOUEUR
   ============================================================ */
const PlayerCard = ({ player, badgeIndex, teamLogo, teamName, accent }) => {
  const licenseId = generateLicenseId(teamName, badgeIndex, player?.nom);

  return (
    <div
      className="h-full min-h-0 rounded-md flex flex-col overflow-hidden border relative"
      style={{ backgroundColor: '#ffffff', borderColor: hexToRgba(INK, 0.12) }}
    >
      <div
        className="flex items-center justify-between px-2 py-[3px] shrink-0"
        style={{ backgroundColor: accent }}
      >
        <span
          className="text-[6.5px] font-bold uppercase tracking-[0.15em]"
          style={{ color: PAPER, fontFamily: "'Inter', sans-serif" }}
        >
          JOUEUR
        </span>
        <span
          className="text-[7.5px] font-bold"
          style={{ color: PAPER, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          #{String(badgeIndex).padStart(2, '0')}
        </span>
      </div>

      <div className="flex items-center gap-1.5 px-1.5 py-1 flex-1 min-h-0">
        <div className="relative shrink-0 h-full aspect-[4/5]">
          <img
            src={player?.logo}
            alt={player?.nom}
            className="w-full h-full object-cover object-top rounded border"
            style={{ borderColor: hexToRgba(INK, 0.12), backgroundColor: '#f2f0ea' }}
          />
          <div
            className="absolute -bottom-1 -right-1 bg-white p-[2px] rounded shadow-sm border"
            style={{ borderColor: hexToRgba(INK, 0.12) }}
          >
            <img src={teamLogo} alt="" className="w-2.5 h-2.5 object-contain" />
          </div>
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p
            className="text-[9px] font-bold uppercase leading-tight line-clamp-2"
            style={{ color: INK, fontFamily: "'Fraunces', serif" }}
          >
            {player?.nom}
          </p>
          <span
            className="text-[6px] uppercase tracking-wide mt-0.5"
            style={{ color: hexToRgba(INK, 0.5), fontFamily: "'Inter', sans-serif" }}
          >
            {player?.type || 'Joueur'}
          </span>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-1.5 py-[3px] border-t shrink-0"
        style={{ borderColor: hexToRgba(INK, 0.08) }}
      >
        <span
          className="text-[5.5px] uppercase tracking-wider"
          style={{ color: hexToRgba(INK, 0.4), fontFamily: "'Inter', sans-serif" }}
        >
          ID licence
        </span>
        <span
          className="text-[7px] font-bold"
          style={{ color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {licenseId}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   BANDEAU — badge TopFoot (staff + QR) au-dessus,
   identité du club en dessous
   ============================================================ */
const PageHeader = ({ topfoot, staffMembers, teamLogo, teamName, quartier, accent }) => (
  <div className="mb-3 shrink-0 flex flex-col gap-2">
    <TopFootHeaderBadge
      topfoot={topfoot}
      staffMembers={staffMembers}
      teamName={teamName}
      accent={accent}
    />

    <div className="flex items-center justify-between pb-2 border-b-2" style={{ borderColor: accent }}>
      <div className="flex items-center gap-2">
        <img src={teamLogo} alt="Team" className="h-10 w-10 object-contain" />
        <div className="text-left">
          <h1
            className="text-sm font-bold uppercase leading-none tracking-tight"
            style={{ color: INK, fontFamily: "'Fraunces', serif" }}
          >
            {teamName}
          </h1>
          <p
            className="text-[7.5px] uppercase tracking-widest mt-0.5"
            style={{ color: hexToRgba(INK, 0.5), fontFamily: "'Inter', sans-serif" }}
          >
            {quartier}
          </p>
        </div>
      </div>
      <span
        className="text-[8px] font-bold uppercase tracking-[0.3em] html-image"
        style={{ color: GOLD, fontFamily: "'Inter', sans-serif" }}
      >
        Licence collective
      </span>
      <SealMark color={accent} />
    </div>
  </div>
);

/* ============================================================
   PIED DE PAGE
   ============================================================ */
const ValidationStrip = ({ teamName, accent }) => {
  const serial = `TF26-${teamName.replace(/\s+/g, '').slice(0, 6).toUpperCase()}`;
  return (
    <footer
      className="mt-3 pt-2 border-t flex items-center justify-between shrink-0"
      style={{ borderColor: hexToRgba(INK, 0.15) }}
    >
      <div className="flex flex-col">
        <p
          className="text-[8px] font-bold uppercase tracking-widest"
          style={{ color: INK, fontFamily: "'Inter', sans-serif" }}
        >
          Document délivré par l'organisation — Saison 2026
        </p>
        <p
          className="text-[7px] uppercase tracking-wide"
          style={{ color: hexToRgba(INK, 0.45), fontFamily: "'Inter', sans-serif" }}
        >
          Licence collective certifiée · TOPFOOT
        </p>
      </div>
      <span
        className="text-[8px] font-bold px-2 py-1 rounded"
        style={{
          color: PAPER,
          backgroundColor: hexToRgba(accent, 1),
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        N° SÉRIE {serial}
      </span>
    </footer>
  );
};

/* ============================================================
   PAGE PRINCIPALE — staff dans le badge, joueurs dans la grille
   ============================================================ */
export const LicenceCollectivePage = () => {
  const { teamId } = useParams();
  const { teamDetails } = useTeamDetails(teamId);
  const [dominantColor, setDominantColor] = useState('#1e3a8a');
  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef, 'bg-gray-200/25');

  const teamName = teamDetails?.nom ?? '';
  const teamLogo = teamDetails?.logo ?? null;
  const quartier = teamDetails?.quartier ?? '';

  const players = useMemo(
    () => (teamDetails?.members ?? []).filter((m) => m.type?.toLowerCase() === 'joueur'),
    [teamDetails]
  );
  // Toujours 2 emplacements, même si un staff (ou les deux) manque —
  // le badge affiche "Place réservée" pour les emplacements vides.
  const staffMembers = useMemo(
    () => (teamDetails?.members ?? []).filter((m) => m.type?.toLowerCase() === 'staff').slice(0, 2),
    [teamDetails]
  );

  useEffect(() => {
    if (!teamLogo) return;
    let cancelled = false;
    getDominantColor(teamLogo).then((color) => {
      if (!cancelled) setDominantColor(color || '#1e3a8a');
    });
    return () => {
      cancelled = true;
    };
  }, [teamLogo]);

  // Grille élastique sur les seuls joueurs (staff désormais dans le badge) :
  // 20 joueurs -> 5 lignes de 4, mais reste correct si l'effectif change.
  const rowCount = Math.max(1, Math.ceil(players.length / GRID_COLS));

  return (
    <AdminLayout pageTitle={`Licence collective : ${teamName}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-900/25 py-8 items-center font-sans antialiased">
        <div className="w-full max-w-[800px] px-4 mb-4 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Zone d'administration
            </h4>
            <p className="text-xs text-slate-500">
              {players.length} joueurs · staff dans le bandeau · une seule page A4
            </p>
          </div>
          <button
            onClick={() =>
              exportImage({
                fileName: `Licence_${teamName?.replace(/\s+/g, '_')}`,
                pixelRatio: 4,
              })
            }
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl ${
              loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {loading ? 'Traitement en cours...' : 'Générer & Télécharger'}
          </button>
        </div>

        <div
          ref={posterRef}
          className="relative w-[210mm] h-[297mm] p-[10mm] shadow-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: PAPER }}
        >
          <div
            className="absolute inset-[4mm] border pointer-events-none"
            style={{ borderColor: hexToRgba(INK, 0.2) }}
          />
          <div
            className="absolute inset-[4.8mm] border pointer-events-none"
            style={{ borderColor: hexToRgba(dominantColor, 0.35) }}
          />

          <div className="absolute bottom-[14mm] right-[10mm] opacity-[0.06] pointer-events-none">
            <SealMark color={dominantColor} size={140} opacity={1} />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <PageHeader
              topfoot={topfoot}
              staffMembers={staffMembers}
              teamLogo={teamLogo}
              teamName={teamName}
              quartier={quartier}
              accent={dominantColor}
            />

            <div
              className="flex-1 min-h-0"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${rowCount}, 1fr)`,
                gap: '2mm',
              }}
            >
              {players.map((p, i) => (
                <PlayerCard
                  key={`player-${i}`}
                  player={p}
                  badgeIndex={i + 1}
                  teamLogo={teamLogo}
                  teamName={teamName}
                  accent={dominantColor}
                />
              ))}
            </div>

            <ValidationStrip teamName={teamName} accent={dominantColor} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};