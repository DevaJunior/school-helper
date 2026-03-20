import React, { useEffect, useState } from 'react';
import './styles.css';
import { useAdminStore, type AppUser } from '../../../../src/store/useAdminStore';
import type { UserRole } from '../../../../src/store/useAuthStore';
import { useToastStore } from '../../../../src/store/useToastStore';

export const AdminPanel: React.FC = () => {
  const { allUsers, loading, fetchAllUsers, updateUserRole, isUpdating } = useAdminStore();
  // Inicialização do Toast
  const addToast = useToastStore((state) => state.addToast);

  // Estados Locais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('student');

  // Busca os usuários ao montar o componente
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Lógica da Barra de Pesquisa
  const filteredUsers = allUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Controles do Modal
  const handleOpenModal = (user: AppUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Ação de Salvar Cargo
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const success = await updateUserRole(selectedUser.uid, newRole);

    if (success) {
      // SUBSTITUÍDO: alert nativo por Toast de Sucesso
      addToast(`Cargo de ${selectedUser.displayName} atualizado com sucesso!`, 'success');
      handleCloseModal();
    } else {
      // SUBSTITUÍDO: alert nativo por Toast de Erro
      addToast('Houve um erro ao atualizar o cargo. Tente novamente.', 'error');
    }
  };

  // Tradutor de Cargos para exibição visual
  const translateRole = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Professor';
      case 'student': return 'Aluno';
      default: return role;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title-wrapper">
          <h1 className="admin-title">Painel Administrativo</h1>
          <p className="admin-subtitle">Gerencie os usuários e seus níveis de acesso ao sistema.</p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="admin-search-container">
          <svg className="admin-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="admin-table-wrapper">
        {loading ? (
          <div className="admin-loading-state">Carregando usuários do sistema...</div>
        ) : allUsers.length === 0 ? (
          <div className="admin-empty-state">
            Nenhum usuário encontrado no banco de dados.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty-state">
            Nenhum usuário corresponde à sua busca "{searchTerm}".
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo Atual</th>
                <th>ID do Sistema</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid}>
                  <td data-label="Usuário">
                    <div className="admin-user-info">
                      <span className="admin-user-name">{user.displayName}</span>
                      <span className="admin-user-email">{user.email}</span>
                    </div>
                  </td>
                  <td data-label="Cargo Atual">
                    <span className={`role-badge role-${user.role}`}>
                      {translateRole(user.role)}
                    </span>
                  </td>
                  <td data-label="ID do Sistema">
                    <span className="admin-user-id" title={user.uid}>{user.uid.substring(0, 8)}...</span>
                  </td>
                  <td data-label="Ações">
                    <button
                      className="btn-edit-role"
                      onClick={() => handleOpenModal(user)}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar Acesso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Edição de Cargo */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Editar Permissões</h3>
              <button className="admin-close-button" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSaveRole} className="admin-role-form">
              <div className="admin-user-preview">
                <strong>Usuário:</strong> {selectedUser.displayName} <br />
                <small>{selectedUser.email}</small>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">Nível de Acesso</label>
                <select
                  className="admin-role-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  required
                >
                  <option value="student">Aluno (Acesso Padrão)</option>
                  <option value="teacher">Professor (Lança Notas)</option>
                  <option value="admin">Administrador (Acesso Total)</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-cancel" onClick={handleCloseModal} disabled={isUpdating}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-save" disabled={isUpdating}>
                  {isUpdating ? 'Atualizando...' : 'Confirmar Alteração'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;