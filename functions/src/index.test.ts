import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeScheduledTransition } from "./index";
import { Firestore } from "firebase-admin/firestore";

describe("executeScheduledTransition", () => {
  let mockDb: any;
  let mockBatch: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockBatch = {
      update: vi.fn(),
      commit: vi.fn().mockResolvedValue([]),
    };

    mockDb = {
      collection: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      get: vi.fn(),
      batch: vi.fn(() => mockBatch),
    };
  });

  it("deve retornar 0 quando nao houver mensagens a processar", async () => {
    mockDb.get.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    const count = await executeScheduledTransition(mockDb as unknown as Firestore);

    expect(count).toBe(0);
    expect(mockBatch.commit).not.toHaveBeenCalled();
  });

  it("deve atualizar mensagens vencidas para status sent", async () => {
    const mockDocs = [
      { ref: { id: "msg-1" } },
      { ref: { id: "msg-2" } },
    ];

    mockDb.get.mockResolvedValueOnce({
      empty: false,
      docs: mockDocs,
    });

    const now = new Date("2026-09-28T14:00:00Z");
    const count = await executeScheduledTransition(mockDb as unknown as Firestore, now);

    expect(count).toBe(2);
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(mockBatch.update).toHaveBeenCalledWith(
      { id: "msg-1" },
      expect.objectContaining({
        status: "sent",
      })
    );
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });
});
