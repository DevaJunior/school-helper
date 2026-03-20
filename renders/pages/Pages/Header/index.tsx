import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useUIStore } from '../../../../src/store/useUIStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

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
        {user && (
          <div className="user-info-wrapper" onClick={handleProfileClick} title="Ir para Meu Perfil">
            <div className="user-text-info">
              <span className="user-name">{user.displayName || 'Usuário'}</span>
              <span className="user-role">
                {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Professor' : 'Aluno'}
              </span>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar do usuário" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};