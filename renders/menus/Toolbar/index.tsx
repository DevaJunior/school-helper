import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useUIStore } from '../../../src/store/useUIStore';
import { useAuthStore } from '../../../src/store/useAuthStore';

const Toolbar: React.FC = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Função para extrair a inicial do nome
  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="toolbar-container">
      <div className="toolbar-left">
        <button 
          className="menu-button" 
          onClick={toggleSidebar}
          aria-label="Abrir menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="toolbar-logo">School<span>Helper</span></h1>
      </div>

      <div className="toolbar-right">
        <div className="user-info">
          <span className="user-name">{user?.displayName || 'Usuário'}</span>
          <div 
            className="user-avatar" 
            onClick={() => navigate('/dashboard/profile')}
            title="Ver meu perfil"
            style={{ cursor: 'pointer' }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{getInitial()}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;