import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import './styles/global.css';
import { DashboardLayout } from './../renders/pages/Dashboard/DashboardLayout/index';
import { Login } from './../renders/pages/Init/Login/index';

// Página inicial temporária do Painel para visualizarmos a montagem
const DashboardHome: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Visão Geral</h2>
      <div style={{ backgroundColor: 'var(--surface-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <p>Olá, <strong>{user?.displayName}</strong>! Bem-vindo ao painel principal.</p>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>Navegue pelo menu lateral para acessar suas ferramentas.</p>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const { user, loading, initAuthListener } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initAuthListener]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
        Carregando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />

        {/* Rotas Privadas Aninhadas dentro do Layout */}
        <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/" />}>
          <Route index element={<DashboardHome />} />
          {/* Futuras rotas entrarão aqui, ex: <Route path="grades" element={<GradesPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;