import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Contact, CreateContactInput, UpdateContactInput } from "../types/contact";

const CONTACTS_COLLECTION = "contacts";

function mapDocToContact(id: string, data: Record<string, unknown>): Contact {
  const createdAtTimestamp = data.createdAt as Timestamp | undefined;
  const updatedAtTimestamp = data.updatedAt as Timestamp | undefined;

  return {
    id,
    name: (data.name as string) || "",
    phone: (data.phone as string) || "",
    connectionId: (data.connectionId as string) || "",
    userId: (data.userId as string) || "",
    createdAt: createdAtTimestamp?.toDate ? createdAtTimestamp.toDate() : new Date(),
    updatedAt: updatedAtTimestamp?.toDate ? updatedAtTimestamp.toDate() : new Date(),
  };
}

export async function createContact(
  connectionId: string,
  input: CreateContactInput,
  userId: string
): Promise<string> {
  const trimmedName = input.name.trim();
  const trimmedPhone = input.phone.trim();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("O nome do contato deve ter pelo menos 2 caracteres.");
  }

  if (!trimmedPhone) {
    throw new Error("O telefone do contato e obrigatorio.");
  }

  const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
    name: trimmedName,
    phone: trimmedPhone,
    connectionId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateContact(
  id: string,
  input: UpdateContactInput,
  _userId: string
): Promise<void> {
  const trimmedName = input.name.trim();
  const trimmedPhone = input.phone.trim();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("O nome do contato deve ter pelo menos 2 caracteres.");
  }

  if (!trimmedPhone) {
    throw new Error("O telefone do contato e obrigatorio.");
  }

  const docRef = doc(db, CONTACTS_COLLECTION, id);
  await updateDoc(docRef, {
    name: trimmedName,
    phone: trimmedPhone,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteContact(id: string): Promise<void> {
  const docRef = doc(db, CONTACTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getContactsByConnection(
  connectionId: string,
  userId: string
): Promise<Contact[]> {
  const q = query(
    collection(db, CONTACTS_COLLECTION),
    where("userId", "==", userId),
    where("connectionId", "==", connectionId)
  );

  const snap = await getDocs(q);
  const contacts = snap.docs.map((docSnap) =>
    mapDocToContact(docSnap.id, docSnap.data())
  );
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  return contacts;
}

export function subscribeToContacts(
  connectionId: string,
  userId: string,
  callback: (contacts: Contact[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, CONTACTS_COLLECTION),
    where("userId", "==", userId),
    where("connectionId", "==", connectionId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Contact[] = snapshot.docs.map((docSnap) =>
        mapDocToContact(docSnap.id, docSnap.data())
      );
      // Ordena por nome
      items.sort((a, b) => a.name.localeCompare(b.name));
      callback(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}
