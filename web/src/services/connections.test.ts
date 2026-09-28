import { describe, it, expect, vi, beforeEach } from "vitest";
import * as connectionsService from "./connections";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ type: "collection" })),
  doc: vi.fn(() => ({ type: "document" })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
  getFirestore: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  db: {},
}));

describe("connections service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar uma conexao com nome, userId e timestamps", async () => {
    vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: "conn-123" } as any);

    const id = await connectionsService.createConnection({ name: "WhatsApp Vendas" }, "user-1");

    expect(id).toBe("conn-123");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "WhatsApp Vendas",
        userId: "user-1",
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
      })
    );
  });

  it("deve rejeitar criacao de conexao com nome menor que 2 caracteres", async () => {
    await expect(
      connectionsService.createConnection({ name: "A" }, "user-1")
    ).rejects.toThrow("O nome da conexao deve ter pelo menos 2 caracteres.");
  });

  it("deve atualizar uma conexao existente", async () => {
    vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

    await connectionsService.updateConnection("conn-123", { name: "WhatsApp Suporte" }, "user-1");

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "WhatsApp Suporte",
        updatedAt: "SERVER_TIMESTAMP",
      })
    );
  });

  it("deve deletar uma conexao existente", async () => {
    vi.mocked(firestore.deleteDoc).mockResolvedValueOnce();

    await connectionsService.deleteConnection("conn-123");

    expect(firestore.deleteDoc).toHaveBeenCalledWith(expect.anything());
  });
});
