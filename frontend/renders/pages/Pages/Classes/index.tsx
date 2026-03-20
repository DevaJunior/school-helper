import React, { useEffect, useState } from 'react';
import './styles.css';
import { useClassesStore } from '../../../../src/store/useAttendanceStore.ts';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useToastStore } from '../../../../src/store/useToastStore';

export const Classes: React.FC = () => {
  const { classes, loading, fetchClasses, createClass, isSaving } = useClassesStore();
  const { user } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const success = await createClass(newClassName);
    if (success) {
      addToast('Turma criada com sucesso!', 'success');
      setIsModalOpen(false);
      setNewClassName('');
    } else {
      addToast('Erro ao criar a turma.', 'error');
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="classes-container">
      <header className="classes-header">
        <div className="classes-title-wrapper">
          <h1 className="classes-title">Gestão de Turmas</h1>
          <p className="classes-subtitle">Visualize e gerencie as turmas da instituição.</p>
        </div>
        
        <div className="classes-actions">
          <div className="classes-search-container">
            <svg className="classes-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              className="classes-search-input" 
              placeholder="Buscar turma..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {user?.role === 'admin' && (
            <button className="btn-new-class" onClick={() => setIsModalOpen(true)}>
              + Nova Turma
            </button>
          )}
        </div>
      </header>

      <div className="classes-grid">
        {loading ? (
          <div className="classes-message">Carregando turmas...</div>
        ) : filteredClasses.length === 0 ? (
          <div className="classes-message">Nenhuma turma encontrada.</div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.id} className="class-card">
              <div className="class-card-header">
                <h3 className="class-name">{cls.name}</h3>
              </div>
              <div className="class-stats">
                <div className="stat">
                  <span className="stat-value">{cls.studentIds.length}</span>
                  <span className="stat-label">Alunos</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{cls.teacherIds.length}</span>
                  <span className="stat-label">Professores</span>
                </div>
              </div>
              <button className="btn-view-class">Ver Detalhes</button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="classes-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="classes-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="classes-modal-header">
              <h2>Criar Nova Turma</h2>
              <button className="classes-close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateClass}>
              <div className="classes-input-group">
                <label>Nome da Turma (Ex: 1º Ano A)</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  placeholder="Digite o nome da turma..."
                />
              </div>
              <div className="classes-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? 'Criando...' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;