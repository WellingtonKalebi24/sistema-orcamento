import { AuthService } from "../../../src/services/auth.service";

describe("AuthService", () => {
  it("nega credenciais quando usuario nao existe", async () => {
    const service = new AuthService(
      { findByEmail: jest.fn().mockResolvedValue(null) } as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      service.login({ email: "x@example.com", password: "Admin@12345" }),
    ).rejects.toThrow("E-mail ou senha invalidos");
  });
});
