# SchoolHelper | Plataforma Educacional Integrada

Uma plataforma educacional completa desenvolvida em React, projetada para conectar alunos, professores e a administração escolar em um único ambiente. Foco absoluto em performance, responsividade e separação de responsabilidades.

## 🌐 Deploy

A aplicação está disponível em:
👉 [Acessar SchoolHelper](https://school-helper-ecru.vercel.app)

---

## 🚀 Funcionalidades Principais (Em Desenvolvimento)

* **Sistema Multi-Perfil (RBAC):** Controle de acesso baseado em funções utilizando Firebase Authentication. Visões e permissões distintas para **Alunos** (visualização de notas e horários), **Professores** (lançamento de notas e faltas) e **Secretaria** (gestão de matrículas).
* **Modo Claro / Escuro (Theme Toggle):** Sistema de temas dinâmico implementado com variáveis CSS globais e persistência de estado.
* **Dashboards Responsivos:** Interfaces adaptáveis para qualquer dispositivo (Desktop, Tablet, Mobile), garantindo uma experiência de usuário (UX) perfeita em telas de 320px a monitores ultrawide.
* **Gerenciamento de Dados em Tempo Real:** Integração com Firebase Firestore para leitura e escrita instantânea de dados acadêmicos.

---

## 💻 Tecnologias e Arquitetura

Este projeto adota uma arquitetura rigorosa, focada na escalabilidade e na otimização de performance, não dependendo de pesados frameworks de UI:

* **React 18 & TypeScript:** Tipagem estática para um desenvolvimento seguro e previsível.
* **Vite:** Build tool ultrarrápida para uma experiência de desenvolvimento superior.
* **Zustand:** Gerenciamento de estado global leve e focado (utilizado para o controle de temas e estados complexos), evitando o *boilerplate* do Redux.
* **React Router v6:** Roteamento no lado do cliente (SPA) para navegação fluida entre os painéis.
* **CSS Puro (Component-Scoped):** Estilização feita inteiramente com CSS nativo. Cada componente possui seu próprio arquivo `styles.css` dedicado, garantindo que não haja vazamento ou conflito de estilos, mantendo o *bundle* limpo.
* **Firebase (BaaS):** Autenticação e Banco de Dados NoSQL (Firestore).

---

## 🛠️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/DevaJunior/school-helper.git](https://github.com/DevaJunior/school-helper.git)