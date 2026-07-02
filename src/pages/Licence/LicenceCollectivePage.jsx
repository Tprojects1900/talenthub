import React, { useState, useEffect, useRef ,useMemo} from 'react';
import { useParams } from 'react-router-dom';
import { getDominantColor, generateLicenseId } from '../../utils/colorExtractor';
import user1 from "../../assets/images/user_image.png";
import team from "../../assets/images/team.png";
import topfoot from "../../assets/images/topfoot.png";
import staff from "../../assets/images/staff.png";
import useImageExport from '../../hooks/useImageExport';
import { useTeamDetails } from '../../hooks/useCalls';
import AdminLayout from '../../layouts/AdminLayout';
import TopFootHeaderBadge from '../../components/TopFootHeaderBadge';
// Données de l'équipe officielles
const TEAM_DATA = {
  name: "EMELAKONON FC",
  logo: team,
  quartier: "YOYO BAR",
  staff: [
    { name: "Jean-Claude Koffi", role: "ENTRAÎNEUR PRINCIPAL", photo: staff },
    { name: "M. Agbégniadan", role: "PRÉPARATEUR PHYSIQUE", photo: staff }
  ],
  players: Array.from({ length: 20 }, (_, i) => ({
    name: `Joueur NomUnique`,
    number: i + 1,
    photo: user1
  }))
};

