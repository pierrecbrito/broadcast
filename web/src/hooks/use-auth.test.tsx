import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./use-auth";

let authCallback: ((user: unknown) => void) | null = null;

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    authCallback = callback;
    return vi.fn(); // unsubscribe
  }),
  getAuth: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
}));

vi.mock("../services/auth", () => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authCallback = null;
  });

  it("deve disparar erro se usado fora de AuthProvider", () => {
    // Suppress console.error for expected throw
    const originalConsoleError = console.error;
    console.error = vi.fn();

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth deve ser utilizado dentro de um AuthProvider"
    );

    console.error = originalConsoleError;
  });

  it("deve atualizar estado do usuario quando onAuthStateChanged emitir", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    act(() => {
      if (authCallback) {
        authCallback({ uid: "user-abc", email: "test@example.com" });
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual({ uid: "user-abc", email: "test@example.com" });
  });
});
