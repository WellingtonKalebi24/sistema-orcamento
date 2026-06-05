import { Router } from "express";

import { authRouter } from "./auth.routes";
import { catalogRouter } from "./catalog.routes";
import { clientRouter } from "./client.routes";
import { healthRouter } from "./health.routes";
import { quoteRouter } from "./quote.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/quotes", quoteRouter);
