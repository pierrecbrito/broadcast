# Fase 6 — Security Rules e Deploy

## Objetivo

Configurar Firestore Security Rules para garantir isolamento SaaS e fazer deploy do projeto completo no Firebase Hosting.

---

## Contexto de Negócio

Segurança é requisito fundamental num sistema SaaS. Mesmo que o frontend filtre dados por `userId`, um atacante poderia usar a SDK do Firebase diretamente para acessar dados de outros clientes. As Security Rules são a **última linha de defesa** — executam no servidor e não podem ser burladas pelo cliente.

O deploy no Firebase Hosting finaliza o projeto, tornando-o acessível publicamente.

---

## Parte 1 — Firestore Security Rules

### Arquivo: `firestore.rules`

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Negar tudo por padrão
    match /{document=**} {
      allow read, write: if false;
    }

    // Connections
    match /connections/{connectionId} {
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.name is string
                    && request.resource.data.name.size() >= 2;

      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;

      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }

    // Contacts
    match /contacts/{contactId} {
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.name is string
                    && request.resource.data.phone is string
                    && request.resource.data.connectionId is string;

      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;

      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }

    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.body is string
                    && request.resource.data.contactIds is list
                    && request.resource.data.connectionId is string
                    && request.resource.data.status in ["sent", "scheduled"];

      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;

      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Princípios

1. **Deny by default**: Tudo bloqueado, libera explicitamente
2. **Autenticação obrigatória**: `request.auth != null` em toda regra
3. **Isolamento por userId**: Leitura e escrita só permitidas se `userId` do doc == `auth.uid`
4. **Imutabilidade de userId**: `update` verifica que o userId não muda
5. **Validação de tipos**: Campos obrigatórios validados na criação

### Observação sobre Cloud Functions

Cloud Functions usam o **Admin SDK**, que **bypassa as Security Rules**. Isso é correto e necessário para a função `processScheduledMessages` atualizar mensagens de qualquer usuário.

---

## Parte 2 — Firebase Hosting Deploy

### Pré-requisitos

1. Projeto Firebase criado no console
2. Firebase CLI instalada: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Projeto linkado: `firebase use --add`

### Arquivo: `firebase.json`

```json
{
  "hosting": {
    "public": "web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "codebase": "default",
    "ignore": ["node_modules", ".git"],
    "predeploy": ["npm --prefix functions run build"]
  }
}
```

### Fluxo de Deploy

```bash
# 1. Build do frontend
cd web && npm run build

# 2. Deploy completo (hosting + functions + rules + indexes)
firebase deploy

# Ou deploy parcial:
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### SPA Rewrite

O rewrite `** → /index.html` é essencial para que o React Router funcione — todas as rotas devem servir o `index.html` e deixar o roteamento client-side resolver.

---

## Checklist de Deploy

- [x] Projeto Firebase criado no console
- [x] Firebase Auth (email/senha) habilitado
- [x] Firestore criado (production mode)
- [x] `.firebaserc` configurado com project ID
- [x] `firebase.json` configurado
- [x] Variáveis de ambiente do frontend preenchidas (`.env`)
- [x] `npm run build` no `web/` sem erros
- [x] `npm run build` no `functions/` sem erros
- [x] Security Rules deployadas
- [x] Índices deployados
- [x] Firebase Hosting deployado com sucesso (`https://broadcast-saas-7eab2.web.app`)
- [ ] Teste manual no URL do hosting
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] CRUD de conexões funciona
- [ ] CRUD de contatos funciona
- [ ] Envio e agendamento de mensagem funciona
- [ ] Isolamento SaaS verificado (criar 2 contas e confirmar que dados não se cruzam)

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `firestore.rules` | Security Rules | Usuário lê próprias conexões |
| `firestore.rules` | Security Rules | Usuário NÃO lê conexões de outro userId |
| `firestore.rules` | Security Rules | Criação exige userId == auth.uid |
| `firestore.rules` | Security Rules | Update não permite mudar userId |
| `firestore.rules` | Security Rules | Não-autenticado não acessa nada |

### Ferramenta de Teste de Rules

Usar o **Firebase Emulator Suite** com `@firebase/rules-unit-testing`:

```typescript
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
```

---

## Commits Atômicos

1. `fase-6: implementa firestore security rules`
2. `fase-6: adiciona firestore.indexes.json`
3. `fase-6: configura firebase.json para hosting + functions`
4. `fase-6: adiciona testes de security rules`
5. `fase-6: deploy para firebase hosting`
