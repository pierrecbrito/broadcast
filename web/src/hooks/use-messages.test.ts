import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMessages } from "./use-messages";
import * as useAuthModule from "./use-auth";
import * as messagesService from "../services/messages";
import * as connectionsService from "../services/connections";
import * as contactsService from "../services/contacts";
import { User } from "firebase/auth";
import { Message } from "../types/message";

vi.mock("./use-auth");
vi.mock("../services/messages");
vi.mock("../services/connections");
vi.mock("../services/contacts");

describe("useMessages hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve inicializar vazio quando nao houver usuario autenticado", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useMessages("conn-1", "all"));

    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  it("deve assinar as mensagens com filtro de status", () => {
    let callbackFn: ((data: Message[]) => void) | null = null;
    vi.mocked(messagesService.subscribeToMessages).mockImplementation(
      (_cid, _uid, _filter, cb) => {
        callbackFn = cb;
        return vi.fn();
      }
    );

    vi.mocked(connectionsService.getConnection).mockResolvedValueOnce({
      id: "conn-1",
      name: "Conexao Geral",
      userId: "u-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(contactsService.getContactsByConnection).mockResolvedValueOnce([]);

    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: { uid: "u-1" } as User,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useMessages("conn-1", "scheduled"));

    expect(result.current.loading).toBe(true);

    const mockMessages: Message[] = [
      {
        id: "m-1",
        body: "Mensagem teste",
        contactIds: ["c-1"],
        connectionId: "conn-1",
        userId: "u-1",
        status: "scheduled",
        scheduledAt: new Date(),
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    act(() => {
      if (callbackFn) callbackFn(mockMessages);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual(mockMessages);
  });
});
