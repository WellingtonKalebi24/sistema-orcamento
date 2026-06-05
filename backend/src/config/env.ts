import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1),
  TEST_DATABASE_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  LOG_LEVEL: z.string().default("info"),
  UPLOAD_DIR: z.string().default("./backend/uploads"),
  JWT_PRIVATE_KEY: z.string().min(16).default("dev-only-change-this-secret"),
  JWT_ISSUER: z.string().default("sistema-orcamento"),
  JWT_AUDIENCE: z.string().default("sistema-orcamento-web"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  COOKIE_SECRET: z.string().min(16).default("dev-cookie-secret-change"),
});

export const env = envSchema.parse({
  ...process.env,
  DATABASE_URL:
    process.env.NODE_ENV === "test"
      ? (process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL)
      : process.env.DATABASE_URL,
});

export const isProduction = env.NODE_ENV === "production";
