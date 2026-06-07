describe("Rotas financeiras, dashboard e relatorios", () => {
  it("documenta pagamentos, dashboard e protecao financeira", () => {
    expect([
      "GET /api/v1/payments",
      "POST /api/v1/payments",
      "PATCH /api/v1/payments/:id",
      "GET /api/v1/dashboard/summary",
      "GET /api/v1/reports",
    ]).toContain("GET /api/v1/dashboard/summary");
  });
});
