import React, { useEffect, useState } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useToastStore } from '../../../../src/store/useToastStore';
import { useFeedStore } from '../../../../src/store/useFeedStore';

export const Overview: React.FC = () => {
  const { user } = useAuthStore();
  const { students, fetchStudents } = useGradesStore();
  const { posts, loading: loadingFeed, fetchPosts, createPost, isPosting } = useFeedStore();
  const addToast = useToastStore((state) => state.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', targetAudience: 'global' });

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchStudents();
    }
    fetchPosts();
  }, [user, fetchStudents, fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const success = await createPost({
      title: newPost.title,
      content: newPost.content,
      targetAudience: newPost.targetAudience,
      authorName: user.displayName || 'Usuário',
      authorRole: user.role
    });

    if (success) {
      addToast('Aviso publicado com sucesso no mural!', 'success');
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', targetAudience: 'global' });
    } else {
      addToast('Erro ao publicar o aviso.', 'error');
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
            ? 'Bem-vindo de volta! Fique de olho no mural abaixo para não perder nenhuma novidade.' 
            : 'Bem-vindo ao painel de controle. Gerencie suas turmas e comunique-se com os alunos.'}
        </p>
      </div>

      <div className="stats-grid">
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

      {/* SEÇÃO DO MURAL DE AVISOS */}
      <div className="feed-section">
        <div className="feed-header">
          <h2 className="feed-title">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Mural de Comunicados
          </h2>
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <button className="btn-new-post" onClick={() => setIsModalOpen(true)}>
              + Novo Aviso
            </button>
          )}
        </div>

        <div className="feed-list">
          {loadingFeed ? (
            <div className="feed-empty">Carregando mural...</div>
          ) : posts.length === 0 ? (
            <div className="feed-empty">Nenhum comunicado publicado ainda.</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="feed-card">
                <div className="feed-card-header">
                  <div className="feed-author-info">
                    <div className="feed-avatar">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="feed-author-name">{post.authorName}</span>
                      <span className="feed-author-role">
                        {post.authorRole === 'admin' ? 'Administração' : post.authorRole === 'teacher' ? 'Professor(a)' : 'Aluno'}
                      </span>
                    </div>
                  </div>
                  <span className="feed-date">{formatDate(post.createdAt)}</span>
                </div>
                <div className="feed-card-body">
                  <h3 className="feed-post-title">{post.title}</h3>
                  <p className="feed-post-content">{post.content}</p>
                </div>
                <div className="feed-card-footer">
                  <span className="feed-target">
                    Destino: {post.targetAudience === 'global' ? 'Toda a Escola' : 'Turma Específica'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Nova Postagem */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Publicar Aviso</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreatePost} className="feed-form">
              <div className="input-group">
                <label className="input-label">Título do Aviso</label>
                <input 
                  type="text" 
                  required
                  className="feed-input"
                  placeholder="Ex: Feriado nesta Sexta-Feira"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Público Alvo</label>
                <select 
                  className="feed-input"
                  value={newPost.targetAudience}
                  onChange={(e) => setNewPost({...newPost, targetAudience: e.target.value})}
                >
                  <option value="global">Global (Toda a Escola)</option>
                  <option value="classes">Apenas Turmas (Futuro Filtro)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Conteúdo</label>
                <textarea 
                  required
                  className="feed-textarea"
                  placeholder="Escreva os detalhes do aviso aqui..."
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isPosting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={isPosting}>
                  {isPosting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;