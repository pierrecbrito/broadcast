# Fase 4 — Mensagens

## Objetivo

Implementar envio (fake) e agendamento de mensagens para contatos selecionados, com filtros por status e atualização em tempo real.

---

## Contexto de Negócio

Esta é a funcionalidade central do produto. O cliente seleciona contatos de uma conexão, escreve uma mensagem e escolhe entre enviar imediatamente (fake) ou agendar para um horário futuro. Mensagens agendadas ficam com status "agendada" até o horário do disparo, quando uma Cloud Function muda o status para "enviada".

O cliente precisa de visibilidade: poder filtrar entre mensagens já enviadas e agendadas, para acompanhar o que já foi e o que ainda será disparado.

---

## Modelo de Dados

### Coleção: `messages`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | ID auto-gerado |
| `body` | `string` | Sim | Conteúdo da mensagem |
| `contactIds` | `string[]` | Sim | IDs dos contatos destinatários |
| `connectionId` | `string` | Sim | ID da conexão associada |
| `userId` | `string` | Sim | UID do usuário (isolamento SaaS) |
| `status` | `"sent" \| "scheduled"` | Sim | Status da mensagem |
| `scheduledAt` | `Timestamp \| null` | Não | Data/hora do agendamento (se agendada) |
| `sentAt` | `Timestamp \| null` | Não | Data/hora do envio (real ou simulado) |
| `createdAt` | `Timestamp` | Sim | Data de criação |
| `updatedAt` | `Timestamp` | Sim | Data da última atualização |

### Tipo TypeScript

```typescript
// types/message.ts
type MessageStatus = "sent" | "scheduled";

type Message = {
  id: string;
  body: string;
  contactIds: string[];
  connectionId: string;
  userId: string;
  status: MessageStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateMessageInput = {
  body: string;
  contactIds: string[];
  scheduledAt?: Date;  // se informado, status = "scheduled"; senão, status = "sent"
};
```

---

## User Stories

### US-4.1 — Enviar Mensagem Imediata (Fake)

**Como** cliente autenticado,  
**quero** selecionar contatos e enviar uma mensagem imediatamente,  
**para** comunicar com meus contatos.

**Critérios de Aceite**:
- [ ] Na tela de mensagens de uma conexão, botão "Nova Mensagem"
- [ ] Dialog/tela com:
  - Lista de contatos da conexão com checkboxes para seleção
  - Campo de texto para corpo da mensagem
  - Opção de "Enviar agora" vs "Agendar"
- [ ] Validação: pelo menos 1 contato selecionado, corpo obrigatório (min 1 char)
- [ ] Ao enviar imediato: cria documento com `status: "sent"` e `sentAt: serverTimestamp()`
- [ ] `scheduledAt` fica `null`
- [ ] Feedback de sucesso: "Mensagem enviada para X contato(s)"

---

### US-4.2 — Agendar Mensagem

**Como** cliente autenticado,  
**quero** agendar uma mensagem para um horário futuro,  
**para** que ela seja disparada automaticamente no horário.

**Critérios de Aceite**:
- [ ] Ao marcar "Agendar", aparece DateTimePicker (MUI)
- [ ] Validação: data/hora deve ser no futuro
- [ ] Ao salvar: cria documento com `status: "scheduled"` e `scheduledAt` preenchido
- [ ] `sentAt` fica `null`
- [ ] Feedback de sucesso: "Mensagem agendada para DD/MM/YYYY HH:mm"

---

### US-4.3 — Listar Mensagens com Filtro

**Como** cliente autenticado,  
**quero** ver minhas mensagens e filtrar por status (enviadas / agendadas),  
**para** acompanhar o histórico e pendências.

**Critérios de Aceite**:
- [ ] Lista de mensagens da conexão em tempo real (`onSnapshot`)
- [ ] Filtro por status: "Todas", "Enviadas", "Agendadas" (Tabs ou ToggleButtons MUI)
- [ ] Cada item exibe: corpo (truncado), quantidade de contatos, status (chip colorido), data
- [ ] Ordenação padrão: mais recentes primeiro
- [ ] Estado vazio por filtro: "Nenhuma mensagem {enviada/agendada}"

---

### US-4.4 — Ver Detalhes da Mensagem

**Como** cliente autenticado,  
**quero** ver os detalhes completos de uma mensagem,  
**para** saber exatamente para quem foi enviada e o conteúdo completo.

**Critérios de Aceite**:
- [ ] Clique em uma mensagem abre dialog de detalhes
- [ ] Exibe: corpo completo, status, nomes dos contatos destinatários, datas
- [ ] Se agendada: exibe data de agendamento
- [ ] Se enviada: exibe data de envio

