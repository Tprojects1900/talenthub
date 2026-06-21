import React, { useState } from 'react';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import { useScreen } from '../context/ScreenContext';
import { useSidebar } from '../context/SidebarContext';
import AppProvider from '../providers/app.provider';
import AuthMiddleware from '../middleware/auth.middleware';
const AdminLayoutContent = ({ children, currentSection, onNavigate, pageTitle }) => {
  const { isMobile, isTablet } = useScreen();
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <div className="bg-zinc-950 flex font-sans antialiased text-zinc-200">
      
      {/* RENDU DES SIDEBARS SELON DISPOSITIFS */}
      {isMobile || isTablet ? (
        <>
          {/* Menu coulissant mobile */}
          <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <Sidebar currentSection={currentSection} onNavigate={onNavigate} />
          </div>
          
          {/* Fond obscurci (backdrop) cliquable pour refermer le menu */}
          {isOpen && (
            <div 
              onClick={closeSidebar} 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fadeIn"
            />
          )}
        </>
      ) : (
        /* Sidebar Standard Desktop stable et fixe */
        <Sidebar currentSection={currentSection} onNavigate={onNavigate} />
      )}

      {/* Conteneur principal de droite */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header pageTitle={pageTitle} adminName="K. Mawuli" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

// Exportation enveloppée directement dans son fournisseur pour simplifier l'import à la racine
const AdminLayout = (props) => (
    <AuthMiddleware>
    <AdminLayoutContent {...props} />
     </AuthMiddleware>
);

export default AdminLayout;