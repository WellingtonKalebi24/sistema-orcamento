import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";

describe("LoginPage", () => {
  it("exibe formulario de acesso", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Entrar no sistema/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });
});
