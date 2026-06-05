import cookieParser from "cookie-parser";
import express, { type Express } from "express";

import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/request-id.middleware";
import { applySecurity } from "./middlewares/security.middleware";
import { apiRouter } from "./routes";
import { healthRouter } from "./routes/health.routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  applySecurity(app);
  app.use(express.json());
  app.use(cookieParser());

  app.use("/health", healthRouter);
  app.use("/api/v1", apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
