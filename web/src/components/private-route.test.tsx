import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./private-route";
import * as useAuthModule from "../hooks/use-auth";
import { User } from "firebase/auth";

vi.mock("../hooks/use-auth");

describe("PrivateRoute", () => {
  it("deve renderizar o loading quando a autenticacao estiver carregando", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: true,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Area Protegida</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("auth-loading")).toBeInTheDocument();
    expect(screen.queryByText("Area Protegida")).not.toBeInTheDocument();
  });

  it("deve redirecionar para /login se nao houver usuario autenticado", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Area Protegida</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Tela de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Tela de Login")).toBeInTheDocument();
    expect(screen.queryByText("Area Protegida")).not.toBeInTheDocument();
  });

  it("deve renderizar o conteudo protegido quando houver usuario autenticado", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: { uid: "123", email: "user@test.com" } as User,
      loading: false,
      error: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Area Protegida</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Area Protegida")).toBeInTheDocument();
  });
});
