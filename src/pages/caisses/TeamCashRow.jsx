import React, { useState } from 'react';
import Clock from './Clock';
import { toast } from 'react-toastify';
import {useAddLabelToTeam} from '../../lib/graphql.service';
export default function TeamCashRow({ team, onUpdateCash, onOpenEditModal }) {
    // console.log("Rendering TeamCashRow for team:", team);
  const [addLabelToTeam,{loading: addLoading}] = useAddLabelToTeam();  
  const [isExpanded, setIsExpanded] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [targetThreshold, setTargetThreshold] = useState(''); // Nouveau champ seuil dédié
  const [sumInitial, setSumInitial] = useState('');
  const [sumToday, setSumToday] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);


  // Calcule le statut financier par rapport au seuil unique lié au libellé de l'équipe
  const getStatusConfig = (currentSum, target) => {
    const goal = parseFloat(target) || 0;
    if (goal === 0) return { text: 'SANS SEUIL', color: 'bg-slate-800 text-slate-400 border border-slate-700/40' };
    
    const ratio = (parseFloat(currentSum) / goal) * 100;
    if (ratio >= 100) return { text: 'EN RÈGLE', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    if (ratio >= 75) return { text: 'PRESQUE EN RÈGLE', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    return { text: 'TRÈS CRITIQUE', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
  };

  const handleAddLabel =  async(e) => {
    e.preventDefault();
    if (!newLabel || !targetThreshold) return;

  try {
      const updatedLabels = [...(team.cashLabels || [])];
    updatedLabels.push({
      id: Date.now().toString(),
      name: newLabel,
      targetThreshold: targetThreshold, // Sauvegarde du seuil personnalisé
      initialSum: sumInitial || '0',
      initialDate: '', 
      todaySum: sumToday || '0',
      todayDate: new Date().toLocaleDateString()
    });

    // onUpdateCash(team.id, updatedLabels);
  
    const {data:response}=await addLabelToTeam({ variables:
         { teamId: team.teamId, 
            input: {
              name: newLabel,
              targetThreshold: parseFloat(targetThreshold),
              initialSum: parseFloat(sumInitial) || 0,
             todaySum: parseFloat(sumToday) || 0
            }
        } });   

      setNewLabel(''); setTargetThreshold(''); setSumInitial(''); setSumToday(''); setShowAddForm(false);
      
      if(response && response.addLabelToTeam){
        toast.success("Libellé ajouté avec succès !");
      }
      else{
        toast.error("Erreur lors de l'ajout du libellé. Veuillez réessayer.");
      }
        
  } catch (error) {
    console.error("Erreur lors de l'ajout du libellé :", error);
    toast.error("Erreur lors de l'ajout du libellé. Veuillez réessayer.");
  }
  };

  return (
     <div className="
   self-start
   bg-slate-900 
   border 
   border-slate-800/80 
   rounded-xl 
   transition-all 
   hover:border-slate-700/50 
   mb-3 
   overflow-hidden
 ">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 font-bold text-slate-400 text-sm">
           <img src= {team?.teamLogo || '/default-logo.png'} alt={team?.teamName} className="w-8 h-8 object-cover rounded-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-base">{team?.teamName}</h3>
            <p className="text-xs text-slate-500">{team.cashLabels?.length || 0} ligne(s) budgétaire(s)</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Accordéon Contenu */}
      {isExpanded && (
        <div className="px-4 pb-5 border-t border-slate-950 bg-slate-950/40">
          <div className="mt-4 space-y-3">
            {(!team.cashLabels || team.cashLabels.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2">Aucun frais configuré pour cette équipe.</p>
            ) : (
              team.cashLabels.map((label) => {
                const status = getStatusConfig(label.todaySum, label.targetThreshold);
                return (
                  <div key={label.id || label._id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Libellé et Seuil Indiqué */}
                    <div className="min-w-[200px]">
                      <span className="text-sm font-semibold text-slate-300 block">{label.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        Seuil Exigé : <span className="text-slate-300 font-bold">{parseFloat(label.targetThreshold).toLocaleString()} F</span>
                      </span>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    {/* Somme Initiale vs Actuelle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Somme Initiale {label.initialDate && `(au ${label.initialDate})`}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">{parseFloat(label.initialSum).toLocaleString()} F</span>
                      </div>
                      <div className="bg-cyan-500/5 p-2.5 rounded-lg border border-cyan-500/10">
                        <span className="text-[10px] uppercase font-bold text-cyan-500 block">Somme Actuelle (au {label.todayDate})</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">{parseFloat(label.todaySum).toLocaleString()} F</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => onOpenEditModal(team, label)}
                        className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FORMULAIRE AVEC AJOUT DE SEUIL DIRECT */}
          <div className="mt-4 border-t border-dashed border-slate-800 pt-4">
            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Ajouter un nouveau libellé avec son seuil
              </button>
            ) : (
              <form onSubmit={handleAddLabel} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <h5 className="text-xs font-bold text-slate-400">Nouveau Libellé</h5>
                  <Clock />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Désignation</label>
                    <input type="text" placeholder="Ex: Licences" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-cyan-500 uppercase font-bold mb-1">Seuil exigé (Objectif)</label>
                    <input type="number" placeholder="Ex: 5000" value={targetThreshold} onChange={(e) => setTargetThreshold(e.target.value)} className="w-full px-3 py-2 border border-slate-800/80 rounded-lg text-xs bg-slate-900 text-cyan-400 font-bold font-mono focus:outline-none focus:border-cyan-500" required />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Somme Initiale</label>
                    <input type="number" placeholder="0" value={sumInitial} onChange={(e) => setSumInitial(e.target.value)} className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Somme du Jour</label>
                    <input type="number" placeholder="0" value={sumToday} onChange={(e) => setSumToday(e.target.value)} className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-200 focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[11px]">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-slate-500 hover:bg-slate-900 rounded-md">Annuler</button>
                  <button type="submit" 
                  disabled={addLoading}
                  className="px-3 py-1.5 font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md">
                    {addLoading ? 'Création en cours...' : 'Créer la ligne'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
   
    </div>
  );

}