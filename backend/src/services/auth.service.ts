import { AppError } from "../utils/app-error";
import { normalizeEmail } from "../utils/documents";
import { PasswordProvider } from "../providers/auth/password.provider";
import { TokenProvider } from "../providers/auth/token.provider";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { UserRepository } from "../repositories/user.repository";

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export class AuthService {
  constructor(
    private readonly users = new UserRepository(),
    private readonly refreshTokens = new RefreshTokenRepository(),
    private readonly passwords = new PasswordProvider(),
    private readonly tokens = new TokenProvider(),
  ) {}

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(normalizeEmail(input.email));
    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      throw AppError.unauthorized("E-mail ou senha invalidos.");
    }

    const matches = await this.passwords.compare(input.password, user.passwordHash);
    if (!matches) {
      throw AppError.unauthorized("E-mail ou senha invalidos.");
    }

    await this.users.updateLastLogin(user.id);
    return this.issueSession(user);
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw AppError.unauthorized("Sessao expirada.");
    const tokenHash = this.tokens.hashRefreshToken(refreshToken);
    const current = await this.refreshTokens.findValidByHash(tokenHash);
    if (!current || current.user.status !== "ACTIVE" || current.user.deletedAt) {
      throw AppError.unauthorized("Sessao expirada.");
    }

    const next = this.tokens.createRefreshToken();
    await this.refreshTokens.rotate(current.id, {
      userId: current.userId,
      familyId: current.familyId,
      tokenHash: next.tokenHash,
      expiresAt: next.expiresAt,
    });

    const accessToken = await this.tokens.signAccessToken({
      sub: current.user.id,
      email: current.user.email,
      role: current.user.role,
    });

    return { accessToken, refreshToken: next.token, user: publicUser(current.user) };
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    await this.refreshTokens.revoke(this.tokens.hashRefreshToken(refreshToken));
  }

  async currentUser(id: string) {
    const user = await this.users.findActiveById(id);
    if (!user) throw AppError.unauthorized();
    return publicUser(user);
  }

  private async issueSession(user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "ATENDENTE" | "TECNICO" | "FINANCEIRO";
    status: string;
  }) {
    const refreshToken = this.tokens.createRefreshToken();
    await this.refreshTokens.create({
      userId: user.id,
      familyId: refreshToken.familyId,
      tokenHash: refreshToken.tokenHash,
      expiresAt: refreshToken.expiresAt,
    });

    const accessToken = await this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken: refreshToken.token, user: publicUser(user) };
  }
}
