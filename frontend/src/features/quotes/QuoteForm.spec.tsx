import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { QuoteForm } from "./components/QuoteForm";

describe("QuoteForm", () => {
  it("renderiza campos principais do orcamento", () => {
    render(
      <MemoryRouter>
        <QuoteForm />
      </MemoryRouter>,
    );
    expect(screen.getByText(/O que o cliente precisa/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar orcamento/i)).toBeInTheDocument();
  });
});
