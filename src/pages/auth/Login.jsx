import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, RefreshCw, LogIn } from 'lucide-react';
import topfoot from "../../assets/images/topfoot.png"
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    // Simulation de l'authentification sécurisée
    setTimeout(() => {
      setIsLoading(false);
      alert("Authentification réussie. Bienvenue dans le panel Admin !");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Éléments de Design en Arrière-plan (Lueurs d'ambiance) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Carte Principale de Connexion */}
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-850 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* LOGO & EN-TÊTE */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-[#FFD700]">
            {/* <ShieldCheck size={28} className="drop-shadow-[0_2px_10px_rgba(255,215,0,0.15)]" /> */}
            <img src={topfoot} alt="topfoot" className='w-16 h-12'/>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            Espace <span className="text-[#FFD700]">Admin</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Veuillez vous identifier pour accéder au panneau de configuration
          </p>
        </div>

        {/* FORMULAIRE DE CONNEXION */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* CHAMP : USERNAME */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Identifiant Admin
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#FFD700] transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                placeholder="Ex: superadmin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/80 border border-zinc-800 text-sm rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* CHAMP : MOT DE PASSE */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Mot de passe
              </label>
              {/* <a href="#forgot" className="text-[11px] font-semibold text-[#FFD700]/80 hover:text-[#FFD700] transition-colors">
                Oublié ?
              </a> */}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#FFD700] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-zinc-950/80 border border-zinc-800 text-sm rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-all font-mono tracking-widest text-zinc-200"
              />
              {/* Bouton Afficher / Masquer */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOUTON DE CONNEXION PRINCIPAL */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-[#FFD700] hover:bg-[#ffe240] text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group shadow-[0_4px_20px_rgba(255,215,0,0.15)]"
          >
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin text-black" />
            ) : (
              <>
                Se connecter
                <LogIn size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* FOOTER DISCRET */}
        <div className="mt-8 pt-6 border-t border-zinc-850/60 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
          Accès Crypté End-to-End • Secure Zone
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;