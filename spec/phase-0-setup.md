# Fase 0 — Setup do Projeto

## Objetivo

Criar a estrutura base do projeto com todas as ferramentas configuradas e funcionais, prontas para desenvolvimento.

---

## Contexto de Negócio

Antes de desenvolver qualquer funcionalidade, o projeto precisa de uma base sólida: build rápido (Vite), componentes consistentes (MUI), estilização flexível (Tailwind) e integração com o Firebase configurada.

---

## Entregáveis

### 0.1 — Scaffold do Frontend (`web/`)

**Descrição**: Criar o projeto React + TypeScript com Vite.

**Critérios de Aceite**:
- [ ] Projeto criado com `npm create vite@latest` (template `react-ts`)
- [ ] `npm run dev` inicia o servidor de desenvolvimento sem erros
- [ ] TypeScript strict mode habilitado

**Commit**: `fase-0: scaffold vite react-ts`

---

### 0.2 — Configurar TailwindCSS

**Descrição**: Instalar e configurar TailwindCSS no projeto Vite.

**Critérios de Aceite**:
- [ ] TailwindCSS v3 instalado e configurado
- [ ] `tailwind.config.js` com `content` apontando para `./src/**/*.{ts,tsx}`
- [ ] Diretivas `@tailwind base/components/utilities` no CSS global
- [ ] Classes Tailwind funcionam em componentes React

**Commit**: `fase-0: configura tailwindcss`

---

### 0.3 — Configurar Material UI

**Descrição**: Instalar MUI e configurar tema base.

**Critérios de Aceite**:
- [ ] `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` instalados
- [ ] `ThemeProvider` configurado no `App.tsx` com tema padrão
- [ ] `CssBaseline` aplicado
- [ ] Um componente MUI renderiza corretamente (ex: `<Button>`)
- [ ] MUI e Tailwind coexistem sem conflitos (Tailwind preflight ajustado se necessário)

**Commit**: `fase-0: configura material ui`

---

### 0.4 — Configurar Firebase no Frontend

**Descrição**: Instalar SDK Firebase e configurar inicialização.

**Critérios de Aceite**:
- [ ] `firebase` SDK instalado
- [ ] Arquivo `src/lib/firebase.ts` exporta instâncias de `app`, `auth`, `db` (Firestore)
- [ ] Configuração Firebase via variáveis de ambiente (`.env` com prefixo `VITE_`)
- [ ] `.env.example` criado com as variáveis necessárias (sem valores reais)
- [ ] `.env` adicionado ao `.gitignore`

**Commit**: `fase-0: configura firebase sdk`

---

### 0.5 — Scaffold das Cloud Functions (`functions/`)

**Descrição**: Criar a estrutura da pasta de Cloud Functions.

**Critérios de Aceite**:
- [ ] Pasta `functions/` com `package.json`, `tsconfig.json`
- [ ] `firebase-functions` e `firebase-admin` como dependências
- [ ] Arquivo `src/index.ts` com export vazio (placeholder)
- [ ] Build compila sem erros

**Commit**: `fase-0: scaffold cloud functions`

---

### 0.6 — Configurar Vitest

**Descrição**: Instalar e configurar framework de testes.

**Critérios de Aceite**:
- [ ] `vitest` e `@testing-library/react` instalados
- [ ] `vite.config.ts` configurado com plugin de test
- [ ] `npm run test` executa sem erros
- [ ] Um teste smoke passa (ex: renderiza `<App />`)

**Commit**: `fase-0: configura vitest`

---

### 0.7 — Configurar React Router

**Descrição**: Instalar e configurar roteamento.

**Critérios de Aceite**:
- [ ] `react-router-dom` v6 instalado
- [ ] `BrowserRouter` configurado no `main.tsx`
- [ ] Rotas placeholder criadas: `/login`, `/`, `/connections`, `/connections/:id/contacts`, `/connections/:id/messages`
- [ ] Página 404 para rotas inexistentes

**Commit**: `fase-0: configura react router`

---

## Estrutura Final da Fase

```
web/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   └── firebase.ts
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── home.tsx
│   │   └── not-found.tsx
│   ├── routes/
│   │   └── index.tsx
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vite.config.ts
└── package.json

functions/
├── src/
│   └── index.ts
├── tsconfig.json
└── package.json
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `app.test.tsx` | Smoke | `<App />` renderiza sem crash |
| `firebase.test.ts` | Unit | Exportações de `firebase.ts` existem e são do tipo correto |
