import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConnections } from "./use-connections";
import * as useAuthModule from "./use-auth";
import * as connectionsService from "../services/connections";
import { User } from "firebase/auth";
import { Connection } from "../types/connection";

vi.mock("./use-auth");
vi.mock("../services/connections");

describe("useConnections hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar com lista vazia se nao houver usuario autenticado", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useConnections());

    expect(result.current.loading).toBe(false);
    expect(result.current.connections).toEqual([]);
  });

  it("deve assinar as conexoes do usuario autenticado", () => {
    let callbackFn: ((data: Connection[]) => void) | null = null;
    vi.mocked(connectionsService.subscribeToConnections).mockImplementation((_uid, cb) => {
      callbackFn = cb;
      return vi.fn();
    });

    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: { uid: "user-123" } as User,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useConnections());

    expect(result.current.loading).toBe(true);

    const mockConnections: Connection[] = [
      {
        id: "c-1",
        name: "Conexao 1",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    act(() => {
      if (callbackFn) callbackFn(mockConnections);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.connections).toEqual(mockConnections);
  });
});
