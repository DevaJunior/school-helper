import React, { useEffect } from 'react';
import './styles.css';
import { useAdminStore } from '../../../../src/store/useAdminStore';
import { useAuthStore, UserRole } from '../../../../src/store/useAuthStore';

export const AdminPanel: React.FC = () => {
  const { user } = useAuthStore();
  const { allUsers, loading, isUpdating, fetchAllUsers, updateUserRole } = useAdminStore();

  useEffect(() => {
    // Busca os usuários apenas se quem estiver acessando for admin
    if (user?.role === 'admin') {
      fetchAllUsers();
    }
  }, [user, fetchAllUsers]);

  // Trava de segurança no Frontend
  if (user?.role !== 'admin') {
    return (
      <div className="admin-container">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para visualizar esta página.</p>
        </div>
      </div>
    );
  }

  const handleRoleChange = async (uid: string, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return;
    
    // Evita que o único admin remova seu próprio acesso acidentalmente
    if (uid === user.uid && newRole !== 'admin') {
      const confirmSelfDemote = window.confirm("Atenção: Você está prestes a remover seus próprios privilégios de administrador. Deseja continuar?");
      if (!confirmSelfDemote) return;
    }

    const success = await updateUserRole(uid, newRole as UserRole);
    if (success) {
      alert('Nível de acesso atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar. Tente novamente.');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Painel de Administração</h1>
        <p className="admin-subtitle">Gerencie os usuários e os níveis de acesso do sistema.</p>
      </header>

      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--primary-color)' }}>
            Carregando usuários...
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Acesso Atual</th>
                <th>Alterar Permissão</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((appUser) => (
                <tr key={appUser.uid}>
                  <td data-label="Usuário">
                    <div className="user-info">
                      <span className="user-name">{appUser.displayName}</span>
                      <span className="user-email">{appUser.email}</span>
                    </div>
                  </td>
                  <td data-label="Acesso Atual">
                    <span className={`role-badge role-${appUser.role}`}>
                      {appUser.role === 'teacher' ? 'Professor' : appUser.role === 'student' ? 'Aluno' : 'Admin'}
                    </span>
                  </td>
                  <td data-label="Alterar Permissão">
                    <select 
                      className="role-select"
                      value={appUser.role}
                      disabled={isUpdating}
                      onChange={(e) => handleRoleChange(appUser.uid, appUser.role, e.target.value)}
                    >
                      <option value="student">Aluno</option>
                      <option value="teacher">Professor</option>
                      <option value="admin">Administrador</option>
                    </select>
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

export default AdminPanel;