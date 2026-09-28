import { describe, it, expect, vi, beforeEach } from "vitest";
import * as contactsService from "./contacts";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ type: "collection" })),
  doc: vi.fn(() => ({ type: "document" })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
  getFirestore: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  db: {},
}));

describe("contacts service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar um contato vinculado a uma conexao e usuario", async () => {
    vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: "contact-123" } as any);

    const id = await contactsService.createContact(
      "conn-1",
      { name: "Joao Silva", phone: "11999998888" },
      "user-1"
    );

    expect(id).toBe("contact-123");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "Joao Silva",
        phone: "11999998888",
        connectionId: "conn-1",
        userId: "user-1",
        createdAt: "SERVER_TIMESTAMP",
        updatedAt: "SERVER_TIMESTAMP",
      })
    );
  });

  it("deve rejeitar contato com nome menor que 2 caracteres", async () => {
    await expect(
      contactsService.createContact("conn-1", { name: "A", phone: "11999998888" }, "user-1")
    ).rejects.toThrow("O nome do contato deve ter pelo menos 2 caracteres.");
  });

  it("deve rejeitar contato sem telefone", async () => {
    await expect(
      contactsService.createContact("conn-1", { name: "Joao Silva", phone: "" }, "user-1")
    ).rejects.toThrow("O telefone do contato e obrigatorio.");
  });

  it("deve atualizar um contato existente", async () => {
    vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

    await contactsService.updateContact(
      "contact-123",
      { name: "Joao Santos", phone: "11988887777" },
      "user-1"
    );

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "Joao Santos",
        phone: "11988887777",
        updatedAt: "SERVER_TIMESTAMP",
      })
    );
  });

  it("deve deletar um contato existente", async () => {
    vi.mocked(firestore.deleteDoc).mockResolvedValueOnce();

    await contactsService.deleteContact("contact-123");

    expect(firestore.deleteDoc).toHaveBeenCalledWith(expect.anything());
  });
});
