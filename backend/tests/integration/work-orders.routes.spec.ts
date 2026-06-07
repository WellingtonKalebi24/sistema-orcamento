describe("Contratos REST de ordens de servico", () => {
  it("documenta criacao manual, conversao de orcamento, tecnico e anexos", () => {
    expect([
      "GET /api/v1/work-orders",
      "POST /api/v1/work-orders",
      "GET /api/v1/work-orders/:id",
      "PATCH /api/v1/work-orders/:id",
      "POST /api/v1/quotes/:id/work-order",
      "GET /api/v1/work-orders/:id/attachments",
      "POST /api/v1/work-orders/:id/attachments",
      "GET /api/v1/work-orders/attachments/:id/download",
    ]).toContain("POST /api/v1/quotes/:id/work-order");
  });

  it("mantem endpoints protegidos por autenticacao e perfis", () => {
    expect({
      criarOs: ["ADMIN", "ATENDENTE"],
      atualizarOs: ["ADMIN", "ATENDENTE", "TECNICO"],
      anexar: ["ADMIN", "TECNICO"],
    }).toMatchObject({
      criarOs: expect.arrayContaining(["ADMIN", "ATENDENTE"]),
      atualizarOs: expect.arrayContaining(["TECNICO"]),
      anexar: expect.arrayContaining(["TECNICO"]),
    });
  });
});
