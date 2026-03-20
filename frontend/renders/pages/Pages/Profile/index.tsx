import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useToastStore } from '../../../../src/store/useToastStore';

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
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
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
      setAvatarFile(null); // Reseta o arquivo após salvar
    } else {
      addToast('Ocorreu um erro ao atualizar o perfil.', 'error');
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1 className="profile-title">Meu Perfil</h1>
        <p className="profile-subtitle">Gerencie suas informações pessoais e foto de perfil.</p>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <form onSubmit={handleSaveProfile} className="profile-form">

            <div className="profile-avatar-section">
              <div className="avatar-preview-container" onClick={handleTriggerFileInput}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview do Avatar" className="avatar-preview-img" />
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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden-file-input"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
              <div className="avatar-info">
                <h3>Foto de Perfil</h3>
                <p>Formatos suportados: JPG, PNG ou WEBP. Tamanho máximo: 2MB.</p>
                <button type="button" className="btn-change-avatar" onClick={handleTriggerFileInput}>
                  Escolher Imagem
                </button>
              </div>
            </div>

            <div className="profile-fields-section">
              <div className="input-group">
                <label className="input-label">Nome de Exibição</label>
                <input
                  type="text"
                  className="profile-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email de Cadastro (Apenas Leitura)</label>
                <input
                  type="email"
                  className="profile-input profile-input-disabled"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="input-group">
                <label className="input-label">Nível de Acesso (Apenas Leitura)</label>
                <input
                  type="text"
                  className="profile-input profile-input-disabled"
                  value={user?.role === 'admin' ? 'Administrador' : user?.role === 'teacher' ? 'Professor(a)' : 'Aluno(a)'}
                  disabled
                />
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save-profile" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Salvando Alterações...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;