import { render, screen } from "@testing-library/react";

import { DashboardCharts } from "./components/DashboardCharts";

describe("DashboardCharts", () => {
  it("renderiza secoes de graficos", () => {
    render(
      <DashboardCharts
        summary={{
          cards: {
            quotesMonth: 0,
            quotesApproved: 0,
            quotesRejected: 0,
            monthlyRevenue: "0.00",
            estimatedProfit: "0.00",
            openWorkOrders: 0,
            inProgressServices: 0,
            lowStock: 0,
            clients: 0,
          },
          revenueSeries: [{ month: "Atual", revenue: 0 }],
          quoteStatus: [{ status: "RASCUNHO", total: 0 }],
          topProducts: [],
          latestQuotes: [],
          latestWorkOrders: [],
          details: {
            quotesMonth: [],
            quotesApproved: [],
            monthlyRevenue: [],
            estimatedProfit: [],
            openWorkOrders: [],
            inProgressServices: [],
            lowStock: [],
            clients: [],
          },
        }}
      />,
    );
    expect(screen.getByText(/Faturamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Status dos orcamentos/i)).toBeInTheDocument();
  });
});
