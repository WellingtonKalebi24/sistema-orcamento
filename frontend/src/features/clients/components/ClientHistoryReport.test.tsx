import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ClientHistoryReport } from "./ClientHistoryReport";
import type { ClientHistory } from "../api/clients.api";

describe("Relatorio por cliente", () => {
  it("mostra detalhes de OS antiga sem presumir identidade do equipamento", () => {
    const client = { name: "Maria", document: "123", quotes: [], equipmentHistory: [], workOrders: [{ id: "1", number: "OS-1", status: "CONCLUIDA", openedAt: "2026-09-01T12:00:00Z", problemDescription: "Nao liga", executionDescription: "Limpeza", items: [] }] } as unknown as ClientHistory;
    render(<MemoryRouter><ClientHistoryReport client={client} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "OS-1" })).toHaveAttribute("href", "/ordens/1");
    expect(screen.getByText(/nao e possivel confirmar retorno/)).toBeInTheDocument();
    expect(screen.getByText("Execucao: Limpeza")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Imprimir / salvar PDF" })).toBeInTheDocument();
  });
});
