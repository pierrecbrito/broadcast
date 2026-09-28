import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Message, MessageStatus, CreateMessageInput, UpdateMessageInput } from "../types/message";

const MESSAGES_COLLECTION = "messages";

function mapDocToMessage(id: string, data: Record<string, unknown>): Message {
  const createdAtTimestamp = data.createdAt as Timestamp | undefined;
  const updatedAtTimestamp = data.updatedAt as Timestamp | undefined;
  const scheduledAtTimestamp = data.scheduledAt as Timestamp | undefined;
  const sentAtTimestamp = data.sentAt as Timestamp | undefined;

  return {
    id,
    body: (data.body as string) || "",
    contactIds: Array.isArray(data.contactIds) ? (data.contactIds as string[]) : [],
    connectionId: (data.connectionId as string) || "",
    userId: (data.userId as string) || "",
    status: (data.status as MessageStatus) || "sent",
    scheduledAt: scheduledAtTimestamp?.toDate ? scheduledAtTimestamp.toDate() : null,
    sentAt: sentAtTimestamp?.toDate ? sentAtTimestamp.toDate() : null,
    createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate() : new Date(),
    updatedAt: updatedAtTimestamp?.toDate ? updatedAtTimestamp.toDate() : new Date(),
  };
}

export async function createMessage(
  connectionId: string,
  input: CreateMessageInput,
  userId: string
): Promise<string> {
  const trimmedBody = input.body.trim();
  if (!trimmedBody) {
    throw new Error("O conteudo da mensagem e obrigatorio.");
  }

  if (!input.contactIds || input.contactIds.length === 0) {
    throw new Error("Selecione pelo menos um contato para enviar a mensagem.");
  }

  const isScheduled = Boolean(input.scheduledAt);
  if (isScheduled && input.scheduledAt) {
    const now = new Date();
    if (input.scheduledAt.getTime() <= now.getTime()) {
      throw new Error("O horario de agendamento deve ser uma data futura.");
    }
  }

  const docData: Record<string, unknown> = {
    body: trimmedBody,
    contactIds: input.contactIds,
    connectionId,
    userId,
    status: isScheduled ? "scheduled" : "sent",
    scheduledAt: isScheduled && input.scheduledAt ? Timestamp.fromDate(input.scheduledAt) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), docData);
  return docRef.id;
}

export async function updateMessage(
  id: string,
  input: UpdateMessageInput,
  _userId: string
): Promise<void> {
  const trimmedBody = input.body.trim();
  if (!trimmedBody) {
    throw new Error("O conteudo da mensagem e obrigatorio.");
  }

  if (!input.contactIds || input.contactIds.length === 0) {
    throw new Error("Selecione pelo menos um contato para a mensagem.");
  }

  const docRef = doc(db, MESSAGES_COLLECTION, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error("Mensagem nao encontrada.");
  }

  const currentData = snap.data();
  if (currentData.status !== "scheduled") {
    throw new Error("Apenas mensagens agendadas podem ser editadas.");
  }

  if (input.scheduledAt) {
    const now = new Date();
    if (input.scheduledAt.getTime() <= now.getTime()) {
      throw new Error("O horario de agendamento deve ser uma data futura.");
    }
  }

  await updateDoc(docRef, {
    body: trimmedBody,
    contactIds: input.contactIds,
    scheduledAt: input.scheduledAt ? Timestamp.fromDate(input.scheduledAt) : null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, MESSAGES_COLLECTION, id);
  await deleteDoc(docRef);
}

export function subscribeToMessages(
  connectionId: string,
  userId: string,
  statusFilter: MessageStatus | "all",
  callback: (messages: Message[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where("userId", "==", userId),
    where("connectionId", "==", connectionId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      let items: Message[] = snapshot.docs.map((docSnap) =>
        mapDocToMessage(docSnap.id, docSnap.data())
      );

      // Filtra por status se especificado
      if (statusFilter !== "all") {
        items = items.filter((m) => m.status === statusFilter);
      }

      // Ordena decrescente por data de criacao
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
