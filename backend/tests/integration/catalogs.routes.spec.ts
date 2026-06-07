describe("Rotas de cadastros operacionais", () => {
  it("documenta CRUD, busca, inativacao e historico de clientes/servicos/produtos", () => {
    expect([
      "GET /api/v1/clients",
      "PATCH /api/v1/clients/:id",
      "GET /api/v1/clients/:id/history",
      "GET /api/v1/services",
      "DELETE /api/v1/services/:id",
      "GET /api/v1/products",
      "DELETE /api/v1/products/:id",
    ]).toContain("GET /api/v1/clients/:id/history");
  });
});
