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
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

function expressBodyLimit() {
  return (_request: unknown, _response: unknown, next: () => void) => next();
}
