# Broadcast - Plataforma SaaS de Disparo de Mensagens

Sistema SaaS para envio e agendamento de mensagens (disparo simulado) com isolamento total por cliente (multi-tenant), atualizacao em tempo real com Firestore e processamento agendado com Cloud Functions.

> **Ambiente em Producao (Live Demo):** [https://broadcast-saas-7eab2.web.app](https://broadcast-saas-7eab2.web.app)

---

## 1. Visao Geral e Regras de Negocio

- **SaaS Multi-tenant**: Cada usuario autenticado tem sua propria area de trabalho isolada. Um cliente nao pode visualizar nem manipular dados de outro cliente.
- **Conexoes**: Cada cliente gerencia conexoes de comunicacao (ex: WhatsApp, Telegram, SMS), contendo apenas seu nome.
- **Contatos**: Cada conexao possui seus proprios contatos (nome e telefone formatado no padrao nacional `(XX) XXXXX-XXXX`).
- **Mensagens**:
  - Selecao multipla de contatos destinatarios com atalho "Selecionar todos".
  - Envio imediato simulado (status `sent`, `sentAt` preenchido).
  - Agendamento para data/horario futuro (status `scheduled`, `scheduledAt` preenchido).
  - Filtro em tempo real por status (`Todas`, `Enviadas`, `Agendadas`).
  - Edicao permitida exclusivamente para mensagens que ainda estao no status agendado.
- **Mecanismo de Disparo de Mensagens Agendadas**:
  - **Backend Serverless (Cloud Functions)**: Funcao agendada `processScheduledMessages` executada a cada minuto (`* * * * *`, timezone `America/Sao_Paulo`) via Cloud Scheduler de 2a geracao. Busca mensagens agendadas vencidas (`scheduledAt <= now`) e atualiza em lotes (`batch`) para `sent`.
  - **Fallback Reativo no Frontend**: O hook `useMessages` inclui verificacao ciclica em tempo real para permitir a transicao automatica das mensagens na interface caso o projeto opere no plano gratuito Spark do Firebase.
- **Firestore Flat Collections**: Estrutura sem subcolecoes (colecoes raiz: `connections`, `contacts`, `messages`), garantindo escalabilidade e isolamento via indices compostos e Security Rules no servidor.
- **Paradigma Funcional**: Implementacao orientada a funcoes puras, hooks personalizados e composicao de componentes sem utilizacao de classes.

---

## 2. Tecnologias Utilizadas

- **Frontend (`web/`)**:
  - React 19 + TypeScript
  - Vite (com *code-splitting* modular para `vendor`, `mui` e `firebase`)
  - Material UI (MUI) v9
  - TailwindCSS v3
  - React Router DOM v7
  - Firebase SDK v12 (Auth, Firestore)
  - Vitest + Testing Library
- **Backend / Serverless (`functions/`)**:
  - Firebase Functions v6 (2nd Gen Scheduler)
  - Firebase Admin SDK v12
  - Vitest
- **Infraestrutura Cloud**:
  - Firebase Hosting (SPA rewrite habilitado)
  - Cloud Firestore (Security Rules *deny-by-default* e indices compostos)
  - Cloud Scheduler + Cloud Functions

---

## 3. Estrutura do Repositorio

```
broadcast/
├── spec/                       # Especificacoes orientadas a produto e engenharia
│   ├── README.md               # Indice master das especificacoes
│   ├── phase-0-setup.md        # Fase 0: Setup e scaffolding
│   ├── phase-1-auth.md         # Fase 1: Autenticacao e protecao de rotas
│   ├── phase-2-connections.md  # Fase 2: CRUD de conexoes com tempo real
│   ├── phase-3-contacts.md     # Fase 3: CRUD de contatos vinculados
│   ├── phase-4-messages.md     # Fase 4: Envio, agendamento e filtros
│   ├── phase-5-cloud-functions.md # Fase 5: Cloud Function cron de disparo
│   └── phase-6-deploy.md       # Fase 6: Security rules e deploy
├── web/                        # Aplicacao Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizaveis e dialogs
│   │   ├── hooks/              # Custom hooks reativos (useAuth, useConnections, useContacts, useMessages)
│   │   ├── lib/                # Inicializacao do Firebase
│   │   ├── pages/              # Paginas (Login, Register, Conexoes, Contatos, Mensagens, 404)
│   │   ├── routes/             # Configuracao de rotas publicas e privadas
│   │   ├── services/           # Servicos de integracao com Firestore e Auth
│   │   ├── types/              # Interfaces e tipos de dominio TypeScript
│   │   ├── utils/              # Formatadores e utilitarios (telefone, data)
│   │   ├── theme.ts            # Tema customizado Material UI
│   │   ├── App.tsx             # Componente raiz
│   │   └── main.tsx            # Ponto de entrada React
│   ├── package.json
│   └── vite.config.ts
├── functions/                  # Cloud Functions Serverless
│   ├── src/
│   │   ├── index.ts            # Funcao agendada processScheduledMessages
│   │   └── index.test.ts       # Testes unitarios da funcao com mock do Firestore
│   ├── package.json
│   └── tsconfig.json
├── firebase.json               # Configuracao de hosting, functions e firestore
├── firestore.rules             # Regras de seguranca com isolamento estrito por userId
├── firestore.indexes.json      # Indices compostos necessarios
├── .firebaserc                 # Projeto Firebase associado (broadcast-saas-7eab2)
└── README.md
```

---

## 4. Como Executar Localmente

### 4.1. Pre-requisitos
- Node.js versao 20 ou superior
- NPM versao 10 ou superior

### 4.2. Variaveis de Ambiente do Frontend
No diretorio `web/`, configure o arquivo `.env` com base no `.env.example`:
```bash
cd web
cp .env.example .env
```
Preencha com as credenciais do seu projeto Firebase Console (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.).

### 4.3. Instalar Dependencias
```bash
# Na raiz do projeto:
cd web && npm install
cd ../functions && npm install
cd ..
```

### 4.4. Iniciar Servidor de Desenvolvimento
```bash
cd web
npm run dev
```
Acesse a aplicacao em `http://localhost:5173`.

---

## 5. Como Rodar os Testes

O projeto conta com ampla cobertura de testes unitarios e de integracao com **74 testes automatizados** (100% passando):

### 5.1. Testes do Frontend (72 testes)
```bash
cd web
npm test
```
Abrange servicos de Auth, Conexoes, Contatos, Mensagens, formatadores, hooks reativos, dialogs, paginas e testes de seguranca de regras do Firestore.

### 5.2. Testes das Cloud Functions (2 testes)
```bash
cd functions
npm test
```
Valida a transicao de status de mensagens agendadas e operacoes em lote com mock do Firebase Admin SDK.

---

## 6. Procedimento de Deploy no Firebase

O projeto esta configurado para o projeto Firebase `broadcast-saas-7eab2` via `.firebaserc`.

### 6.1. Autenticar na Firebase CLI
```bash
npx firebase-tools login
```
*(Ou instale globalmente com `npm install -g firebase-tools` e use `firebase login`)*

### 6.2. Gerar Builds de Producao
```bash
# Build do frontend com code-splitting
cd web && npm run build && cd ..

# Build das Cloud Functions
cd functions && npm run build && cd ..
```

### 6.3. Publicar Servicos

```bash
# Deploy completo (Hosting + Regras do Firestore + Indices + Functions)
npx firebase-tools deploy
```

Ou execute de forma modular:

```bash
# 1. Regras de Seguranca e Indices do Firestore
npx firebase-tools deploy --only firestore

# 2. Frontend no Firebase Hosting
npx firebase-tools deploy --only hosting

# 3. Cloud Functions (Requer Plano Blaze no Firebase Console)
npx firebase-tools deploy --only functions
```

> [!IMPORTANT]
> **Sobre o Deploy de Cloud Functions:**
> O Google Cloud exige que o projeto esteja no **Plano Blaze (Pay-as-you-go)** para criar Cloud Functions de 2a geracao (pois a compilacao de imagens necessita das APIs do Cloud Build e Artifact Registry). O plano Blaze e gratuito para o volume deste projeto (ate 2 milhoes de invocacoes por mes gratuitas). Para ativar, acesse a secao de faturamento no Firebase Console e vincule uma conta de faturamento antes de executar `deploy --only functions`.

---

## 7. Status Atual dos Servicos em Producao

| Componente | Status | Detalhes |
|---|---|---|
| **Firebase Hosting** | **Online** | Acessivel publicamente em [https://broadcast-saas-7eab2.web.app](https://broadcast-saas-7eab2.web.app) |
| **Firestore Security Rules** | **Ativo** | Regras compiladas e ativas no banco de dados com isolamento por `userId` |
| **Firestore Indexes** | **Ativo** | Indices compostos publicados para ordenacao e queries de status |
| **Cloud Functions** | **Pronto para Deploy** | Codigo finalizado e testado; requer vinculacao do plano Blaze no console |
| **Cobertura de Testes** | **100% Passando** | 74 testes automatizados executando com sucesso |
