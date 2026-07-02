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

/* Combien de cartes tiennent sur une page A4, selon qu'on affiche
   le grand bandeau (1ère page) ou le bandeau réduit (pages suivantes).
   4 colonnes fixes ; on ajuste seulement le nombre de lignes. */
const GRID_COLS = 4;
const ROWS_FIRST_PAGE = 4; // sous le grand bandeau
const ROWS_OTHER_PAGES = 5; // sous le bandeau réduit
const CAPACITY_FIRST = GRID_COLS * ROWS_FIRST_PAGE; // 16
const CAPACITY_OTHER = GRID_COLS * ROWS_OTHER_PAGES; // 20

/* ============================================================
   SCEAU GUILLOCHÉ — élément signature du design
   ============================================================ */
const SealMark = ({ color, size = 64, opacity = 0.9 }) => (
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
   CARTE MEMBRE — gabarit unique joueur / staff
   ============================================================ */
const MemberCard = ({ member, role, badgeIndex, teamLogo, teamName, accent }) => {
  const licenseId = generateLicenseId(teamName, badgeIndex, member?.nom);
  const isPlayer = role === 'JOUEUR';

  return (
    <div
      className="h-[42mm] rounded-md flex flex-col overflow-hidden border relative"
      style={{ backgroundColor: '#ffffff', borderColor: hexToRgba(INK, 0.12) }}
    >
      {/* Bandeau de rôle */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ backgroundColor: accent }}
      >
        <span
          className="text-[7px] font-bold uppercase tracking-[0.15em]"
          style={{ color: PAPER, fontFamily: "'Inter', sans-serif" }}
        >
          {role}
        </span>
        <span
          className="text-[8px] font-bold"
          style={{ color: PAPER, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {isPlayer ? `#${String(badgeIndex).padStart(2, '0')}` : `N°${badgeIndex}`}
        </span>
      </div>

      {/* Corps : photo + identité */}
      <div className="flex items-center gap-2 px-2 py-1.5 flex-1">
        <div className="relative shrink-0">
          <img
            src={member?.logo}
            alt={member?.nom}
            className="w-14 h-16 object-cover object-top rounded border"
            style={{ borderColor: hexToRgba(INK, 0.12), backgroundColor: '#f2f0ea' }}
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-[2px] rounded shadow-sm border"
               style={{ borderColor: hexToRgba(INK, 0.12) }}>
            <img src={teamLogo} alt="" className="w-3 h-3 object-contain" />
          </div>
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p
            className="text-[9.5px] font-bold uppercase leading-tight line-clamp-2"
            style={{ color: INK, fontFamily: "'Fraunces', serif" }}
          >
            {member?.nom}
          </p>
          <span
            className="text-[6.5px] uppercase tracking-wide mt-0.5"
            style={{ color: hexToRgba(INK, 0.5), fontFamily: "'Inter', sans-serif" }}
          >
            {member?.type || role}
          </span>
        </div>
      </div>

      {/* Pied : identifiant */}
      <div
        className="flex items-center justify-between px-2 py-1 border-t"
        style={{ borderColor: hexToRgba(INK, 0.08) }}
      >
        <span
          className="text-[6px] uppercase tracking-wider"
          style={{ color: hexToRgba(INK, 0.4), fontFamily: "'Inter', sans-serif" }}
        >
          ID licence
        </span>
        <span
          className="text-[7.5px] font-bold"
          style={{ color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {licenseId}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   BANDEAU — grand (page 1) ou réduit (pages suivantes)
   ============================================================ */
const PageHeader = ({ teamLogo, teamName, quartier, accent, compact, pageNumber, pageCount }) => {
  if (compact) {
    return (
      <div
        className="flex items-center justify-between pb-2 mb-2.5 border-b"
        style={{ borderColor: hexToRgba(INK, 0.15) }}
      >
        <div className="flex items-center gap-2">
          <img src={teamLogo} alt="" className="h-8 w-8 object-contain" />
          <span
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: INK, fontFamily: "'Fraunces', serif" }}
          >
            {teamName}
          </span>
        </div>
        <span
          className="text-[8px] uppercase tracking-widest"
          style={{ color: hexToRgba(INK, 0.5), fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Page {pageNumber} / {pageCount}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between pb-3 border-b-2" style={{ borderColor: accent }}>
        <TopFootHeaderBadge topfoot={topfoot} />

        <div className="flex flex-col items-center text-center">
          <span
            className="text-[8px] font-bold uppercase tracking-[0.35em] mb-1"
            style={{ color: GOLD, fontFamily: "'Inter', sans-serif" }}
          >
            Licence collective
          </span>
          <div className="flex items-center gap-2">
            <img src={teamLogo} alt="Team" className="h-11 w-11 object-contain" />
            <div className="text-left">
              <h1
                className="text-base font-bold uppercase leading-none tracking-tight"
                style={{ color: INK, fontFamily: "'Fraunces', serif" }}
              >
                {teamName}
              </h1>
              <p
                className="text-[8px] uppercase tracking-widest mt-0.5"
                style={{ color: hexToRgba(INK, 0.5), fontFamily: "'Inter', sans-serif" }}
              >
                {quartier}
              </p>
            </div>
          </div>
        </div>

        <SealMark color={accent} />
      </div>
    </div>
  );
};

/* ============================================================
   PIED DE PAGE — bande de validation
   ============================================================ */
const ValidationStrip = ({ teamName, pageNumber, pageCount, accent }) => {
  const serial = `TF26-${teamName.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-${String(pageNumber).padStart(2, '0')}`;
  return (
    <footer
      className="mt-3 pt-2 border-t flex items-center justify-between"
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
   UNE PAGE A4 — gère son propre ref + son propre export
   (chaque page a besoin de son propre hook, donc c'est un
   composant à part entière plutôt qu'une boucle)
   ============================================================ */
const LicensePage = ({
  members,
  pageNumber,
  pageCount,
  teamLogo,
  teamName,
  quartier,
  dominantColor,
}) => {
  const pageRef = useRef();
  const { exportImage, loading } = useImageExport(pageRef, 'bg-gray-200/25');
  const compact = pageNumber > 1;

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-full max-w-[800px] px-4 mb-2 flex justify-end">
        <button
          onClick={() =>
            exportImage({
              fileName: `Licence_${teamName?.replace(/\s+/g, '_')}_p${pageNumber}`,
              pixelRatio: 4,
            })
          }
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow ${
            loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
          }`}
        >
          {loading ? 'Traitement…' : `Télécharger page ${pageNumber}`}
        </button>
      </div>

      <div
        ref={pageRef}
        className="relative w-[210mm] h-[297mm] p-[10mm] shadow-2xl overflow-hidden"
        style={{ backgroundColor: PAPER }}
      >
        {/* Cadre "diplôme" */}
        <div
          className="absolute inset-[4mm] border pointer-events-none"
          style={{ borderColor: hexToRgba(INK, 0.2) }}
        />
        <div
          className="absolute inset-[4.8mm] border pointer-events-none"
          style={{ borderColor: hexToRgba(dominantColor, 0.35) }}
        />

        {/* Filigrane sceau, discret */}
        <div className="absolute bottom-[14mm] right-[10mm] opacity-[0.06] pointer-events-none">
          <SealMark color={dominantColor} size={140} opacity={1} />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <PageHeader
            teamLogo={teamLogo}
            teamName={teamName}
            quartier={quartier}
            accent={dominantColor}
            compact={compact}
            pageNumber={pageNumber}
            pageCount={pageCount}
          />

          <div className="grid grid-cols-4 gap-2.5 flex-1 content-start">
            {members.map((m) => (
              <MemberCard
                key={`${m.role}-${m.badgeIndex}`}
                member={m}
                role={m.role}
                badgeIndex={m.badgeIndex}
                teamLogo={teamLogo}
                teamName={teamName}
                accent={dominantColor}
              />
            ))}
          </div>

          <ValidationStrip
            teamName={teamName}
            pageNumber={pageNumber}
            pageCount={pageCount}
            accent={dominantColor}
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PAGE PRINCIPALE
   ============================================================ */
export const LicenceCollectivePage = () => {
  const { teamId } = useParams();
  const { teamDetails } = useTeamDetails(teamId);
  const [dominantColor, setDominantColor] = useState('#1e3a8a');

  const teamName = teamDetails?.nom ?? '';
  const teamLogo = teamDetails?.logo ?? null;
  const quartier = teamDetails?.quartier ?? '';

  const players = useMemo(
    () => (teamDetails?.members ?? []).filter((m) => m.type?.toLowerCase() === 'joueur'),
    [teamDetails]
  );
  const staffMembers = useMemo(
    () => (teamDetails?.members ?? []).filter((m) => m.type?.toLowerCase() === 'staff'),
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

  // Liste unifiée staff + joueurs, avec un numéro de badge propre à chaque rôle
  const allMembers = useMemo(() => {
    const staff = staffMembers.map((m, i) => ({ ...m, role: 'STAFF', badgeIndex: i + 1 }));
    const joueurs = players.map((m, i) => ({ ...m, role: 'JOUEUR', badgeIndex: i + 1 }));
    return [...staff, ...joueurs];
  }, [staffMembers, players]);

  // Pagination réelle : la page 1 a un grand bandeau donc moins de place,
  // les suivantes ont un bandeau réduit donc une ligne de plus.
  const pages = useMemo(() => {
    const result = [];
    let i = 0;
    let first = true;
    while (i < allMembers.length) {
      const capacity = first ? CAPACITY_FIRST : CAPACITY_OTHER;
      result.push(allMembers.slice(i, i + capacity));
      i += capacity;
      first = false;
    }
    return result.length ? result : [[]];
  }, [allMembers]);

  return (
    <AdminLayout pageTitle={`Licence collective : ${teamName}`}>
      {/* Polices : registre "document officiel" — serif d'affichage,
          mono pour les identifiants, sans-serif discret pour les labels */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-900/25 py-8 items-center font-sans antialiased">
        <div className="w-full max-w-[800px] px-4 mb-2">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Zone d'administration
          </h4>
          <p className="text-xs text-slate-500">
            {pages.length > 1
              ? `Document réparti sur ${pages.length} pages A4 — téléchargement page par page`
              : 'Génération de la feuille officielle au format A4'}
          </p>
        </div>

        {pages.map((pageMembers, idx) => (
          <LicensePage
            key={idx}
            members={pageMembers}
            pageNumber={idx + 1}
            pageCount={pages.length}
            teamLogo={teamLogo}
            teamName={teamName}
            quartier={quartier}
            dominantColor={dominantColor}
          />
        ))}
      </div>
    </AdminLayout>
  );
};