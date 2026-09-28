import { describe, it, expect, vi, beforeEach } from "vitest";
import * as messagesService from "./messages";
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
  Timestamp: {
    fromDate: vi.fn((date) => ({ toDate: () => date })),
  },
  getFirestore: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  db: {},
}));

describe("messages service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar uma mensagem com status sent quando scheduledAt nao for informado", async () => {
    vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: "msg-1" } as any);

    const id = await messagesService.createMessage(
      "conn-1",
      { body: "Promocao relampago!", contactIds: ["c1", "c2"] },
      "user-1"
    );

    expect(id).toBe("msg-1");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: "Promocao relampago!",
        contactIds: ["c1", "c2"],
        connectionId: "conn-1",
        userId: "user-1",
        status: "sent",
        sentAt: "SERVER_TIMESTAMP",
        scheduledAt: null,
      })
    );
  });

  it("deve criar uma mensagem com status scheduled quando scheduledAt for informado no futuro", async () => {
    vi.mocked(firestore.addDoc).mockResolvedValueOnce({ id: "msg-2" } as any);

    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const id = await messagesService.createMessage(
      "conn-1",
      {
        body: "Lembrete de reuniao",
        contactIds: ["c1"],
        scheduledAt: futureDate,
      },
      "user-1"
    );

    expect(id).toBe("msg-2");
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: "Lembrete de reuniao",
        contactIds: ["c1"],
        status: "scheduled",
        sentAt: null,
      })
    );
  });

  it("deve rejeitar mensagem sem conteudo", async () => {
    await expect(
      messagesService.createMessage(
        "conn-1",
        { body: "   ", contactIds: ["c1"] },
        "user-1"
      )
    ).rejects.toThrow("O conteudo da mensagem e obrigatorio.");
  });

  it("deve rejeitar mensagem sem contatos selecionados", async () => {
    await expect(
      messagesService.createMessage(
        "conn-1",
        { body: "Texto valido", contactIds: [] },
        "user-1"
      )
    ).rejects.toThrow("Selecione pelo menos um contato para enviar a mensagem.");
  });

  it("deve rejeitar agendamento com data no passado", async () => {
    const pastDate = new Date(Date.now() - 60 * 1000);
    await expect(
      messagesService.createMessage(
        "conn-1",
        { body: "Texto", contactIds: ["c1"], scheduledAt: pastDate },
        "user-1"
      )
    ).rejects.toThrow("O horario de agendamento deve ser uma data futura.");
  });

  it("deve impedir edicao de mensagem com status sent", async () => {
    vi.mocked(firestore.getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ status: "sent", body: "Ja enviada" }),
    } as any);

    await expect(
      messagesService.updateMessage(
        "msg-sent",
        { body: "Novo texto", contactIds: ["c1"] },
        "user-1"
      )
    ).rejects.toThrow("Apenas mensagens agendadas podem ser editadas.");
  });

  it("deve permitir edicao de mensagem com status scheduled", async () => {
    vi.mocked(firestore.getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ status: "scheduled", body: "Ainda agendada" }),
    } as any);
    vi.mocked(firestore.updateDoc).mockResolvedValueOnce();

    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    await messagesService.updateMessage(
      "msg-sched",
      { body: "Texto atualizado", contactIds: ["c1"], scheduledAt: futureDate },
      "user-1"
    );

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: "Texto atualizado",
        contactIds: ["c1"],
        updatedAt: "SERVER_TIMESTAMP",
      })
    );
  });
});
