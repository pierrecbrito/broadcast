# Fase 5 — Cloud Functions

## Objetivo

Implementar uma Cloud Function agendada (cron) que processa mensagens com status `"scheduled"` cujo horário de disparo já passou, atualizando-as para `"sent"`.

---

## Contexto de Negócio

Mensagens agendadas precisam "disparar" automaticamente no horário programado — sem intervenção do usuário. Como o disparo é fake (não envia de verdade), a Cloud Function simplesmente muda o status de `"scheduled"` para `"sent"` e registra o `sentAt`. Isso simula o comportamento de um sistema real de broadcast.

O cliente deve ver a mensagem mudar de "Agendada" para "Enviada" automaticamente na interface (graças ao real-time do Firestore).

---

## Regra de Negócio

```
PARA CADA mensagem WHERE:
  - status == "scheduled"
  - scheduledAt <= AGORA
FAZER:
  - status = "sent"
  - sentAt = AGORA
  - updatedAt = AGORA
```

---

## Implementação Técnica

### Função: `processScheduledMessages`

**Tipo**: Scheduled Function (Cloud Scheduler / Pub/Sub)

**Cron**: `* * * * *` (a cada minuto)

**Localização**: `functions/src/index.ts`

```typescript
// functions/src/index.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const processScheduledMessages = onSchedule(
  { schedule: "* * * * *", timeZone: "America/Sao_Paulo" },
  async () => {
    const db = getFirestore();
    const now = new Date();

    // Query: mensagens agendadas cujo horário já passou
    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) {
      console.log("Nenhuma mensagem agendada para processar.");
      return;
    }

    // Batch update para performance
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "sent",
        sentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`${snapshot.size} mensagem(ns) processada(s).`);
  }
);
```

### Observações Técnicas

1. **Batch writes**: Se houver mais de 500 documentos (limite do Firestore batch), deve-se dividir em múltiplos batches
2. **Idempotência**: A query por `status == "scheduled"` garante que mensagens já processadas não sejam re-processadas
3. **Timezone**: `America/Sao_Paulo` para consistência com horário brasileiro
4. **Índice composto**: Firestore vai precisar de um índice para a query com `status` + `scheduledAt`

### Índice Necessário (firestore.indexes.json)

```json
{
  "indexes": [
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "scheduledAt", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## Diagrama de Fluxo

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Cloud       │     │  Firestore       │     │  Frontend       │
│  Scheduler   │     │                  │     │  (onSnapshot)   │
│              │     │                  │     │                 │
│  Cada 1 min  │────▶│  Query:          │     │                 │
│              │     │  status=scheduled│     │                 │
│              │     │  scheduledAt<=now│     │                 │
│              │     │                  │     │                 │
│              │     │  Batch update:   │     │                 │
│              │     │  status → sent   │────▶│  Lista atualiza │
│              │     │  sentAt → now    │     │  automaticamente│
└─────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Testes

| Teste | Tipo | Descrição |
|-------|------|-----------|
| `process-scheduled.test.ts` | Unit | Função atualiza mensagens com scheduledAt no passado |
| `process-scheduled.test.ts` | Unit | Função ignora mensagens com scheduledAt no futuro |
| `process-scheduled.test.ts` | Unit | Função ignora mensagens já enviadas (status = "sent") |
| `process-scheduled.test.ts` | Unit | Função lida com snapshot vazio sem erro |
| `process-scheduled.test.ts` | Unit | Batch divide em chunks se > 500 documentos |

### Estratégia de Teste

Usar **Firebase Admin SDK mockado** ou **Firebase Emulator Suite** para testar a função sem acessar o Firestore real.

---

## Commits Atômicos

1. `fase-5: implementa cloud function processScheduledMessages`
2. `fase-5: configura índice composto para messages (status + scheduledAt)`
3. `fase-5: adiciona tratamento de batch > 500 docs`
4. `fase-5: adiciona testes da cloud function`
