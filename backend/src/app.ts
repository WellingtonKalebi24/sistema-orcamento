import express, { type Express } from "express";

import { healthRouter } from "./routes/health.routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());

  app.use("/health", healthRouter);

  return app;
}
