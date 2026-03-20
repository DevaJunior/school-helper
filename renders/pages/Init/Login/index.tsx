import React, { useState } from 'react';
import './styles.css'; // Mantenha o seu arquivo de estilos
import { useAuthStore } from '../../../../src/store/useAuthStore';


// role: admin
// role: teacher
// role: student


export const Login: React.FC = () => {
  const { loginAsDemo } = useAuthStore();

  // Valores default para facilitar o teste dos avaliadores
  const [email, setEmail] = useState('aluno.schoolhelper@dws.com.br');
  const [password, setPassword] = useState('schoolhelper123');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Como é apenas para portfólio, ignoramos a verificação real no Firebase 
    // e logamos o usuário visitante diretamente.
    if (email === 'aluno.schoolhelper@dws.com.br' && password === 'schoolhelper123') {
      loginAsDemo();
    } else {
      alert('Credenciais de demonstração inválidas.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="login-logo-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 className="login-title">School<span>Helper</span></h1>
          <p className="login-subtitle">Gestão escolar inteligente e simplificada</p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Acesse sua conta</h2>
            <p>Faça login para entrar no portal educacional.</p>
          </div>

          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="input-group">
              <label>E-mail de Acesso</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-email-login">
              Entrar no Sistema
            </button>
          </form>

          <div className="login-divider">
            <span>ou</span>
          </div>

          {/* <button className="btn-google" onClick={loginWithGoogle}> */}
          <button className="btn-google">
            <div className="google-icon-wrapper">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span>Continuar com Google</span>
          </button>

          <div className="login-footer">
            <p>Ao continuar, você concorda com nossos Termos de Serviço e a Política de Privacidade do sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;