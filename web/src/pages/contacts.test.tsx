import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ContactsPage } from "./contacts";
import * as useContactsModule from "../hooks/use-contacts";
import { Contact } from "../types/contact";

vi.mock("../hooks/use-contacts");

describe("ContactsPage", () => {
  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar estado vazio quando nao houver contatos", () => {
    vi.spyOn(useContactsModule, "useContacts").mockReturnValue({
      contacts: [],
      connectionName: "WhatsApp Comercial",
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter initialEntries={["/connections/conn-1/contacts"]}>
        <Routes>
          <Route path="/connections/:id/contacts" element={<ContactsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/nenhum contato nesta conexao/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp Comercial/i)).toBeInTheDocument();
  });

  it("deve renderizar a tabela com contatos cadastrados", () => {
    const mockContacts: Contact[] = [
      {
        id: "ct-1",
        name: "Mariana Souza",
        phone: "(11) 91111-2222",
        connectionId: "conn-1",
        userId: "u-1",
        createdAt: new Date("2026-09-10"),
        updatedAt: new Date("2026-09-10"),
      },
    ];

    vi.spyOn(useContactsModule, "useContacts").mockReturnValue({
      contacts: mockContacts,
      connectionName: "WhatsApp Comercial",
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter initialEntries={["/connections/conn-1/contacts"]}>
        <Routes>
          <Route path="/connections/:id/contacts" element={<ContactsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Mariana Souza")).toBeInTheDocument();
    expect(screen.getByText("(11) 91111-2222")).toBeInTheDocument();
  });

  it("deve abrir o dialog de novo contato ao clicar no botao", async () => {
    vi.spyOn(useContactsModule, "useContacts").mockReturnValue({
      contacts: [],
      connectionName: "WhatsApp Comercial",
      loading: false,
      error: null,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    });

    render(
      <MemoryRouter initialEntries={["/connections/conn-1/contacts"]}>
        <Routes>
          <Route path="/connections/:id/contacts" element={<ContactsPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /novo contato/i }));

    expect(screen.getByRole("heading", { name: /novo contato/i })).toBeInTheDocument();
  });
});
