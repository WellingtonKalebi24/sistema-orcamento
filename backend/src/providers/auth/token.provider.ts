import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

import { env } from "../../config/env";
import type { UserRole } from "../../types/domain";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

function secretKey() {
  return new TextEncoder().encode(env.JWT_PRIVATE_KEY);
}

function ttlSeconds(value: string) {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 900;
  const amount = Number(match[1]);
  const unit = match[2];
  if (unit === "s") return amount;
  if (unit === "m") return amount * 60;
  if (unit === "h") return amount * 60 * 60;
  return amount * 24 * 60 * 60;
}

export class TokenProvider {
  async signAccessToken(payload: AccessTokenPayload) {
    const now = Math.floor(Date.now() / 1000);
    return signJwt({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE,
      iat: now,
      exp: now + ttlSeconds(env.ACCESS_TOKEN_TTL),
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const payload = verifyJwt(token);

    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: payload.role as UserRole,
    };
  }

  createRefreshToken() {
    const token = randomBytes(48).toString("base64url");
    return {
      token,
      tokenHash: this.hashRefreshToken(token),
      familyId: randomUUID(),
      expiresAt: new Date(Date.now() + ttlSeconds(env.REFRESH_TOKEN_TTL) * 1000),
    };
  }

  hashRefreshToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function signJwt(payload: Record<string, unknown>) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secretKey())
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token: string) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) throw new Error("Invalid token");
  const expected = createHmac("sha256", secretKey())
    .update(`${header}.${body}`)
    .digest("base64url");
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
    throw new Error("Invalid signature");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Record<
    string,
    unknown
  >;
  if (payload.iss !== env.JWT_ISSUER || payload.aud !== env.JWT_AUDIENCE)
    throw new Error("Invalid claims");
  if (Number(payload.exp) < Math.floor(Date.now() / 1000)) throw new Error("Expired token");
  return payload;
}
