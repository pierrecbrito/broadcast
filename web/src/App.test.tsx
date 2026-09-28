import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App smoke test", () => {
  it("deve renderizar o titulo Broadcast", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /broadcast/i })).toBeInTheDocument();
  });

  it("deve renderizar o botao de acao do Material UI", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /iniciar sessao/i })).toBeInTheDocument();
  });
});
