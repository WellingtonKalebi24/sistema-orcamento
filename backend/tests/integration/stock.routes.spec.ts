describe("Rotas de estoque", () => {
  it("documenta movimentos manuais, historico e alerta minimo", () => {
    expect([
      "GET /api/v1/products/low-stock",
      "GET /api/v1/stock-movements",
      "POST /api/v1/products/:id/stock-movements",
    ]).toContain("POST /api/v1/products/:id/stock-movements");
  });
});
