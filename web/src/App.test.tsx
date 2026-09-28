import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { AppRoutes } from "./routes";

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
  it("deve renderizar a pagina de login na rota /login", () => {
    renderWithRouter("/login");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("deve renderizar a pagina de cadastro na rota /register", () => {
    renderWithRouter("/register");
    expect(screen.getByRole("heading", { name: /cadastro/i })).toBeInTheDocument();
  });

  it("deve redirecionar a rota raiz / para conexoes", () => {
    renderWithRouter("/");
    expect(screen.getByRole("heading", { name: /conexoes/i })).toBeInTheDocument();
  });

  it("deve renderizar a pagina 404 para rota desconhecida", () => {
    renderWithRouter("/rota-inexistente");
    expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/pagina nao encontrada/i)).toBeInTheDocument();
  });
});
