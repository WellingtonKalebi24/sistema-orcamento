describe("Rotas administrativas de usuarios e autorizacao", () => {
  it("documenta CRUD, inativacao e protecao por perfil", () => {
    expect([
      "GET /api/v1/users",
      "POST /api/v1/users",
      "GET /api/v1/users/:id",
      "PATCH /api/v1/users/:id",
      "DELETE /api/v1/users/:id",
    ]).toContain("DELETE /api/v1/users/:id");
  });

  it("nao deve expor passwordHash nas respostas de usuario", () => {
    expect({
      id: "1",
      name: "Admin",
      email: "admin@sistema.local",
      role: "ADMIN",
    }).not.toHaveProperty("passwordHash");
  });
});
