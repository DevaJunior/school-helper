import React, { useEffect } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';

export const MyGrades: React.FC = () => {
  const { user } = useAuthStore();
  const { myGrades, loading, fetchMyGrades } = useGradesStore();

  useEffect(() => {
    if (user?.uid) {
      fetchMyGrades(user.uid);
    }
  }, [user, fetchMyGrades]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="my-grades-container">Carregando boletim...</div>;
  }

  // Cálculos de média
  const average = myGrades
    ? (myGrades.grade1 + myGrades.grade2 + myGrades.grade3 + myGrades.grade4) / 4
    : 0;

  const isApproved = average >= 60; // Média de aprovação (exemplo: 60)

  // Obtém a data atual formatada para o documento
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="my-grades-container">

      {/* CABEÇALHO OFICIAL (Invisível na tela, visível apenas no PDF) */}
      <div className="print-only-header">
        <h2>SchoolHelper - Portal Educacional</h2>
        <p>Documento Oficial de Histórico de Notas</p>
        <p style={{ marginTop: '8px' }}><strong>Aluno(a):</strong> {user?.displayName}</p>
        <p><strong>Email de Registro:</strong> {user?.email}</p>
        <p><strong>Data de Emissão:</strong> {currentDate}</p>
      </div>

      <header className="my-grades-header">
        <div className="header-titles">
          <h1 className="my-grades-title">Meu Boletim</h1>
          <p className="my-grades-subtitle">Acompanhe o seu desempenho acadêmico no ano letivo.</p>
        </div>

        {/* BOTÃO DE IMPRESSÃO */}
        {myGrades && (
          <button className="btn-print" onClick={handlePrint} title="Salvar em PDF ou Imprimir">
            <svg className="print-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Exportar PDF
          </button>
        )}
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