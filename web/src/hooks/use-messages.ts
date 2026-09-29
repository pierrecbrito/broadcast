import { useEffect, useState } from "react";
import { Message, MessageStatus, CreateMessageInput, UpdateMessageInput } from "../types/message";
import { Contact } from "../types/contact";
import {
  subscribeToMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  transitionScheduledMessageToSent,
} from "../services/messages";
import { getConnection } from "../services/connections";
import { getContactsByConnection } from "../services/contacts";
import { useAuth } from "./use-auth";

export function useMessages(
  connectionId: string,
  statusFilter: MessageStatus | "all" = "all"
) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionName, setConnectionName] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega conexao e contatos
  useEffect(() => {
    if (!user || !connectionId) return;

    getConnection(connectionId)
      .then((conn) => {
        if (conn) setConnectionName(conn.name);
      })
      .catch(() => {});

    getContactsByConnection(connectionId, user.uid)
      .then((data) => setContacts(data))
      .catch(() => {});
  }, [user, connectionId]);

  // Assina mensagens em tempo real com filtro
  useEffect(() => {
    if (!user || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(
      connectionId,
      user.uid,
      statusFilter,
      (data) => {
        setMessages(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, connectionId, statusFilter]);

  // Processa automaticamente transicao de mensagens agendadas vencidas
  useEffect(() => {
    if (!user || messages.length === 0) return;

    const checkAndTransition = () => {
      const now = Date.now();
      messages.forEach((msg) => {
        if (
          msg.status === "scheduled" &&
          msg.scheduledAt &&
          msg.scheduledAt.getTime() <= now
        ) {
          Promise.resolve(transitionScheduledMessageToSent(msg.id)).catch(() => {});
        }
      });
    };

    checkAndTransition();
    const interval = setInterval(checkAndTransition, 3000);

    return () => clearInterval(interval);
  }, [user, messages]);

  const create = async (input: CreateMessageInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return createMessage(connectionId, input, user.uid);
  };

  const update = async (id: string, input: UpdateMessageInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return updateMessage(id, input, user.uid);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return deleteMessage(id);
  };

  return {
    messages,
    connectionName,
    contacts,
    loading,
    error,
    create,
    update,
    remove,
  };
}
