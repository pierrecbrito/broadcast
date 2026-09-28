import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactDialog } from "./contact-dialog";

describe("ContactDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve validar nome com menos de 2 caracteres", async () => {
    render(
      <ContactDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/nome do contato/i);
    const phoneInput = screen.getByLabelText(/telefone/i);

    await user.type(nameInput, "A");
    await user.type(phoneInput, "11999998888");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/pelo menos 2 caracteres/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("deve validar telefone obrigatorio", async () => {
    render(
      <ContactDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/nome do contato/i);

    await user.type(nameInput, "Carlos Silva");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/telefone do contato e obrigatorio/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("deve submeter quando os dados forem validos", async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(
      <ContactDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/nome do contato/i), "Ana Paula");
    await user.type(screen.getByLabelText(/telefone/i), "11988887777");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith("Ana Paula", "11988887777");
    expect(mockOnClose).toHaveBeenCalled();
  });
});
