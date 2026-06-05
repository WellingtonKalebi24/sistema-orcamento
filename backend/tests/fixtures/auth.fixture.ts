import { PasswordProvider } from "../../src/providers/auth/password.provider";

export const adminFixture = {
  name: "Admin Teste",
  email: "admin.teste@sistema.local",
  password: "Admin@12345",
  role: "ADMIN" as const,
};

export async function adminUserData() {
  const password = new PasswordProvider();
  return {
    name: adminFixture.name,
    email: adminFixture.email,
    role: adminFixture.role,
    passwordHash: await password.hash(adminFixture.password),
  };
}