const hexToRgba = (hex, opacity) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${opacity})`;
  }
  return `rgba(15, 23, 42, ${opacity})`;
};

export const LicenceCollectivePage = () => {
 const { teamId } = useParams(); 
 const { teamDetails, loading: teamLoading } = useTeamDetails(teamId);
//  const [teamName, setTeamName] = useState("");
//  const [quartier, setQuartier] = useState("");
//  const [teamLogo, setTeamLogo] = useState(null);
//  const [players, setPlayers] = useState([]);
//  const [staffMembers, setStaffMembers] = useState([]);
  const [dominantColor, setDominantColor] = useState('#1e3a8a');
  const posterRef = useRef();
  const { exportImage, loading } = useImageExport(posterRef,dominantColor);

const teamName = teamDetails?.nom ?? "";
const teamLogo = teamDetails?.logo ?? null;
const quartier = teamDetails?.quartier ?? "";

const players = useMemo(
  () =>
    (teamDetails?.members ?? []).filter(
      m => m.type?.toLowerCase() === "joueur"
    ),
  [teamDetails]
);

const staffMembers = useMemo(
  () =>
    (teamDetails?.members ?? []).filter(
      m => m.type?.toLowerCase() === "staff"
    ),
  [teamDetails]
);

  useEffect(() => {
    if(teamLogo){
       const dmColor=getDominantColor(teamLogo);
       setDominantColor(dmColor ? dmColor : '#1e3a8a');
    }
   
  }, [teamLogo]);

  const bodyBgColor = hexToRgba(dominantColor, 0.03);
  const gridOuterBg = hexToRgba(dominantColor, 0.05);
  const cardDarkBg = '#0f172a';
  const structuralBorder = hexToRgba(dominantColor, 0.15);
// console.log("player count:", players.length, "staff count:", staffMembers.length);
  return (
    <AdminLayout pageTitle={`Licence collective :  ${teamName}`}>
    <div className="min-h-screen flex flex-col bg-slate-950 py-8 justify-center items-center font-sans antialiased">
      
      {/* Action Bar */}
      <div className="w-full max-w-[800px] px-4 mb-4 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Zone d'administration</h4>
          <p className="text-xs text-slate-500">Génération de la feuille officielle au format A4</p>
        </div>
        <button
          onClick={() =>
            exportImage({
              fileName: `Licence_Elite_${teamName?.replace(/\s+/g, '_')}`,
              pixelRatio: 4,
            })
          }
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl ${
            loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
          }`}
        >
          {loading ? 'Traitement en cours...' : 'Générer & Télécharger'}
        </button>
      </div>

      {/* CANVAS A4 */}
      <div 
        ref={posterRef} 
        className="relative w-[210mm] h-[297mm] p-[10mm] shadow-2xl flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: bodyBgColor }}
      >
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02] filter grayscale">
          <img src={teamLogo} alt="" className="w-[130mm] h-[130mm] object-contain" />
        </div>

        <div className="w-full flex flex-col justify-between h-full z-10 relative">
          
          {/* GRILLE PRINCIPALE */}
          <div 
            className="grid grid-cols-4 gap-2.5 p-2.5 rounded-2xl border shadow-inner"
            style={{ backgroundColor: gridOuterBg, borderColor: structuralBorder }}
          >
            
            {/* ========================================================================= */}
            {/* NOUVEAU DESIGN DESIGN SUBLIME POUR LA LIGNE 1 (COMPÉTITION + CLUB + STAFF) */}
            {/* ========================================================================= */}
            
            {/* BLOC UNIQUE FUSIONNÉ : COMPÉTITION X CLUB (Prend 2 colonnes de large) */}
            <div className="col-span-2 h-[39mm] bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-slate-950 relative overflow-hidden shadow-md">
              {/* Ligne de marque de la couleur du club au centre pour séparer subtilement */}
              <div className="absolute right-[45%] top-0 bottom-0 w-[1px] bg-white/10"></div>
              
              {/* Partie Gauche : Tournoi */}
              <TopFootHeaderBadge topfoot={topfoot} />

              {/* Partie Droite : Club Officiel */}
              <div className="w-[50%] flex flex-col items-center justify-center text-center pl-2">
                <div className="relative mb-1">
                  <img src={teamLogo} alt="Team" className="h-16 w-16 object-contain drop-shadow" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-slate-900" style={{ backgroundColor: dominantColor }}></div>
                </div>
                <h2 className="font-black text-amber-400 text-xs uppercase tracking-tight line-clamp-1">{teamName}</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{quartier}</p>
              </div>

              {/* Tag "LICENCE COLLECTIVE" en filigrane vertical sur le côté */}
              <div className="absolute -right-5 top-1/2 -translate-y-1/2 rotate-90 text-[7px] font-mono tracking-[0.3em] text-white/10 font-bold whitespace-nowrap">
                OFFICIAL DOCUMENT
              </div>
            </div>

            {/* LES MEMBRES DU STAFF (2 colonnes individuelles qui complètent la ligne) */}
            {staffMembers?.map((member, idx) => (
              <div 
                key={`staff-${idx}`} 
                className="h-[39mm] bg-white rounded-xl flex flex-col justify-between p-2.5 shadow-md border border-slate-200/80 relative overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="text-[7px] font-black text-white px-1.5 py-0.5 rounded tracking-wide uppercase" style={{ backgroundColor: dominantColor }}>
                    {idx === 0 ? 'STAFF' : 'STAFF'}
                  </span>
                  <span className="text-[9px] font-mono text-black font-bold">N° {idx + 1}</span>
                </div>
                
                <div className="flex items-center gap-2 my-1">
                  <img src={member?.logo} alt={member?.nom} className="w-11 h-13 object-cover rounded-lg bg-slate-100 border border-slate-200 shadow-sm" />
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-800 uppercase leading-tight line-clamp-2">{member?.nom}</p>
                    <span className="text-[7px] font-bold text-slate-400 tracking-tight mt-0.5 uppercase line-clamp-1">{member?.type}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 text-white text-center py-0.5 rounded text-[7px] font-mono font-bold tracking-wider">
                  OFFICIEL ACCRÉDITÉ
                </div>
              </div>
            ))}

            {/* ========================================================================= */}
            {/* FIN DU NOUVEAU DESIGN LIGNE 1 - LES JOUEURS RESTENT ALIGNÉS EN DESSOUS */}
            {/* ========================================================================= */}

            {/* LES 20 JOUEURS */}
            {players?.map((player, index) => {
              const licenseId = generateLicenseId(teamName, index + 1, player?.nom);

              return (
                <div 
                  key={`player-${index}`} 
                  className="h-[42mm] rounded-xl flex flex-col justify-between p-2.5 shadow-md relative overflow-hidden border border-slate-950"
                  style={{ backgroundColor: cardDarkBg }}
                >
                  <div className="absolute top-0 inset-x-0 h-[2px]" style={{ backgroundColor: dominantColor }}></div>

                  <div className="flex items-center  gap-1 z-10 border-b border-white/[0.06] pb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-200 truncate">
                      {player?.nom} 
                    </span>
                    {/* <span className="text-[7px] font-mono text-amber-500 font-bold">TOPFOOT #2026</span> */}
                  </div>

                  <div className="flex items-center justify-between my-1 relative h-20">
                    <span className="text-4xl font-black italic tracking-tighter font-mono select-none text-white/90 drop-shadow">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    <div className="relative">
                      <img 
                        src={player?.logo} 
                        alt={player?.nom} 
                        className="w-20 h-20 object-cover object-top rounded-lg bg-slate-800 border border-white/10 shadow-md" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-md shadow border border-slate-200">
                        <img src={teamLogo} alt="" className="w-3 h-3 object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-center px-1.5 py-1 bg-white/5 rounded-lg border border-white/[0.04] text-[9px] font-mono font-bold tracking-wider text-amber-400">
                    <span className="text-slate-500 text-[7px] font-sans font-bold uppercase">ID LICENCE</span>
                    <span>{licenseId}</span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* ZONE ADMINISTRATIVE ET SIGNATURES GARANTIES SANS BUGS */}
          <footer className="border-t border-slate-300/60 pt-4 mt-2 flex items-center justify-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            <div className="flex flex-col gap-0.5 text-left">
              <p className="text-gray-300 font-black tracking-wide text-[10px]">DOCUMENT DÉLIVRÉ PAR L'ORGANISATION</p>
              <p className="text-amber-600 font-bold">Licence Collective Certifiée • TOPFOOT 2026

                (   <span className="font-mono text-[8px] text-slate-400 normal-case font-medium">
                Sec-Key verify: {btoa(teamName).substring(0, 16).toUpperCase()}
              </span> )
              </p>
            
            </div>
            
            {/* <div className="flex gap-12 text-center mr-2">
              <div className="w-36 flex flex-col items-center">
                  <span className="font-mono text-[8px] text-slate-400 normal-case font-medium">Sec-Key verify: {btoa(teamName).substring(0, 16).toUpperCase()}</span>
          
                <p className="text-[8px] font-black text-slate-400 tracking-tight">SIGNATURE RESP. CLUB</p>
              </div>
              <div className="w-44 flex flex-col items-center">
                <div className="w-full border-b border-slate-400/80 h-7 mb-1.5"></div>
                <p className="text-[8px] font-black text-slate-400 tracking-tight">SIGNATURE COMITÉ TOPFOOT</p>
              </div>
            </div> */}
          </footer>

        </div>

      </div>
    </div>
    </AdminLayout>
  );
};