import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RegisterPage } from "./register";
import * as useAuthModule from "../hooks/use-auth";

vi.mock("../hooks/use-auth");

describe("RegisterPage", () => {
  const mockSignUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signUp: mockSignUp,
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });
  });

  it("deve validar se senhas nao coincidem", async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/e-mail/i), "novo@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "123456");
    await user.type(screen.getByLabelText(/confirmar senha/i), "654321");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/as senhas nao coincidem/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("deve validar senha com menos de 6 caracteres", async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/e-mail/i), "novo@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "123");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/pelo menos 6 caracteres/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("deve chamar signUp quando os dados forem validos", async () => {
    mockSignUp.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/e-mail/i), "novo@example.com");
    await user.type(screen.getByLabelText(/^senha/i), "123456");
    await user.type(screen.getByLabelText(/confirmar senha/i), "123456");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(mockSignUp).toHaveBeenCalledWith("novo@example.com", "123456");
  });
});
