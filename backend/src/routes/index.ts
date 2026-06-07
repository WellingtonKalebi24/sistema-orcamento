import { Router } from "express";

import { attachmentRouter } from "./attachment.routes";
import { authRouter } from "./auth.routes";
import { catalogRouter } from "./catalog.routes";
import { clientRouter } from "./client.routes";
import { healthRouter } from "./health.routes";
import { quoteRouter } from "./quote.routes";
import { workOrderRouter } from "./work-order.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/quotes", quoteRouter);
apiRouter.use("/work-orders", workOrderRouter);
apiRouter.use("/attachments", attachmentRouter);
