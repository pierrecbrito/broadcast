import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ConnectionsPage } from "./connections";
import * as useConnectionsModule from "../hooks/use-connections";
import { Connection } from "../types/connection";

vi.mock("../hooks/use-connections");

describe("ConnectionsPage", () => {
  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar estado vazio quando nao houver conexoes", () => {
    vi.spyOn(useConnectionsModule, "useConnections").mockReturnValue({
      connections: [],
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter>
        <ConnectionsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/nenhuma conexao cadastrada/i)).toBeInTheDocument();
  });

  it("deve renderizar a lista de conexoes", () => {
    const mockConnections: Connection[] = [
      {
        id: "c-1",
        name: "Conexao Comercial",
        userId: "u-1",
        createdAt: new Date("2026-09-01"),
        updatedAt: new Date("2026-09-01"),
      },
      {
        id: "c-2",
        name: "Conexao Suporte",
        userId: "u-1",
        createdAt: new Date("2026-09-02"),
        updatedAt: new Date("2026-09-02"),
      },
    ];

    vi.spyOn(useConnectionsModule, "useConnections").mockReturnValue({
      connections: mockConnections,
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter>
        <ConnectionsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Conexao Comercial")).toBeInTheDocument();
    expect(screen.getByText("Conexao Suporte")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /contatos/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /mensagens/i })).toHaveLength(2);
  });

  it("deve abrir o dialog de criacao ao clicar em Nova Conexao", async () => {
    vi.spyOn(useConnectionsModule, "useConnections").mockReturnValue({
      connections: [],
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter>
        <ConnectionsPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /nova conexao/i }));

    expect(screen.getByRole("heading", { name: /nova conexao/i })).toBeInTheDocument();
  });
});
