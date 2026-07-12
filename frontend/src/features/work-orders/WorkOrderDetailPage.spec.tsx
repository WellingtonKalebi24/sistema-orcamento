import { render, screen } from "@testing-library/react";

import { WorkOrderStatusPanel } from "./components/WorkOrderStatusPanel";

describe("WorkOrderStatusPanel", () => {
  it("mostra status e acoes operacionais", () => {
    render(
      <WorkOrderStatusPanel
        workOrder={{
          id: "1",
          number: "OS-2026-00001",
          clientId: "client",
          openedAt: new Date().toISOString(),
          problemDescription: "Teste",
          chargedAmount: "0.00",
          totalCost: "0.00",
          estimatedProfit: "0.00",
          status: "ABERTA",
        }}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText(/Status da OS: Aberta/i)).toBeInTheDocument();
    expect(screen.getByText("Em andamento")).toBeInTheDocument();
  });
});
