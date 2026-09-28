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
import { Connection, CreateConnectionInput, UpdateConnectionInput } from "../types/connection";

const CONNECTIONS_COLLECTION = "connections";

function mapDocToConnection(id: string, data: Record<string, unknown>): Connection {
  const createdAtTimestamp = data.createdAt as Timestamp | undefined;
  const updatedAtTimestamp = data.updatedAt as Timestamp | undefined;

  return {
    id,
    name: (data.name as string) || "",
    userId: (data.userId as string) || "",
    createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate() : new Date(),
    updatedAt: updatedAtTimestamp?.toDate ? updatedAtTimestamp.toDate() : new Date(),
  };
}

export async function createConnection(
  input: CreateConnectionInput,
  userId: string
): Promise<string> {
  const trimmedName = input.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("O nome da conexao deve ter pelo menos 2 caracteres.");
  }

  const docRef = await addDoc(collection(db, CONNECTIONS_COLLECTION), {
    name: trimmedName,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateConnection(
  id: string,
  input: UpdateConnectionInput,
  _userId: string
): Promise<void> {
  const trimmedName = input.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("O nome da conexao deve ter pelo menos 2 caracteres.");
  }

  const docRef = doc(db, CONNECTIONS_COLLECTION, id);
  await updateDoc(docRef, {
    name: trimmedName,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteConnection(id: string): Promise<void> {
  const docRef = doc(db, CONNECTIONS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getConnection(id: string): Promise<Connection | null> {
  const docRef = doc(db, CONNECTIONS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return null;
  }
  return mapDocToConnection(snap.id, snap.data());
}

export function subscribeToConnections(
  userId: string,
  callback: (connections: Connection[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, CONNECTIONS_COLLECTION),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Connection[] = snapshot.docs.map((docSnap) =>
        mapDocToConnection(docSnap.id, docSnap.data())
      );
      // Ordenacao client-side por data decrescente
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
