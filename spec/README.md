# Broadcast — Especificação do Projeto

## Visão do Produto

**Broadcast** é uma plataforma SaaS de disparo de mensagens. Cada cliente (usuário autenticado) gerencia suas próprias **conexões**, cada conexão possui **contatos**, e o cliente pode enviar ou agendar **mensagens** para contatos selecionados.

> O disparo é simulado (fake). Mensagens agendadas mudam automaticamente para "enviada" no horário programado via Cloud Function.

---

## Decisões Arquiteturais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Framework | React + TypeScript | Requisito do projeto |
| Bundler | Vite | Requisito — não usar CRA |
| UI Components | Material UI (MUI) | Requisito |
| Estilização | TailwindCSS | Requisito — complementar ao MUI |
| Auth | Firebase Auth (email/senha) | Requisito |
| Database | Firestore (flat, sem subcoleções) | Requisito |
| Real-time | `onSnapshot` do Firestore | Requisito |
| Backend | Firebase Cloud Functions | Requisito — agendar disparo |
| Hosting | Firebase Hosting | Requisito |
| Paradigma | Funcional (sem classes/OOP) | Requisito |
| Testes | Vitest + React Testing Library | Cobertura unitária e de integração |

---

## Modelo de Dados (Firestore — coleções flat)

```
┌─────────────────────────────────────────────────────────┐
│                      Firestore                          │
│                                                         │
│  connections          contacts            messages      │
│  ┌──────────────┐    ┌───────────────┐   ┌────────────┐│
│  │ id           │    │ id            │   │ id         ││
│  │ name         │    │ name          │   │ body       ││
│  │ userId       │    │ phone         │   │ contactIds ││
│  │ createdAt    │    │ connectionId  │   │ connectionId│
│  │ updatedAt    │    │ userId        │   │ userId     ││
│  └──────────────┘    │ createdAt     │   │ status     ││
│                      │ updatedAt     │   │ scheduledAt││
│                      └───────────────┘   │ sentAt     ││
│                                          │ createdAt  ││
│                                          │ updatedAt  ││
│                                          └────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Isolamento SaaS**: Todo documento carrega `userId`. Queries sempre filtram por `userId` do usuário autenticado. Security Rules reforçam no servidor.

---

## Fases do Projeto

| Fase | Nome | Descrição | Spec |
|------|------|-----------|------|
| 0 | Setup do Projeto | Scaffold Vite, Firebase, MUI, Tailwind, estrutura de pastas | [phase-0-setup.md](./phase-0-setup.md) |
| 1 | Autenticação | Cadastro, login, logout, proteção de rotas | [phase-1-auth.md](./phase-1-auth.md) |
| 2 | Conexões | CRUD de conexões com real-time | [phase-2-connections.md](./phase-2-connections.md) |
| 3 | Contatos | CRUD de contatos vinculados a conexão | [phase-3-contacts.md](./phase-3-contacts.md) |
| 4 | Mensagens | Envio, agendamento, filtros, seleção de contatos | [phase-4-messages.md](./phase-4-messages.md) |
| 5 | Cloud Functions | Função agendada para disparar mensagens | [phase-5-cloud-functions.md](./phase-5-cloud-functions.md) |
| 6 | Security Rules e Deploy | Regras Firestore + deploy Firebase Hosting | [phase-6-deploy.md](./phase-6-deploy.md) |

---

## Estrutura de Pastas

```
broadcast/
├── spec/                    ← Especificações (este diretório)
├── web/                     ← Frontend React + TypeScript
│   ├── src/
│   │   ├── components/      ← Componentes reutilizáveis
│   │   ├── pages/           ← Páginas / telas
│   │   ├── hooks/           ← Custom hooks (auth, firestore)
│   │   ├── services/        ← Integração Firebase (queries, mutations)
│   │   ├── types/           ← Tipos TypeScript
│   │   ├── lib/             ← Config Firebase, utilitários
│   │   └── routes/          ← Configuração de rotas
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── functions/               ← Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
├── firebase.json
├── firestore.rules
├── .firebaserc
└── README.md
```

---

## Convenções de Código

- **Sem classes**: todo código segue paradigma funcional
- **Componentes**: function components com hooks
- **Nomes de arquivos**: `kebab-case.ts` / `kebab-case.tsx`
- **Tipos**: definidos em `types/` e exportados por barrel files
- **Commits atômicos**: um commit por mudança lógica completa
- **Mensagens de commit**: `fase-X: descrição curta` (ex: `fase-1: implementa login com firebase auth`)