---

### US-4.5 — Editar Mensagem Agendada

**Como** cliente autenticado,  
**quero** editar uma mensagem agendada (corpo, contatos, horário),  
**para** corrigir antes do disparo.

**Critérios de Aceite**:
- [ ] Apenas mensagens com `status: "scheduled"` podem ser editadas
- [ ] Botão de editar só aparece para mensagens agendadas
- [ ] Pode alterar: corpo, contatos selecionados, data/hora de agendamento
- [ ] Validações iguais à criação
- [ ] Atualiza documento e `updatedAt`

---

### US-4.6 — Excluir Mensagem

**Como** cliente autenticado,  
**quero** excluir uma mensagem (enviada ou agendada),  
**para** limpar meu histórico.

**Critérios de Aceite**:
- [ ] Botão de excluir em cada mensagem
- [ ] Dialog de confirmação
- [ ] Deleta documento no Firestore
- [ ] Feedback de sucesso

---

## Implementação Técnica

### Serviço: `services/messages.ts`

```typescript
createMessage(connectionId: string, input: CreateMessageInput, userId: string): Promise<string>
updateMessage(id: string, input: Partial<CreateMessageInput>, userId: string): Promise<void>
deleteMessage(id: string): Promise<void>
subscribeToMessages(
  connectionId: string,
  userId: string,
  statusFilter: MessageStatus | "all",
  callback: (messages: Message[]) => void
): Unsubscribe
```

### Hook: `hooks/use-messages.ts`

```typescript
// useMessages(connectionId: string, statusFilter?: MessageStatus | "all")
// Retorna: { messages, loading, error }
```

### Lógica de Status na Criação

```typescript
// Se scheduledAt informado e é futuro:
//   status = "scheduled", sentAt = null
// Senão:
//   status = "sent", sentAt = serverTimestamp(), scheduledAt = null
```

---

## Layout

### Lista de Mensagens

```
┌──────────────────────────────────────────────────────────┐
│  BROADCAST           [user@email]  [Sair]                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ← Voltar   Mensagens de "Conexão WhatsApp"              │
│                                         [+ Nova Mensagem]│
│                                                          │
│  [ Todas ] [ Enviadas ] [ Agendadas ]    ← filtro        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  "Olá, temos uma promoção..."   3 contatos         │  │
│  │  [sent] Enviada  28/09/2026 14:00          [edit] [del]  │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  "Lembrete: reunião amanhã..."  5 contatos         │  │
│  │  [sched] Agendada  29/09/2026 09:00         [edit] [del]  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Dialog de Nova Mensagem

```
┌──────────────────────────────────────────┐
│  Nova Mensagem                     [X]   │
│                                          │
│  Selecione os contatos:                  │
│  ☑ João Silva                            │
│  ☑ Maria Souza                           │
│  ☐ Pedro Santos                          │
│                                          │
│  Mensagem:                               │
│  ┌──────────────────────────────────┐    │
│  │ Digite sua mensagem...           │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ○ Enviar agora                          │
│  ● Agendar para:                         │
│  ┌──────────────────────────────────┐    │
│  │  29/09/2026  09:00               │    │
│  └──────────────────────────────────┘    │
│                                          │
│         [ Cancelar ]  [ Enviar ]         │
└──────────────────────────────────────────┘
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `messages-service.test.ts` | Unit | Criação com status "sent" preenche sentAt |
| `messages-service.test.ts` | Unit | Criação com scheduledAt preenche status "scheduled" |
| `messages-service.test.ts` | Unit | Update de mensagem agendada funciona |
| `use-messages.test.ts` | Unit | Hook filtra por connectionId, userId e status |
| `messages-page.test.tsx` | Integration | Filtro alterna entre status |
| `message-form.test.tsx` | Unit | Validação: ao menos 1 contato, corpo obrigatório |
| `message-form.test.tsx` | Unit | Agendar no passado mostra erro |

---

## Commits Atômicos

1. `fase-4: define tipos de mensagem`
2. `fase-4: implementa serviço de mensagens (CRUD + real-time + filtro)`
3. `fase-4: implementa hook useMessages com filtro de status`
4. `fase-4: implementa página de listagem de mensagens com filtro`
5. `fase-4: implementa dialog de nova mensagem com seleção de contatos`
6. `fase-4: implementa agendamento com DateTimePicker`
7. `fase-4: implementa edição de mensagem agendada`
8. `fase-4: implementa exclusão de mensagem`
9. `fase-4: implementa dialog de detalhes da mensagem`
10. `fase-4: adiciona testes de mensagens`
