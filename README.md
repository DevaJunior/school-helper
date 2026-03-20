# SchoolHelper | Plataforma Educacional Integrada

Uma plataforma educacional completa desenvolvida em React, projetada para conectar alunos, professores e a administração escolar em um único ambiente. Foco absoluto em performance, responsividade e separação de responsabilidades.

## 🌐 Deploy e Acesso

A aplicação está hospedada e em pleno funcionamento na Vercel:
👉 **[Acessar SchoolHelper](https://school-helper-ecru.vercel.app)**

**Deseja testar a plataforma sem usar sua conta Google?** A tela inicial conta com um recurso de *Login de Demonstração*. As credenciais já vêm preenchidas por padrão. Basta clicar em **"Entrar no Sistema"** para acessar o painel de um aluno com dados de teste autogerados (notas, horários e avisos já populados no Firebase).

---

## 🚀 Funcionalidades Principais

* **Sistema Multi-Perfil (RBAC):** Controle de acesso baseado em funções utilizando Firebase Authentication. Visões e permissões distintas para **Alunos** (visualização de notas e horários), **Professores** (lançamento de notas e faltas) e **Secretaria** (gestão de matrículas).
* **Progressive Web App (PWA):** A aplicação pode ser instalada diretamente no dispositivo (desktop ou mobile), oferecendo suporte a funcionamento offline e uma experiência nativa.
* **Modo Claro / Escuro (Theme Toggle):** Sistema de temas dinâmico implementado com variáveis CSS globais e persistência de estado no local storage.
* **Dashboards Responsivos:** Interfaces adaptáveis para qualquer dispositivo (Desktop, Tablet, Mobile), garantindo uma experiência de usuário (UX) perfeita em telas de 320px a monitores ultrawide.
* **Gerenciamento de Dados em Tempo Real:** Integração completa com Firebase Firestore para leitura e escrita instantânea de dados acadêmicos, incluindo um script inteligente de *seeding* para geração automática de base de testes.

---

## 💻 Tecnologias e Arquitetura

Este projeto adota uma arquitetura rigorosa, focada na escalabilidade e na otimização de performance, não dependendo de pesados frameworks de UI:

* **React 18 & TypeScript:** Tipagem estática para um desenvolvimento seguro, robusto e previsível.
* **Vite:** Build tool ultrarrápida que substitui o Webpack, oferecendo carregamento instantâneo via Hot Module Replacement (HMR).
* **Zustand:** Gerenciamento de estado global leve e focado (utilizado para o controle de temas, autenticação e dados complexos), evitando o *boilerplate* do Redux.
* **React Router v6:** Roteamento no lado do cliente (SPA) para navegação fluida e sem recarregamento da página.
* **CSS Puro (Component-Scoped):** Estilização feita inteiramente com CSS nativo e moderno. Cada componente possui seu próprio arquivo `styles.css` dedicado, garantindo que não haja vazamento ou conflito de estilos.
* **Firebase (BaaS):** Responsável por lidar com as regras de Auth, Storage de arquivos e Banco de Dados NoSQL (Firestore).
* **Vercel CLI:** Utilizada no pipeline de infraestrutura para CI/CD automático, garantindo roteamento SPA impecável (evitando erros 404) a cada push no repositório.

---

## 🛠️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/DevaJunior/school-helper.git](https://github.com/DevaJunior/school-helper.git)