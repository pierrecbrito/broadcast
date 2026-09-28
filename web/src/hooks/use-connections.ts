import { useEffect, useState } from "react";
import { Connection, CreateConnectionInput, UpdateConnectionInput } from "../types/connection";
import {
  subscribeToConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} from "../services/connections";
import { useAuth } from "./use-auth";

export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToConnections(
      user.uid,
      (data) => {
        setConnections(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const create = async (input: CreateConnectionInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return createConnection(input, user.uid);
  };

  const update = async (id: string, input: UpdateConnectionInput) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return updateConnection(id, input, user.uid);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error("Usuario nao autenticado.");
    return deleteConnection(id);
  };

  return {
    connections,
    loading,
    error,
    create,
    update,
    remove,
  };
}
