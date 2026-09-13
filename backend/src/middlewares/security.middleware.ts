import cors from "cors";
import type { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "../config/env";

export function applySecurity(app: Express) {
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(expressBodyLimit());
}

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 50 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  requestWasSuccessful: (_request, response) => response.statusCode !== 401,
  handler: (_request, response) =>
    response.status(429).json({
      success: false,
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.",
        details: [],
      },
    }),
});

export const refreshRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Muitas renovacoes de sessao. Aguarde um minuto e entre novamente.",
      details: [],
    },
  },
});

function expressBodyLimit() {
  return (_request: unknown, _response: unknown, next: () => void) => next();
}
