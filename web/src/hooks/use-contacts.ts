import { useEffect, useState } from "react";
import { Contact, CreateContactInput, UpdateContactInput } from "../types/contact";
import {
  subscribeToContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts";
import { getConnection } from "../services/connections";
import { useAuth } from "./use-auth";

export function useContacts(connectionId: string) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [connectionName, setConnectionName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Carrega dados da conexao
    getConnection(connectionId)
      .then((conn) => {
        if (conn) setConnectionName(conn.name);
      })
      .catch(() => {});

    // Assina contatos em tempo real
    const unsubscribe = subscribeToContacts(
      connectionId,
      user.uid,
      (data) => {
        setContacts(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, connectionId]);

  const create = async (input: CreateContactInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return createContact(connectionId, input, user.uid);
  };

  const update = async (id: string, input: UpdateContactInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return updateContact(id, input, user.uid);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return deleteContact(id);
  };

  return {
    contacts,
    connectionName,
    loading,
    error,
    create,
    update,
    remove,
  };
}
