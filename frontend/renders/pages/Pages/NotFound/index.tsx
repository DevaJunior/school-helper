import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon-wrapper">
          <svg className="notfound-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Página não encontrada</h2>
        
        <p className="notfound-text">
          Ops! Parece que você se perdeu. A página que você está procurando não existe, foi movida ou você não tem permissão para acessá-la.
        </p>
        
        <button className="btn-back-home" onClick={() => navigate('/')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
};