import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Dashboard from '../../components/Dashboard';
import AuthMiddleware from '../../middleware/auth.middleware';

// Import fictif de votre gestionnaire de tournoi créé au tour précédent
// import GroupAndMatchManager from './GroupAndMatchManager';

const AdminDashboardPage = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [pageTitle, setPageTitle] = useState('Vue d\'ensemble');

  const handleNavigation = (id, label) => {
    setCurrentSection(id);
    setPageTitle(label);
  };

  return (
 
      <AdminLayout
        currentSection={currentSection}
        onNavigate={handleNavigation}
        pageTitle={pageTitle}
      >
        {/* Rendu conditionnel des contenus selon l'ID du sidebar */}
        {currentSection === 'dashboard' && <Dashboard />}

        {currentSection === 'tournois' && (
          <div className="bg-zinc-900/30 p-6 border border-zinc-850 rounded-2xl">
            <p className="text-xs text-zinc-400">Ici sera rendu votre composant complet de gestion des Poules et Matchs (`GroupAndMatchManager`).</p>
          </div>
        )}

        {/* Fallback temporaire pour les autres rubriques propres en cours d'écriture */}
        {currentSection !== 'dashboard' && currentSection !== 'tournois' && (
          <div className="py-12 text-center text-xs text-zinc-600 font-medium border border-dashed border-zinc-850 rounded-2xl">
            Contenu de la rubrique en cours de déploiement...
          </div>
        )}
      </AdminLayout>
   
  );
};

export default AdminDashboardPage;