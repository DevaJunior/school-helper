import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../Pages/Header';
import { Sidebar } from '../../Pages/Sidebar';
import './styles.css';
import { useUIStore } from '../../../../src/store/useUIStore';

export const DashboardLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();

  // Trava a rolagem da página quando a sidebar estiver aberta no celular
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet /> {/* Aqui serão renderizadas as páginas filhas (Home, Notas, etc) */}
        </main>
      </div>
    </div>
  );
};