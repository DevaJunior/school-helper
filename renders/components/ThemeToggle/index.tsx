import React from 'react';
import './styles.css';
import { useThemeStore } from '../../../src/store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button className="toggle-button" onClick={toggleTheme} aria-label="Alternar Tema">
      <span className="toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
      <span className="toggle-text">{theme === 'light' ? 'Escuro' : 'Claro'}</span>
    </button>
  );
};