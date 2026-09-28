import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, UserCredential } from "firebase/auth";
import { auth } from "../lib/firebase";
import * as authService from "../services/auth";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    setError(null);
    try {
      return await authService.signUp(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar usuario.";
      setError(message);
      throw err;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    try {
      return await authService.signIn(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao realizar login.";
      setError(message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await authService.signOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao deslogar.";
      setError(message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
