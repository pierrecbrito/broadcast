import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { AppRoutes } from "./routes";
import * as useAuthModule from "./hooks/use-auth";
import { User } from "firebase/auth";

vi.mock("./hooks/use-auth");

function renderWithRouter(initialRoute = "/") {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("quando o usuario nao esta autenticado", () => {
    beforeEach(() => {
      vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
        user: null,
        loading: false,
        error: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        clearError: vi.fn(),
      });
    });

    it("deve renderizar a pagina de login na rota /login", () => {
      renderWithRouter("/login");
      expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("deve renderizar a pagina de cadastro na rota /register", () => {
      renderWithRouter("/register");
      expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    });

    it("deve redirecionar a rota raiz / para login se nao autenticado", () => {
      renderWithRouter("/");
      expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("deve renderizar a pagina 404 para rota desconhecida", () => {
      renderWithRouter("/rota-inexistente");
      expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();
      expect(screen.getByText(/pagina nao encontrada/i)).toBeInTheDocument();
    });
  });

  describe("quando o usuario esta autenticado", () => {
    beforeEach(() => {
      vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
        user: { uid: "user-1", email: "auth@example.com" } as User,
        loading: false,
        error: null,
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        clearError: vi.fn(),
      });
    });

    it("deve renderizar a tela de conexoes na rota /", () => {
      renderWithRouter("/");
      expect(screen.getByRole("heading", { name: /conexoes/i })).toBeInTheDocument();
      expect(screen.getByText("auth@example.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
    });

    it("deve redirecionar de /login para /connections se ja autenticado", () => {
      renderWithRouter("/login");
      expect(screen.getByRole("heading", { name: /conexoes/i })).toBeInTheDocument();
    });
  });
});
