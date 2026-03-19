import React from 'react';
import './styles.css';
import { useUIStore } from '../../../../src/store/useUIStore';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { useAuthStore } from '../../../../src/store/useAuthStore';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="header-container">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar} aria-label="Abrir menu">
          <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="header-logo">SchoolHelper</h1>
      </div>

      <div className="header-right">
        <ThemeToggle />
        {user && (
          <div className="user-info">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span className="user-name">{user.displayName || 'Usuário'}</span>
              <span className="user-role">{user.role}</span>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar do usuário" className="user-avatar" />
            ) : (
              <div className="user-avatar" style={{ backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};