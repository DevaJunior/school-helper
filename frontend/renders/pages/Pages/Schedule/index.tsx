import React from 'react';
import './styles.css';

const Schedule: React.FC = () => {
  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h1 className="schedule-title">Quadro de Horários</h1>
        <p className="schedule-subtitle">Visualize as aulas e compromissos da semana.</p>
      </header>

      <div className="schedule-content">
        <svg className="schedule-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="schedule-empty">
          O módulo de horários está em fase de estruturação. Em breve você poderá visualizar e gerenciar sua grade curricular aqui.
        </p>
      </div>
    </div>
  );
};

export default Schedule;