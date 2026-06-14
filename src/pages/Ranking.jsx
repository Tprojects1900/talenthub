import React from "react";
import TeamsTable from "../components/tables/TeamsTable"; 
import { MainLayout } from '../layouts'
import { Shield, Trophy, Star } from "lucide-react";

// Importations des Assets
import t1 from "../assets/images/t1.png";
import t2 from "../assets/images/t2.png";
import t3 from "../assets/images/t3.png";
import t4 from "../assets/images/t4.png";
import t5 from "../assets/images/t5.png";
import t6 from "../assets/images/t6.png";
import t7 from "../assets/images/t7.png";
import t8 from "../assets/images/t8.png";
import t9 from "../assets/images/t9.png";
import t10 from "../assets/images/t10.png";
import t11 from "../assets/images/t11.png";
import t12 from "../assets/images/t12.png";
import t13 from "../assets/images/t13.png";
import t14 from "../assets/images/t14.png";
import t15 from "../assets/images/t15.png";
import t16 from "../assets/images/t16.png";
import trophy from "../assets/images/trophy.png";

const RankingPage = () => {
  // Définition des colonnes étendue avec les statistiques de football
  const columns = [
    {
      key: "rang",
      label: "RANG",
      render: (ins, index) => {
        if (index === 0) {
          return (
            <span className="bg-[#FFD700] text-black font-black px-2 py-0.5 rounded-sm text-xs shadow-sm">
              1er
            </span>
          );
        }
        return <span className="font-bold text-gray-500 text-xs">{index + 1}e</span>;
      },
    },
    {
      key: "logo",
      label: (
        <div className="flex flex-col items-center">
          <Star size={14} className="text-[#FFD700] mb-0.5" />
          <span className="text-[10px]">LOGO</span>
        </div>
      ),
      render: (item) => (
        <div className="relative group flex justify-center">
          <div className="absolute -inset-1 bg-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <img
            src={item.logo}
            alt={item.name}
            className="relative w-8 h-8 object-contain bg-white p-0.5 rounded-full border border-gray-200"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: (
        <div className="flex flex-col items-start pl-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Équipe</span>
        </div>
      ),
      render: (item) => (
        <div className="text-left pl-2">
          <span className="font-black text-gray-800 uppercase italic tracking-wide text-xs block truncate max-w-[120px] sm:max-w-none">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: "matchP",
      label: <span className="text-[10px]" title="Matchs Joués">MJ</span>,
      render: (item) => <span className="text-xs font-semibold text-gray-600">{item.matchP}</span>
    },
    {
      key: "victoire",
      label: <span className="text-[10px]" title="Matchs Gagnés">G</span>,
      render: (item) => <span className="text-xs font-medium text-emerald-600">{item.victoire}</span>
    },
    {
      key: "nul",
      label: <span className="text-[10px]" title="Matchs Nuls">N</span>,
      render: (item) => <span className="text-xs font-medium text-gray-500">{item.nul}</span>
    },
    {
      key: "defaite",
      label: <span className="text-[10px]" title="Matchs Perdus">P</span>,
      render: (item) => <span className="text-xs font-medium text-red-500">{item.defaite}</span>
    },
    {
      key: "buts",
      label: <span className="text-[10px]" title="Buts Pour : Buts Contre">BP:BC</span>,
      render: (item) => <span className="text-xs font-mono text-gray-400">{item.butM}:{item.butE}</span>
    },
    {
      key: "diffB",
      label: <span className="text-[10px]" title="Différence de buts">DB</span>,
      render: (item) => {
        const isPositive = item.diffB.startsWith('+');
        const isZero = item.diffB === '0';
        return (
          <span className={`text-xs font-bold font-mono ${isZero ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {item.diffB}
          </span>
        );
      }
    },
    {
      key: "point",
      label: <span className="text-[10px] text-[#FFD700]" title="Points">PTS</span>,
      render: (item) => <span className="text-sm font-black text-gray-900">{item.point}</span>
    },
  ];

  // Distribution des 16 équipes sur les Poules avec leurs stats complètes
  const pouleA = [
    { logo: t1, name: "TALENT FC", matchP: 3, point: 9, defaite: 0, victoire: 3, nul: 0, butM: 10, butE: 3, diffB: '+7' },
    { logo: t2, name: "VAPEUR FOOT", matchP: 3, point: 6, defaite: 1, victoire: 2, nul: 0, butM: 5, butE: 4, diffB: '+1' },
    { logo: t3, name: "FC WARRIORS", matchP: 3, point: 1, defaite: 2, victoire: 0, nul: 1, butM: 2, butE: 6, diffB: '-4' },
    { logo: t4, name: "NEW START", matchP: 3, point: 1, defaite: 2, victoire: 0, nul: 1, butM: 1, butE: 5, diffB: '-4' },
  ];

  const pouleB = [
    { logo: t5, name: "AS TALENT", matchP: 3, point: 7, defaite: 0, victoire: 2, nul: 1, butM: 6, butE: 2, diffB: '+4' },
    { logo: t6, name: "BLUE LOCK", matchP: 3, point: 6, defaite: 1, victoire: 2, nul: 0, butM: 8, butE: 4, diffB: '+4' },
    { logo: t7, name: "FUTURS ETOILE", matchP: 3, point: 4, defaite: 1, victoire: 1, nul: 1, butM: 4, butE: 5, diffB: '-1' },
    { logo: t8, name: "IRON BULLS FC", matchP: 3, point: 0, defaite: 3, victoire: 0, nul: 0, butM: 1, butE: 8, diffB: '-7' },
  ];

  const pouleC = [
    { logo: t9, name: "MACHALLA", matchP: 3, point: 9, defaite: 0, victoire: 3, nul: 0, butM: 7, butE: 1, diffB: '+6' },
    { logo: t10, name: "ATLANTIC FC", matchP: 3, point: 4, defaite: 1, victoire: 1, nul: 1, butM: 3, butE: 3, diffB: '0' },
    { logo: t11, name: "UNION AC", matchP: 3, point: 3, defaite: 2, victoire: 1, nul: 0, butM: 4, butE: 6, diffB: '-2' },
    { logo: t12, name: "AFRICA SPORT", matchP: 3, point: 1, defaite: 2, victoire: 0, nul: 1, butM: 2, butE: 6, diffB: '-4' },
  ];

  const pouleD = [
    { logo: t13, name: "VICTORIA FC", matchP: 2, point: 4, defaite: 0, victoire: 1, nul: 1, butM: 3, butE: 1, diffB: '+2' },
    { logo: t14, name: "BSB FC", matchP: 2, point: 1, defaite: 1, victoire: 0, nul: 1, butM: 1, butE: 3, diffB: '-2' },
  ];

  const pouleE = [
    { logo: t15, name: "TUDOR FC", matchP: 1, point: 3, defaite: 0, victoire: 1, nul: 0, butM: 2, butE: 0, diffB: '+2' },
  ];

  const pouleF = [
    { logo: t16, name: "RÉVEIL ESPOIR FC", matchP: 1, point: 0, defaite: 1, victoire: 0, nul: 0, butM: 0, butE: 2, diffB: '-2' },
  ];

  const toutesLesPoules = [
    { id: "A", data: pouleA },
    { id: "B", data: pouleB },
    { id: "C", data: pouleC },
    { id: "D", data: pouleD },
    { id: "E", data: pouleE },
    { id: "F", data: pouleF },
  ];

  return (
    <MainLayout>
      {/* 1. Header plein écran (w-full, m-0, p-0) avec l'image trophy.png */}
      <div className="relative w-full h-[360px] m-0 p-0 overflow-hidden shadow-2xl bg-black">
        <img
          src={trophy}
          alt="Tournoi Trophy Header"
          className="w-full h-full object-cover opacity-85"
        />
        {/* Dégradé immersif noir et doré */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/40 to-transparent flex flex-col justify-end p-8 lg:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-3 py-1 text-xs font-black uppercase tracking-widest mb-3 rounded-sm">
              <Trophy size={14} /> Classement Officiel
            </div>
            <h1 className="text-white text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
              LES POULES <span className="text-[#FFD700]">TOP FOOT</span>
            </h1>
            <p className="text-gray-300 text-sm lg:text-base font-medium mt-2 max-w-xl">
              Suivez en direct l'évolution, les points et le goal-average de chaque groupe pour la phase finale.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Contenu des Tableaux (w-full avec p-4) */}
      <div className="w-full p-6 max-w-8xl mx-auto -mt-8 relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8 pb-16">
        {toutesLesPoules.map((poule) => (
          <div 
            key={poule.id} 
            className="bg-zinc-50 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm"
          >
            {/* Titre de la Poule */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-3 h-3 bg-[#FFD700] rotate-45"></div>
              <h3 className="font-black text-xl text-gray-900 tracking-tight uppercase">
                POULE {poule.id}
              </h3>
            </div>

            {/* Tableau dynamique configuré pour le sport */}
            <TeamsTable 
              columns={columns} 
              data={poule.data} 
              searchPlaceholder={`Filtrer la poule ${poule.id}...`}
              searchKey="name"
            />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default RankingPage;