import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, FieldValue, Firestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const BATCH_LIMIT = 450; // Abaixo do limite de 500 do Firestore para seguranca

/**
 * Processa a transicao de mensagens agendadas para o status 'sent'
 * Extraida para permitir testes unitarios isolados
 */
export async function executeScheduledTransition(
  db: Firestore,
  currentTime: Date = new Date()
): Promise<number> {
  const snapshot = await db
    .collection("messages")
    .where("status", "==", "scheduled")
    .where("scheduledAt", "<=", currentTime)
    .get();

  if (snapshot.empty) {
    return 0;
  }

  const docs = snapshot.docs;
  let processedCount = 0;

  // Processa em lotes (chunks) caso haja mais de 500 documentos
  for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
    const chunk = docs.slice(i, i + BATCH_LIMIT);
    const batch = db.batch();

    chunk.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        status: "sent",
        sentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    processedCount += chunk.length;
  }

  return processedCount;
}

/**
 * Cloud Function agendada executada a cada minuto
 */
export const processScheduledMessages = onSchedule(
  {
    schedule: "* * * * *",
    timeZone: "America/Sao_Paulo",
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async () => {
    const db = getFirestore();
    const count = await executeScheduledTransition(db);
    console.log(`Processamento concluido: ${count} mensagem(ns) enviada(s).`);
  }
);
