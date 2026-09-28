# Fase 3 — Contatos

## Objetivo

Implementar o CRUD completo de contatos vinculados a uma conexão, com atualização em tempo real.

---

## Contexto de Negócio

Um **contato** é uma pessoa/destinatário vinculado a uma conexão específica. Contatos são os alvos das mensagens. Cada conexão tem sua própria lista de contatos, e um contato não pode pertencer a mais de uma conexão. Sem contatos, não há como enviar mensagens.

---

## Modelo de Dados

### Coleção: `contacts`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | ID auto-gerado pelo Firestore |
| `name` | `string` | Sim | Nome do contato |
| `phone` | `string` | Sim | Telefone do contato |
| `connectionId` | `string` | Sim | ID da conexão associada |
| `userId` | `string` | Sim | UID do usuário autenticado (isolamento SaaS) |
| `createdAt` | `Timestamp` | Sim | Data de criação |
| `updatedAt` | `Timestamp` | Sim | Data da última atualização |

### Tipo TypeScript

```typescript
// types/contact.ts
type Contact = {
  id: string;
  name: string;
  phone: string;
  connectionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateContactInput = {
  name: string;
  phone: string;
};

type UpdateContactInput = {
  name: string;
  phone: string;
};
```

---

## User Stories

### US-3.1 — Listar Contatos de uma Conexão

**Como** cliente autenticado,  
**quero** ver a lista de contatos de uma conexão em tempo real,  
**para** gerenciá-los.

**Critérios de Aceite**:
- [ ] Lista exibe apenas contatos do `connectionId` correto E do `userId` logado
- [ ] Query: `where connectionId == :id AND userId == auth.uid`
- [ ] Lista atualiza em tempo real via `onSnapshot`
- [ ] Exibe estado vazio quando não há contatos
- [ ] Exibe o nome da conexão no cabeçalho da página
- [ ] Botão de voltar para a lista de conexões

---

### US-3.2 — Criar Contato

**Como** cliente autenticado,  
**quero** adicionar um contato a uma conexão,  
**para** poder enviar mensagens para ele.

**Critérios de Aceite**:
- [ ] Botão "Novo Contato" abre dialog com campos: nome e telefone
- [ ] Validação: nome obrigatório (min 2 chars), telefone obrigatório
- [ ] Ao salvar, cria documento com `connectionId` e `userId`
- [ ] `createdAt` e `updatedAt` preenchidos com `serverTimestamp()`
- [ ] Dialog fecha e lista atualiza (real-time)
- [ ] Feedback de sucesso

---

### US-3.3 — Editar Contato

**Como** cliente autenticado,  
**quero** editar o nome ou telefone de um contato,  
**para** manter os dados atualizados.

**Critérios de Aceite**:
- [ ] Botão de editar em cada item da lista
- [ ] Dialog com campos preenchidos com valores atuais
- [ ] Validação igual à criação
- [ ] Atualiza documento, `updatedAt` com `serverTimestamp()`
- [ ] Verifica `userId`
- [ ] Feedback de sucesso

---

### US-3.4 — Excluir Contato

**Como** cliente autenticado,  
**quero** excluir um contato,  
**para** removê-lo da lista.

**Critérios de Aceite**:
- [ ] Botão de excluir em cada item
- [ ] Dialog de confirmação
- [ ] Ao confirmar, deleta documento
- [ ] Verifica `userId`
- [ ] Feedback de sucesso

---

## Implementação Técnica

### Serviço: `services/contacts.ts`

```typescript
createContact(connectionId: string, input: CreateContactInput, userId: string): Promise<string>
updateContact(id: string, input: UpdateContactInput, userId: string): Promise<void>
deleteContact(id: string): Promise<void>
subscribeToContacts(connectionId: string, userId: string, callback: (contacts: Contact[]) => void): Unsubscribe
```

### Hook: `hooks/use-contacts.ts`

```typescript
// useContacts(connectionId: string): { contacts, loading, error }
// Internamente usa onSnapshot com filtro por connectionId + userId
```

---

## Layout

```
┌──────────────────────────────────────────────────┐
│  BROADCAST         [user@email]  [Sair]          │
├──────────────────────────────────────────────────┤
│                                                  │
│  ← Voltar   Contatos de "Conexão WhatsApp"       │
│                                      [+ Novo]    │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  João Silva     (11) 99999-0001  [edit][del]│  │
│  ├────────────────────────────────────────────┤  │
│  │  Maria Souza    (11) 99999-0002  [edit][del]│  │
│  ├────────────────────────────────────────────┤  │
│  │  Pedro Santos   (11) 99999-0003  [edit][del]│  │
│  └────────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `contacts-service.test.ts` | Unit | CRUD opera com connectionId e userId corretos |
| `use-contacts.test.ts` | Unit | Hook filtra por connectionId e userId |
| `contacts-page.test.tsx` | Integration | Renderiza lista, exibe nome da conexão |
| `contact-form.test.tsx` | Unit | Validação de nome e telefone obrigatórios |

---

## Commits Atômicos

1. `fase-3: define tipos de contato`
2. `fase-3: implementa serviço de contatos (CRUD + real-time)`
3. `fase-3: implementa hook useContacts`
4. `fase-3: implementa página de listagem de contatos`
5. `fase-3: implementa dialog de criar/editar contato`
6. `fase-3: implementa exclusão com confirmação`
7. `fase-3: adiciona testes de contatos`
