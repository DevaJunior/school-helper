import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useToastStore } from '../../../../src/store/useToastStore';
import { ThemeToggle } from '../../../components/ThemeToggle';

export const Profile: React.FC = () => {
  const { user, updateUserProfile, isUpdatingProfile } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setAvatarPreview(user.photoURL || null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('A imagem deve ter no máximo 2MB.', 'warning');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      addToast('O nome de exibição não pode estar vazio.', 'warning');
      return;
    }

    const success = await updateUserProfile(displayName, avatarFile);

    if (success) {
      addToast('Perfil atualizado com sucesso!', 'success');
      setAvatarFile(null);
    } else {
      addToast('Ocorreu um erro ao atualizar o perfil.', 'error');
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1 className="profile-title">Meu Perfil</h1>
        <p className="profile-subtitle">Gerencie suas informações pessoais e preferências do sistema.</p>
      </header>

      <div className="profile-content-grid">
        {/* Card de Dados Pessoais */}
        <div className="profile-card">
          <h2 className="section-title">Dados Pessoais</h2>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="profile-avatar-section">
              <div className="avatar-preview-container" onClick={handleTriggerFileInput}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {displayName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="avatar-overlay">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden-file-input" accept="image/*" onChange={handleFileChange} />
              <div className="avatar-info">
                <h3>Foto de Perfil</h3>
                <button type="button" className="btn-change-avatar" onClick={handleTriggerFileInput}>
                  Trocar Imagem
                </button>
              </div>
            </div>

            <div className="profile-fields-section">
              <div className="input-group">
                <label className="input-label">Nome de Exibição</label>
                <input type="text" className="profile-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>

              <div className="input-group">
                <label className="input-label">Email (Apenas Leitura)</label>
                <input type="email" className="profile-input profile-input-disabled" value={user?.email || ''} disabled />
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save-profile" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>

        {/* Card de Preferências / Settings */}
        <div className="profile-card settings-card">
          <h2 className="section-title">Preferências</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Tema do Sistema</span>
                <span className="setting-desc">Alternar entre modo claro e escuro</span>
              </div>
              <ThemeToggle />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Notificações</span>
                <span className="setting-desc">Alertas de atividades e mensagens</span>
              </div>
              <span className="badge-soon">Em breve</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;