import React, { useEffect } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';

const MyGrades: React.FC = () => {
  const { user } = useAuthStore();
  const { myGrades, loading, fetchMyGrades } = useGradesStore();

  useEffect(() => {
    if (user?.uid) {
      fetchMyGrades(user.uid);
    }
  }, [user, fetchMyGrades]);

  if (loading) {
    return <div className="my-grades-container">Carregando boletim...</div>;
  }

  // Cálculos de média
  const average = myGrades 
    ? (myGrades.grade1 + myGrades.grade2 + myGrades.grade3 + myGrades.grade4) / 4 
    : 0;
  
  const isApproved = average >= 60; // Média de aprovação (exemplo: 60)

  return (
    <div className="my-grades-container">
      <header className="my-grades-header">
        <h1 className="my-grades-title">Meu Boletim</h1>
        <p className="my-grades-subtitle">Acompanhe o seu desempenho acadêmico no ano letivo.</p>
      </header>

      {!myGrades ? (
        <div className="no-grades-message">
          <p>Nenhuma nota foi lançada no seu boletim ainda.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.8 }}>Aguarde a atualização dos seus professores.</p>
        </div>
      ) : (
        <>
          <div className="grades-grid">
            <div className="grade-card">
              <span className="bimester-label">1º Bimestre</span>
              <span className="bimester-value">{myGrades.grade1.toFixed(1)}</span>
            </div>
            <div className="grade-card">
              <span className="bimester-label">2º Bimestre</span>
              <span className="bimester-value">{myGrades.grade2.toFixed(1)}</span>
            </div>
            <div className="grade-card">
              <span className="bimester-label">3º Bimestre</span>
              <span className="bimester-value">{myGrades.grade3.toFixed(1)}</span>
            </div>
            <div className="grade-card">
              <span className="bimester-label">4º Bimestre</span>
              <span className="bimester-value">{myGrades.grade4.toFixed(1)}</span>
            </div>
          </div>

          <div className="average-section">
            <span className="average-label">Média Final Calculada</span>
            <span className="average-value" style={{ color: isApproved ? '#34A853' : '#EA4335' }}>
              {average.toFixed(1)}
            </span>
            <span className={`status-badge ${isApproved ? 'status-approved' : 'status-reproved'}`}>
              {isApproved ? 'Aprovado' : 'Reprovado'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MyGrades;