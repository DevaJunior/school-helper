import React, { useEffect } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';

const Grades: React.FC = () => {
  const { students, loading, fetchStudents } = useGradesStore();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="grades-container">
      <header className="grades-header">
        <h1 className="grades-title">Lançamento de Notas</h1>
        <p className="grades-subtitle">Gerencie e atualize o boletim dos alunos matriculados.</p>
      </header>

      <div className="grades-table-wrapper">
        {loading ? (
          <div className="loading-state">Carregando lista de alunos...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            Nenhum aluno encontrado no sistema no momento.
          </div>
        ) : (
          <table className="grades-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.uid}>
                  <td data-label="Aluno">
                    <div className="student-info">
                      <span className="student-name">{student.displayName}</span>
                      <span className="student-email">{student.email}</span>
                    </div>
                  </td>
                  <td data-label="Status">
                    {/* Placeholder para a próxima etapa */}
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pendente</span>
                  </td>
                  <td data-label="Ação">
                    <button 
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Editar Notas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Grades;