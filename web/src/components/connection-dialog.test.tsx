import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectionDialog } from "./connection-dialog";
import { Connection } from "../types/connection";

describe("ConnectionDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve validar nome com menos de 2 caracteres", async () => {
    render(
      <ConnectionDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText(/nome da conexao/i);
    await user.type(input, "A");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/pelo menos 2 caracteres/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("deve chamar onSubmit com nome valido", async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <ConnectionDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText(/nome da conexao/i);
    await user.type(input, "Nova Conexao WhatsApp");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith("Nova Conexao WhatsApp");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("deve carregar dados iniciais ao editar", () => {
    const mockConnection: Connection = {
      id: "c-1",
      name: "Conexao Existente",
      userId: "u-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <ConnectionDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={mockConnection}
      />
    );

    expect(screen.getByDisplayValue("Conexao Existente")).toBeInTheDocument();
    expect(screen.getByText("Editar Conexao")).toBeInTheDocument();
  });
});
