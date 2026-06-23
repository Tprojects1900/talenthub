import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Dashboard from '../../components/Dashboard';
import AuthMiddleware from '../../middleware/auth.middleware';

// Import fictif de votre gestionnaire de tournoi créé au tour précédent
// import GroupAndMatchManager from './GroupAndMatchManager';

const AdminDashboardPage = () => {
 // const [currentSection, setCurrentSection] = useState('dashboard');
  const [pageTitle, setPageTitle] = useState('Vue d\'ensemble');

  const handleNavigation = (id, label) => {
    setCurrentSection(id);
    setPageTitle(label);
  };

  return (
 
      <AdminLayout
       // currentSection={currentSection}
        onNavigate={handleNavigation}
        pageTitle={pageTitle}
      >
       <Dashboard/>
      </AdminLayout>
   
  );
};

export default AdminDashboardPage;