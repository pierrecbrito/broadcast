import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContacts } from "./use-contacts";
import * as useAuthModule from "./use-auth";
import * as contactsService from "../services/contacts";
import * as connectionsService from "../services/connections";
import { User } from "firebase/auth";
import { Contact } from "../types/contact";

vi.mock("./use-auth");
vi.mock("../services/contacts");
vi.mock("../services/connections");

describe("useContacts hook", () => {
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

    const { result } = renderHook(() => useContacts("conn-1"));

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual([]);
  });

  it("deve assinar os contatos da conexao para o usuario autenticado", () => {
    let callbackFn: ((data: Contact[]) => void) | null = null;
    vi.mocked(contactsService.subscribeToContacts).mockImplementation((_cid, _uid, cb) => {
      callbackFn = cb;
      return vi.fn();
    });

    vi.mocked(connectionsService.getConnection).mockResolvedValueOnce({
      id: "conn-1",
      name: "Conexao Comercial",
      userId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
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

    const { result } = renderHook(() => useContacts("conn-1"));

    expect(result.current.loading).toBe(true);

    const mockContacts: Contact[] = [
      {
        id: "ct-1",
        name: "Carlos Eduardo",
        phone: "11987654321",
        connectionId: "conn-1",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    act(() => {
      if (callbackFn) callbackFn(mockContacts);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual(mockContacts);
  });
});
