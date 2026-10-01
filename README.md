# Broadcast - Plataforma SaaS de Disparo de Mensagens

Sistema SaaS para envio e agendamento de mensagens (disparo simulado) com isolamento total por cliente (multi-tenant), atualizacao em tempo real com Firestore e processamento agendado com Cloud Functions.

---

## 1. Visao Geral e Regras de Negocio

- **SaaS Multi-tenant**: Cada usuario autenticado tem sua propria area de trabalho isolada. Um cliente nao pode visualizar nem manipular dados de outro cliente.
- **Conexoes**: Cada cliente gerencia conexoes de comunicacao (ex: WhatsApp, Telegram, SMS), contendo apenas seu nome.
- **Contatos**: Cada conexao possui seus proprios contatos (nome e telefone).
- **Mensagens**:
  - Selecao multipla de contatos destinatarios.
  - Envio imediato simulado (status 'sent', sentAt preenchido).
  - Agendamento para data/horario futuro (status 'scheduled', scheduledAt preenchido).
  - Filtro em tempo real por status ('Todas', 'Enviadas', 'Agendadas').
  - Edicao permitida exclusivamente para mensagens que ainda estao no status agendado.
- **Cloud Functions**: Funcao agendada (cron a cada minuto) que busca mensagens agendadas com horario vencido e atualiza automaticamente para o status 'sent' e registra sentAt.
- **Firestore Flat Collections**: Estrutura sem subcolecoes (colecoes raiz: `connections`, `contacts`, `messages`), garantindo escalabilidade e isolamento via indices compostos e Security Rules no servidor.
- **Paradigma Funcional**: Implementacao orientada a funcoes puras, hooks personalizados e composicao de componentes sem utilizacao de classes.

---

## 2. Tecnologias Utilizadas

- **Frontend (`web/`)**:
  - React 19 + TypeScript
  - Vite
  - Material UI (MUI) v9
  - TailwindCSS v3
  - React Router DOM v6
  - Firebase SDK v12 (Auth, Firestore)
  - Vitest + Testing Library
- **Backend / Serverless (`functions/`)**:
  - Firebase Functions v6 (2nd Gen Scheduler)
  - Firebase Admin SDK v12
  - Vitest
- **Infraestrutura**:
  - Firebase Hosting
  - Cloud Firestore
  - Cloud Scheduler

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
├── web/                        # Aplicacao Frontend
│   ├── src/
│   │   ├── components/         # Componentes reutilizaveis e dialogs
│   │   ├── hooks/              # Custom hooks reativos (useAuth, useConnections, etc.)
│   │   ├── lib/                # Inicializacao do Firebase
│   │   ├── pages/              # Paginas da aplicacao (Login, Register, Conexoes, Contatos, Mensagens)
│   │   ├── routes/             # Configuracao de rotas publicas e privadas
│   │   ├── services/           # Servicos de integracao com Firebase
│   │   ├── types/              # Tipagens TypeScript
│   │   ├── theme.ts            # Tema do Material UI
│   │   ├── App.tsx             # Componente raiz
│   │   └── main.tsx            # Ponto de entrada React
│   ├── package.json
│   └── vite.config.ts
├── functions/                  # Cloud Functions
│   ├── src/
│   │   ├── index.ts            # Funcao agendada processScheduledMessages
│   │   └── index.test.ts       # Testes unitarios da funcao
│   ├── package.json
│   └── tsconfig.json
├── firebase.json               # Configuracao de hosting, functions e firestore
├── firestore.rules             # Regras de seguranca com isolamento por userId
├── firestore.indexes.json      # Indices compostos necessarios
├── .firebaserc                 # Projeto Firebase default
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
Preencha com as credenciais do seu projeto Firebase Console.

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

O projeto conta com ampla cobertura de testes unitarios e de integracao em ambas as partes.

### 5.1. Testes do Frontend (72 testes)
```bash
cd web
npm test
```

### 5.2. Testes das Cloud Functions (2 testes)
```bash
cd functions
npm test
```

---

## 6. Procedimento de Deploy no Firebase Hosting

1. Realize login na CLI do Firebase (se necessario):
   ```bash
   npx firebase-tools login
   ```
   *(Ou instale globalmente com `npm install -g firebase-tools` e use `firebase login`)*

2. Selecione ou associe o projeto Firebase criado no console:
   ```bash
   npx firebase-tools use --add
   ```

3. Gere o bundle de producao do frontend:
   ```bash
   cd web
   npm run build
   cd ..
   ```

4. Compile as Cloud Functions:
   ```bash
   cd functions
   npm run build
   cd ..
   ```

5. Execute o deploy completo (Hosting, Firestore Rules, Firestore Indexes e Functions):
   ```bash
   npx firebase-tools deploy
   ```

   Ou faca deploy individual:
   ```bash
   # Apenas regras e indices do Firestore
   npx firebase-tools deploy --only firestore

   # Apenas Cloud Functions
   npx firebase-tools deploy --only functions

   # Apenas Frontend Hosting
   npx firebase-tools deploy --only hosting
   ```

6. O link publico de acesso estara disponivel no terminal ao concluir o deploy (ex: `https://<seu-projeto>.web.app`).
