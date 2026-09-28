# Fase 2 — Conexões

## Objetivo

Implementar o CRUD completo de conexões com atualização em tempo real via Firestore `onSnapshot`.

---

## Contexto de Negócio

Uma **conexão** representa um canal de comunicação do cliente (ex: um número de WhatsApp, um perfil de Telegram). Cada cliente pode ter múltiplas conexões, e cada conexão agrupa seus próprios contatos e mensagens. É a entidade raiz da hierarquia de dados do cliente.

---

## Modelo de Dados

### Coleção: `connections`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | ID auto-gerado pelo Firestore |
| `name` | `string` | Sim | Nome da conexão |
| `userId` | `string` | Sim | UID do usuário autenticado (isolamento SaaS) |
| `createdAt` | `Timestamp` | Sim | Data de criação |
| `updatedAt` | `Timestamp` | Sim | Data da última atualização |

### Tipo TypeScript

```typescript
// types/connection.ts
type Connection = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateConnectionInput = {
  name: string;
};

type UpdateConnectionInput = {
  name: string;
};
```

---

## User Stories

### US-2.1 — Listar Conexões

**Como** cliente autenticado,  
**quero** ver a lista das minhas conexões em tempo real,  
**para** gerenciá-las.

**Critérios de Aceite**:
- [ ] Lista exibe apenas conexões do usuário logado (`where userId == auth.uid`)
- [ ] Lista atualiza em tempo real (sem refresh manual) via `onSnapshot`
- [ ] Exibe estado vazio quando não há conexões ("Nenhuma conexão. Crie a primeira!")
- [ ] Exibe loading enquanto carrega dados iniciais

---

### US-2.2 — Criar Conexão

**Como** cliente autenticado,  
**quero** criar uma nova conexão informando apenas o nome,  
**para** organizar meus contatos.

**Critérios de Aceite**:
- [ ] Botão "Nova Conexão" abre dialog/modal com campo nome
- [ ] Validação: nome obrigatório, mínimo 2 caracteres
- [ ] Ao salvar, cria documento em `connections` com `userId` do usuário logado
- [ ] `createdAt` e `updatedAt` preenchidos com `serverTimestamp()`
- [ ] Dialog fecha e lista atualiza automaticamente (real-time)
- [ ] Feedback de sucesso (snackbar)

---

### US-2.3 — Editar Conexão

**Como** cliente autenticado,  
**quero** editar o nome de uma conexão existente,  
**para** corrigi-lo ou atualizá-lo.

**Critérios de Aceite**:
- [ ] Botão de editar em cada item da lista (ícone de lápis)
- [ ] Abre dialog com campo nome preenchido com valor atual
- [ ] Validação: nome obrigatório, mínimo 2 caracteres
- [ ] Atualiza documento no Firestore, `updatedAt` com `serverTimestamp()`
- [ ] Verifica que `userId` do documento pertence ao usuário logado
- [ ] Feedback de sucesso

---

### US-2.4 — Excluir Conexão

**Como** cliente autenticado,  
**quero** excluir uma conexão,  
**para** removê-la quando não for mais necessária.

**Critérios de Aceite**:
- [ ] Botão de excluir em cada item (ícone de lixeira)
- [ ] Dialog de confirmação: "Tem certeza que deseja excluir a conexão {nome}?"
- [ ] Ao confirmar, deleta o documento no Firestore
- [ ] Verifica que `userId` do documento pertence ao usuário logado
- [ ] Feedback de sucesso

---

### US-2.5 — Navegar para Contatos/Mensagens

**Como** cliente autenticado,  
**quero** clicar em uma conexão para ver seus contatos e mensagens,  
**para** gerenciar os dados vinculados.

**Critérios de Aceite**:
- [ ] Clique no nome/card da conexão navega para `/connections/:id/contacts`
- [ ] Ou um menu com opções: "Contatos", "Mensagens"

---

## Implementação Técnica

### Serviço: `services/connections.ts`

```typescript
// Todas as funções recebem userId como parâmetro para isolamento

createConnection(input: CreateConnectionInput, userId: string): Promise<string>
updateConnection(id: string, input: UpdateConnectionInput, userId: string): Promise<void>
deleteConnection(id: string): Promise<void>
subscribeToConnections(userId: string, callback: (connections: Connection[]) => void): Unsubscribe
```

### Hook: `hooks/use-connections.ts`

```typescript
// useConnections(): { connections, loading, error }
// Internamente usa onSnapshot via subscribeToConnections
// Filtra automaticamente por userId do useAuth
```

---

## Layout

```
┌──────────────────────────────────────────────────┐
│  BROADCAST         [user@email]  [Sair]          │
├──────────────────────────────────────────────────┤
│                                                  │
│  Conexões                    [ + Nova Conexão ]  │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  Conexão WhatsApp        [edit] [del] [>] │  │
│  ├────────────────────────────────────────────┤  │
│  │  Conexão Telegram        [edit] [del] [>] │  │
│  ├────────────────────────────────────────────┤  │
│  │  Conexão SMS             [edit] [del] [>] │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `connections-service.test.ts` | Unit | `createConnection` adiciona doc com userId e timestamps |
| `connections-service.test.ts` | Unit | `updateConnection` atualiza nome e updatedAt |
| `connections-service.test.ts` | Unit | `deleteConnection` remove documento |
| `use-connections.test.ts` | Unit | Hook retorna loading, depois lista de conexões |
| `connections-page.test.tsx` | Integration | Renderiza lista, botões CRUD, dialogs |
| `connection-form.test.tsx` | Unit | Validação de nome obrigatório funciona |

---

## Commits Atômicos

1. `fase-2: define tipos de conexão`
2. `fase-2: implementa serviço de conexões (CRUD + real-time)`
3. `fase-2: implementa hook useConnections`
4. `fase-2: implementa página de listagem de conexões`
5. `fase-2: implementa dialog de criar/editar conexão`
6. `fase-2: implementa exclusão com confirmação`
7. `fase-2: adiciona testes de conexões`
