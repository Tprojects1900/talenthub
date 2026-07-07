import React, { useState, useMemo ,useEffect} from 'react';
import {toast} from 'react-toastify'
import TeamCashRow from './TeamCashRow';
import CashHistoryView from './CashHistoryView';
import EditSumModal from './EditModal';
import AdminLayout from '../../layouts/AdminLayout';
import { useCaisseDashboard } from '../../hooks/useCalls';
import { useAddLabelToTeam,useEditLabelToTeam } from '../../lib/graphql.service';
import Loader from '../../components/Loader';
const INITIAL_DATA = [
  { id: 't1', name: 'Talent FC', cashLabels: [{ id: '1', name: 'Licences', targetThreshold: '5000', initialSum: '0', initialDate: '', todaySum: '5000', todayDate: '07/07/2026' }] },
  { id: 't2', name: 'Étoiles du Sud', cashLabels: [{ id: '2', name: 'Licences', targetThreshold: '5000', initialSum: '0', initialDate: '', todaySum: '2000', todayDate: '07/07/2026' }] }
];


export default function CaissePage() {
  const { caisses, load_caisse,refetchCaisse } = useCaisseDashboard();  
const [addLabelToTeam,{loading: addLoading}] = useAddLabelToTeam();
const [editLabelToTeam, { loading: editLoading }] = useEditLabelToTeam();
const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('gestion');

  //refetchCaisse data when caisses change

useEffect(() => {
  refetchCaisse();
}, []);
useEffect(() => {
  if (caisses && caisses.length > 0) {
    setTeams(caisses);
  }
}, [caisses]);

  
  // Contrôle de la modale d'ajustement
  const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, team: null, label: null });

 const handleUpdateCash = async (teamId, updatedLabels, labelId) => {
   try {
   setTeams(prev => {
//   console.log("Avant update :", prev);

  return prev.map(t => 
    t.teamId === teamId 
      ? { ...t, cashLabels: updatedLabels } 
      : t
  );
  
});

const {data:response}=await editLabelToTeam({
 variables:{
   teamId,
   labelId,
   newSum: parseFloat(
     updatedLabels.find(l => (l.id || l._id) === labelId)?.todaySum || 0
   ),
   newTarget: parseFloat(
     updatedLabels.find(l => (l.id || l._id) === labelId)?.targetThreshold || 0
   )
 }
});
// console.log("teams après update :", teams);
        if(response && response.adjustCashLabel){
          toast.success("Caisse ajustée avec succès !");
        }else{
          toast.error("Erreur lors de l'ajustement de la caisse. Veuillez réessayer.");
        }

    } catch (error) {
      console.error("Erreur lors de l'ajustement de la caisse :", error);
      toast.error("Erreur lors de l'ajustement de la caisse. Veuillez réessayer.");
    }



  };

  const handleSaveAdjustment = async (labelId, newSumValue, newTargetValue) => {
    const { team, label } = editModalConfig;
    if (!team || !label) return;

    const updated = team.cashLabels.map(l => {
     if ((l.id || l._id) === labelId){
        return {
          ...l,
          labelId: labelId,
          targetThreshold: newTargetValue, // Met à jour le seuil de cette équipe
          initialSum: l.todaySum, 
          initialDate: l.todayDate || new Date().toLocaleDateString(), 
          todaySum: newSumValue, 
        //   todayDate: new Date().toLocaleDateString()
        };
      }
      return l;
    });
  await handleUpdateCash(team.teamId, updated, labelId);
  };

const labelStats = useMemo(() => {
  const stats = {};

  teams.forEach(team => {

    (team.cashLabels || []).forEach(label => {

      const cleanName = String(label?.name || "Sans nom")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();


      if (!stats[cleanName]) {
        stats[cleanName] = {
          name: label?.name?.trim() || "Sans nom",
          totalCollected: 0,
          totalExpected: 0,
          teams: []
        };
      }


      stats[cleanName].totalCollected += Number(label.todaySum || 0);

      stats[cleanName].totalExpected += Number(label.targetThreshold || 0);


      stats[cleanName].teams.push({
        teamName: team.teamName,
        amount: Number(label.todaySum || 0)
      });

    });

  });


//   console.log("STATISTIQUES FINALES :", Object.values(stats));

  return Object.values(stats);

}, [teams]);

 const filteredTeams = (teams || []).filter((t) =>
  (t?.teamName || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
  return (
    <AdminLayout>
        
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              TRÉSORERIE DU TOURNOI ⚽
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Suivi des seuils individualisés par club engagé.</p>
          </div>
          
          <div className="bg-slate-900 p-0.5 rounded-lg flex border border-slate-800 text-xs font-bold">
            <button onClick={() => setActiveTab('gestion')} className={`px-4 py-2 rounded-md transition-all ${activeTab === 'gestion' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>Saisie</button>
            <button onClick={() => setActiveTab('historique')} className={`px-4 py-2 rounded-md transition-all ${activeTab === 'historique' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>Historique Consolidé</button>
          </div>
        </div>


        {/* CARDS STATISTIQUES GLOBALISÉES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labelStats.map(stat => {
            const pct = stat.totalExpected ? Math.min(Math.round((stat.totalCollected / stat.totalExpected) * 100), 100) : 0;
            return (
              <div key={stat.name} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">{stat.name} (Global)</span>
                  <span className="text-xl font-mono font-black text-white mt-1.5 block">
                    {stat.totalCollected.toLocaleString()} <span className="text-xs font-normal text-slate-500">FCFA perçus</span>
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                    <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Progression globale : {pct}%</span>
                    <span>Cible cumulée : {stat.totalExpected.toLocaleString()} F</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       {load_caisse && <Loader />}
        {/* Filtrage */}
        <input 
          type="text" placeholder="Rechercher un club..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-900 rounded-xl text-xs bg-slate-900 text-slate-200 focus:outline-none"
        />

        {/* Contenu principal */}
        {activeTab === 'gestion' ? (
       <div className="
  columns-1
  md:columns-2
  gap-4
  mt-4
">
          {filteredTeams.map(team => (
  <TeamCashRow 
    key={team.teamId}
    team={team}
    onUpdateCash={handleUpdateCash}
    onOpenEditModal={(t, l) =>
      setEditModalConfig({ 
        isOpen: true, 
        team: t, 
        label: l 
      })
    }
  />
))}
          </div>
        ) : (
          <CashHistoryView teams={filteredTeams} />
        )}

        {/* MODALE PRESTIGE : MODIFICATION MONTANT & SEUIL */}
        <EditSumModal 
          isOpen={editModalConfig.isOpen}
          teamName={editModalConfig.team?.teamName}
          label={editModalConfig.label}
          onClose={() => setEditModalConfig({ isOpen: false, team: null, label: null })}
          onSave={handleSaveAdjustment}
          loading={editLoading}
        />

      </div>
    </div>
  </AdminLayout>
    );
}