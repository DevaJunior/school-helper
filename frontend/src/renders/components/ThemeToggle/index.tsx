import React from 'react';
import './styles.css';
import { useThemeStore } from '../../../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button className="toggle-button" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Mudar para Escuro' : '☀️ Mudar para Claro'}
    </button>
  );
};