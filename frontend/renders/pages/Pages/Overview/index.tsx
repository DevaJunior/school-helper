import React, { useEffect } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';

export const Overview: React.FC = () => {
  const { user } = useAuthStore();
  const { students, fetchStudents } = useGradesStore();

  // Se for professor/admin, busca a lista de alunos para mostrar na estatística
  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1 className="overview-title">Visão Geral</h1>
        <p className="overview-subtitle">Acompanhe os resumos e atalhos da sua conta.</p>
      </header>

      <div className="welcome-card">
        <h2 className="welcome-title">Olá, {user?.displayName?.split(' ')[0]}! 👋</h2>
        <p className="welcome-text">
          {user?.role === 'student' 
            ? 'Bem-vindo de volta! Acesse seu boletim para ver suas últimas notas.' 
            : 'Bem-vindo ao painel de controle. Gerencie suas turmas e lançamentos.'}
        </p>
      </div>

      <div className="stats-grid">
        {/* Card renderizado apenas para professores/admins */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Alunos Matriculados</span>
              <span className="stat-value">{students.length}</span>
            </div>
          </div>
        )}

        {/* Card genérico de Perfil para todos */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Nível de Acesso</span>
            <span className="stat-value" style={{ textTransform: 'capitalize' }}>
              {user?.role === 'teacher' ? 'Professor' : user?.role === 'student' ? 'Aluno' : user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};