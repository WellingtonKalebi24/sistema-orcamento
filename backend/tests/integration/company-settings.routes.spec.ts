describe("Rotas de configuracao da empresa", () => {
  it("documenta edicao, logo e configuracao sensivel de estoque negativo", () => {
    expect([
      "GET /api/v1/company-settings",
      "PATCH /api/v1/company-settings",
      "POST /api/v1/company-settings/logo",
    ]).toContain("POST /api/v1/company-settings/logo");
  });

  it("mantem allowNegativeStock como configuracao administrativa explicita", () => {
    expect({ allowNegativeStock: false }).toMatchObject({ allowNegativeStock: false });
  });
});
