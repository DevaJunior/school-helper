import React, { useEffect, useState } from 'react';
import './styles.css';
import { useGradesStore, type Student } from '../../../../src/store/useGradesStore';

export const Grades: React.FC = () => {
  const { students, loading, fetchStudents, saveGrades, isSaving } = useGradesStore();
  
  // Estados locais
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradesForm, setGradesForm] = useState({ grade1: 0, grade2: 0, grade3: 0, grade4: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setGradesForm({ grade1: 0, grade2: 0, grade3: 0, grade4: 0 });
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const success = await saveGrades(selectedStudent.uid, gradesForm);
    
    if (success) {
      alert(`Notas de ${selectedStudent.displayName} salvas com sucesso!`);
      handleCloseModal();
    } else {
      alert('Houve um erro ao salvar as notas. Tente novamente.');
    }
  };

  // Lógica de Filtro: Filtra por nome ou email, ignorando maiúsculas/minúsculas
  const filteredStudents = students.filter(student => 
    student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grades-container">
      <header className="grades-header">
        <div className="grades-title-wrapper">
          <h1 className="grades-title">Lançamento de Notas</h1>
          <p className="grades-subtitle">Gerencie e atualize o boletim dos alunos matriculados.</p>
        </div>
        
        {/* Barra de Pesquisa */}
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar aluno por nome ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grades-table-wrapper">
        {loading ? (
          <div className="loading-state">Carregando lista de alunos...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            Nenhum aluno encontrado no sistema no momento.
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            Nenhum aluno corresponde à sua busca "{searchTerm}".
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
              {filteredStudents.map((student) => (
                <tr key={student.uid}>
                  <td data-label="Aluno">
                    <div className="student-info">
                      <span className="student-name">{student.displayName}</span>
                      <span className="student-email">{student.email}</span>
                    </div>
                  </td>
                  <td data-label="Status">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pendente</span>
                  </td>
                  <td data-label="Ação">
                    <button 
                      onClick={() => handleOpenModal(student)}
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

      {/* Modal de Lançamento de Notas */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Notas: {selectedStudent.displayName}</h3>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="grades-form">
              <div className="input-group">
                <label className="input-label">1º Bimestre</label>
                <input 
                  type="number" 
                  min="0" max="100" step="0.1" required
                  className="grade-input"
                  value={gradesForm.grade1}
                  onChange={(e) => setGradesForm({...gradesForm, grade1: Number(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">2º Bimestre</label>
                <input 
                  type="number" 
                  min="0" max="100" step="0.1" required
                  className="grade-input"
                  value={gradesForm.grade2}
                  onChange={(e) => setGradesForm({...gradesForm, grade2: Number(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">3º Bimestre</label>
                <input 
                  type="number" 
                  min="0" max="100" step="0.1" required
                  className="grade-input"
                  value={gradesForm.grade3}
                  onChange={(e) => setGradesForm({...gradesForm, grade3: Number(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">4º Bimestre</label>
                <input 
                  type="number" 
                  min="0" max="100" step="0.1" required
                  className="grade-input"
                  value={gradesForm.grade4}
                  onChange={(e) => setGradesForm({...gradesForm, grade4: Number(e.target.value)})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={isSaving}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Notas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;