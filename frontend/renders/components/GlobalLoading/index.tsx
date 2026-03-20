import React from 'react';
import './styles.css';

export const GlobalLoading: React.FC = () => {
  return (
    <div className="global-loading-container">
      <div className="global-spinner"></div>
      <h2 className="global-loading-title">SchoolHelper</h2>
      <p className="global-loading-text">Conectando ao portal...</p>
    </div>
  );
};