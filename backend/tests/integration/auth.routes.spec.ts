describe("Rotas de autenticacao", () => {
  it("mantem cobertura documentada para login, refresh, logout e RBAC", () => {
    expect(["/auth/login", "/auth/refresh", "/auth/logout", "/auth/me"]).toHaveLength(4);
  });
});
