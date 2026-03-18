import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css'
import { ThemeToggle } from './renders/components/ThemeToggle';
import { useThemeStore } from './store/useThemeStore';

// Componente temporário para testarmos a fundação
const TempHome: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
    <h1>Bem-vindo ao SchoolHelper</h1>
    <p>A fundação da aplicação foi concluída com sucesso.</p>
    <ThemeToggle />
  </div>
);

export const App: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  // Efeito colateral focado em performance para alterar o atributo raiz no HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TempHome />} />
        {/* Rotas futuras entrarão aqui */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;