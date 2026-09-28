import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MessagesPage } from "./messages";
import * as useMessagesModule from "../hooks/use-messages";
import { Message } from "../types/message";

vi.mock("../hooks/use-messages");

describe("MessagesPage", () => {
  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar lista de mensagens com seus status", () => {
    const mockMessages: Message[] = [
      {
        id: "msg-1",
        body: "Campanha Black Friday disparada",
        contactIds: ["c1", "c2"],
        connectionId: "conn-1",
        userId: "u-1",
        status: "sent",
        scheduledAt: null,
        sentAt: new Date("2026-09-28T10:00:00Z"),
        createdAt: new Date("2026-09-28T10:00:00Z"),
        updatedAt: new Date("2026-09-28T10:00:00Z"),
      },
      {
        id: "msg-2",
        body: "Lembrete amanha cedo",
        contactIds: ["c1"],
        connectionId: "conn-1",
        userId: "u-1",
        status: "scheduled",
        scheduledAt: new Date("2026-09-29T08:00:00Z"),
        sentAt: null,
        createdAt: new Date("2026-09-28T11:00:00Z"),
        updatedAt: new Date("2026-09-28T11:00:00Z"),
      },
    ];

    vi.spyOn(useMessagesModule, "useMessages").mockReturnValue({
      messages: mockMessages,
      connectionName: "Canal Principal",
      contacts: [],
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter initialEntries={["/connections/conn-1/messages"]}>
        <Routes>
          <Route path="/connections/:id/messages" element={<MessagesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Campanha Black Friday disparada")).toBeInTheDocument();
    expect(screen.getByText("Lembrete amanha cedo")).toBeInTheDocument();
    expect(screen.getByText("Enviada")).toBeInTheDocument();
    expect(screen.getByText("Agendada")).toBeInTheDocument();

    // Apenas a mensagem agendada deve ter o botao Editar
    const editButtons = screen.getAllByRole("button", { name: /editar/i });
    expect(editButtons).toHaveLength(1);
  });

  it("deve abrir o modal de nova mensagem ao clicar no botao", async () => {
    vi.spyOn(useMessagesModule, "useMessages").mockReturnValue({
      messages: [],
      connectionName: "Canal Principal",
      contacts: [],
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter initialEntries={["/connections/conn-1/messages"]}>
        <Routes>
          <Route path="/connections/:id/messages" element={<MessagesPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /nova mensagem/i }));

    expect(screen.getByRole("heading", { name: /nova mensagem/i })).toBeInTheDocument();
  });
});
