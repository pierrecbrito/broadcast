import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageDialog } from "./message-dialog";
import { Contact } from "../types/contact";

describe("MessageDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockContacts: Contact[] = [
    {
      id: "ct-1",
      name: "Rodrigo Lima",
      phone: "11988880001",
      connectionId: "conn-1",
      userId: "u-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ct-2",
      name: "Fernanda Costa",
      phone: "11988880002",
      connectionId: "conn-1",
      userId: "u-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve validar se nenhum contato foi selecionado", async () => {
    render(
      <MessageDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        contacts={mockContacts}
      />
    );

    const user = userEvent.setup();
    const bodyInput = screen.getByPlaceholderText(/digite aqui o texto/i);
    await user.type(bodyInput, "Mensagem sem destinatarios");

    await user.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    expect(await screen.findByText(/selecione pelo menos um contato/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("deve validar mensagem com corpo vazio", async () => {
    render(
      <MessageDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        contacts={mockContacts}
      />
    );

    const user = userEvent.setup();
    // Seleciona um contato
    await user.click(screen.getByText("Rodrigo Lima"));

    await user.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    expect(await screen.findByText(/conteudo da mensagem e obrigatorio/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("deve enviar mensagem imediata com sucesso", async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <MessageDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        contacts={mockContacts}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("Rodrigo Lima"));
    await user.type(screen.getByPlaceholderText(/digite aqui o texto/i), "Ola mundo!");

    await user.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Ola mundo!",
        contactIds: ["ct-1"],
        scheduledAt: null,
      })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });
});
